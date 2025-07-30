import { descriptors } from "@/rjsf/descriptors";
import { CustomPatch } from "@/rjsf/descriptors/descriptors.types";
import { getEmptyStepDefinition, getSchemaByPath, getUiSchemaByPath } from "@/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UiSchema } from "@rjsf/utils";
import { applyPatch as jsonApplyPatch } from "fast-json-patch";
import type { Operation } from "fast-json-patch";
import { JSONSchema7 } from "json-schema";

import { FieldType } from "@/components/LeftPanel";

import { getRequiredArrayByPath } from "@/utils/getRequiredArrayByPath";
import { FORM_ID_PREFIXES, RightPanelTabs } from "@/constants";

import { mapFormDataToFieldSchemas } from "./editor.slice";
import { FormData, FormDefinition, RightPanelTab, StepDefinition } from "./editor.types";

interface EditorState {
  selectedFieldPath?: string;
  devMode: boolean;
  autoSave: boolean;
  activeRightPanelTab: RightPanelTab;
  activeStep: number;
  formDefinition: FormDefinition;
  formData: FormData;
  propertiesFormData: FormData;
  isAddStepModalOpen?: boolean;
}

export interface MapFormDataToFieldSchemasArgs {
  activeStep: number;
  fieldName: string;
  formData: FormData;
  formDefinition: FormDefinition;
}

export type Patch = {
  op: "replace" | "add" | "remove";
  path: string;
  value?: unknown;
};

/**
 * Applies a single custom patch to either schema, uiSchema, or metadata.
 */
export function applyCustomPatch(
  patch: CustomPatch,
  schema: JSONSchema7,
  uiSchema: UiSchema,
  requiredFields: string[],
  value: unknown,
  fieldName: string
): { schema: JSONSchema7; uiSchema: UiSchema; requiredFields: string[] } {
  const { op, path, type } = patch;

  const patchOperation = {
    op,
    path,
    value,
  } as Operation;

  switch (type) {
    case "schema": {
      const patched = jsonApplyPatch(structuredClone(schema), [patchOperation], false).newDocument;

      return { schema: patched, uiSchema, requiredFields };
    }

    case "uiSchema": {
      const patched = jsonApplyPatch(structuredClone(uiSchema), [patchOperation], false).newDocument;

      return { schema, uiSchema: patched, requiredFields };
    }

    case "meta": {
      let updatedRequired = [...requiredFields];
      if (path === "required") {
        if (op === "replace" || op === "add") {
          updatedRequired = value ? [...new Set([...requiredFields, fieldName])] : requiredFields.filter((f) => f !== fieldName);
        }
      }

      return { schema, uiSchema, requiredFields: updatedRequired };
    }

    default:
      throw new Error(`Unknown patch type: ${type satisfies never}`);
  }
}

const initialState: EditorState = {
  activeStep: 0,
  autoSave: false,
  devMode: true,
  formDefinition: {
    stepDefinitions: [{ ...getEmptyStepDefinition() }],
  },
  formData: {},
  propertiesFormData: {},
  activeRightPanelTab: RightPanelTabs.Inspect,
};

const isFieldHidden = (fieldUiSchema?: UiSchema): boolean =>
  fieldUiSchema?.["ui:widget"] === "hidden" ||
  fieldUiSchema?.["ui:field"] === "hidden" ||
  fieldUiSchema?.["ui:template"] === "hidden" ||
  fieldUiSchema?.["ui:options"]?.hidden;

/**
 * Converts field schema + uiSchema into flat formData.
 */
export const mapFieldSchemasToPropertiesFormData = ({
  activeStep,
  fieldPath,
  formDefinition,
}: {
  fieldPath: string;
  formDefinition: FormDefinition;
  activeStep: number;
}): FormData => {
  const fieldName = fieldPath.split(".").pop() as string;
  const stepDefinition = formDefinition.stepDefinitions[activeStep];

  const fieldUiSchema = getUiSchemaByPath({ path: fieldPath, uiSchema: stepDefinition.uiSchema });
  const fieldSchema = getSchemaByPath({ path: fieldPath, schema: stepDefinition.schema });

  const required = getRequiredArrayByPath({ path: fieldPath, schema: stepDefinition.schema })?.includes(fieldName);
  const hidden = isFieldHidden(fieldUiSchema);

  const fieldType: FieldType | undefined = fieldUiSchema?.["ui:options"]?.fieldType;
  if (!fieldType) {
    throw new Error(`Missing fieldType for field: ${fieldPath}`);
  }

  const unfilteredFormData: Record<string, unknown> = {
    fieldName: fieldPath.split(".").pop(),
    required,
    hidden,
    ...fieldSchema,
    ...fieldUiSchema?.["ui:options"],
  };

  // Only pick keys that are configured in the descriptor's data schema
  const allowedKeys = Object.keys(descriptors[fieldType].propertiesConfiguration.dataSchema.properties || {});

  const propertiesFormData: Record<string, unknown> = {};
  for (const key of allowedKeys) {
    if (key in unfilteredFormData) {
      propertiesFormData[key] = unfilteredFormData[key];
    }
  }

  return propertiesFormData as FormData;
};

/**
 * Converts flat formData back into schema + uiSchema using only descriptor patches.
 */
export const mapPropertiesFormDataToFieldSchemas = ({
  fieldPath,
  propertiesFormData,
  stepDefinition,
}: {
  fieldPath: string;
  stepDefinition: StepDefinition;
  propertiesFormData: FormData;
  fieldName: string;
}): StepDefinition => {
  const oldFieldName = fieldPath.split(".").pop() as string;
  const newFieldName = (propertiesFormData as { fieldName: string }).fieldName;

  const parentUiSchema = getUiSchemaByPath({ path: fieldPath, uiSchema: stepDefinition.uiSchema, getParent: true });
  const fieldUiSchema = getUiSchemaByPath({ path: fieldPath, uiSchema: stepDefinition.uiSchema, getParent: false });

  const parentSchema = getSchemaByPath({ path: fieldPath, schema: stepDefinition.schema, getParent: true });
  const fieldSchema = getSchemaByPath({ path: fieldPath, schema: stepDefinition.schema, getParent: false });

  if (parentUiSchema === undefined || fieldUiSchema === undefined || parentSchema === undefined || fieldSchema === undefined) {
    throw new Error("Error");
  }
  let requiredFields = parentSchema?.required ?? [];
  const uiOrder = parentUiSchema?.["ui:order"] ?? ["*"];

  const hidden = isFieldHidden(fieldUiSchema);

  const fieldType: FieldType | undefined = fieldUiSchema?.["ui:options"]?.fieldType;
  if (!fieldType) {
    throw new Error(`Missing fieldType for field: ${fieldPath}`);
  }
  const descriptor = descriptors[fieldType];

  const fieldPatches = descriptor.propertiesConfiguration.patches;
  for (const property of Object.keys(descriptor.propertiesConfiguration.dataSchema)) {
    const value = (propertiesFormData as Record<string, unknown>)[property];
    if (property === "required") {
      if (value) {
        requiredFields.push(oldFieldName);
      } else {
        requiredFields = requiredFields.filter((f) => f !== oldFieldName);
      }
    } else if (property !== "fieldName") {
      const { type } = fieldPatches[property];
      if (type === "schema") {
        fieldSchema[property] = value;
      } else if (type === "uiSchema") {
        fieldUiSchema["ui:options"] = { ...fieldUiSchema["ui:options"], [property]: value };
      }
    }
  }

  // handle renaming field
  if (newFieldName !== oldFieldName) {
    // required array
    const requiredIndex = requiredFields.indexOf(oldFieldName);
    if (requiredIndex !== -1) {
      requiredFields[requiredIndex] = newFieldName;
    }

    // ui:order array
    const orderIndex = uiOrder?.indexOf(oldFieldName);
    if (uiOrder && orderIndex !== undefined && orderIndex !== -1) {
      uiOrder[orderIndex] = newFieldName;
    }
  }

  return stepDefinition;
};

export const removePrefixesFromFieldPath = (path: string) => {
  const segments = path.split(".");
  while (FORM_ID_PREFIXES.includes(segments[0])) {
    segments.shift();
  }

  return segments.join(".");
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: (create) => ({
    updateSelectedFieldPath: create.reducer((state, action: PayloadAction<{ selectedFieldPath: string }>) => {
      // Step 1: Extract any relevant state values needed for processing
      const { activeStep, formDefinition } = state;

      // Step 2: Extract and preprocess data from the action payload
      let { selectedFieldPath } = action.payload;
      selectedFieldPath = removePrefixesFromFieldPath(selectedFieldPath);

      // Step 3: Perform any derived calculations or transformations
      const propertiesFormData = mapFieldSchemasToPropertiesFormData({
        activeStep,
        fieldPath: selectedFieldPath,
        formDefinition,
      });

      // Step 4: Mutate the state with updated values
      state.selectedFieldPath = selectedFieldPath;
      state.activeRightPanelTab = RightPanelTabs.Inspect;
      state.propertiesFormData = propertiesFormData;
    }),

    updatepropertiesFormData: create.reducer((state, action: PayloadAction<{ formData: Record<string, string> }>) => {
      state.propertiesFormData = { ...action.payload.formData };
      if (state.selectedFieldPath) {
        const {
          requiredFields: newRequiredFields,
          schema: newSchema,
          uiSchema: newUiSchema,
        } = mapFormDataToFieldSchemas({
          activeStep: state.activeStep,
          fieldName: state.selectedFieldPath as string,
          formData: state.propertiesFormData,
          formDefinition: state.formDefinition,
        });
        const isFieldRenamed = (state.propertiesFormData as { fieldName: string }).fieldName !== state.selectedFieldPath;
        const newFieldName = isFieldRenamed
          ? (state.propertiesFormData as { fieldName: string }).fieldName
          : state.selectedFieldPath;
        if (state.formDefinition.stepDefinitions[state.activeStep].schema.properties) {
          if (isFieldRenamed) {
            // @ts-expect-error: For some reason, even though we do undefined check, ts compiler shows error
            delete state.formDefinition.stepDefinitions[state.activeStep].schema.properties[state.selectedFieldPath];
            delete state.formDefinition.stepDefinitions[state.activeStep].uiSchema[state.selectedFieldPath];
            state.selectedFieldPath = newFieldName;
          }
          // @ts-expect-error: For some reason, even though we do undefined check, ts compiler shows error
          state.formDefinition.stepDefinitions[state.activeStep].schema.properties[newFieldName] = { ...newSchema };
        }
        state.formDefinition.stepDefinitions[state.activeStep].schema.required = [...newRequiredFields];
        state.formDefinition.stepDefinitions[state.activeStep].uiSchema[newFieldName] = { ...newUiSchema };
      }
    }),
  }),
});

export const { updateSelectedFieldPath, updatepropertiesFormData } = editorSlice.actions;

export const editorReducer = editorSlice.reducer;
