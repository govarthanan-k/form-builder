import { descriptors } from "@/rjsf/descriptors";
import { generateUniqueFieldName, getEmptyStepDefinition, getSchemaByPath, getUiSchemaByPath } from "@/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UiSchema } from "@rjsf/utils";
import { castDraft } from "immer";
import { JSONSchema7 } from "json-schema";

import { FieldType } from "@/components/LeftPanel";

import { isFieldRequired } from "@/utils/isFieldRequired";
import { ROOT_EFORM_ID_PREFIX } from "@/constants";

import { EditorState, FormData, FormDefinition, RightPanelTab } from "./editor.types";

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

export function applyPatch<T>(obj: T, path: string, value: unknown): T {
  const parts = path.split(".");
  const last = parts.pop() as string;

  let current: unknown = obj;
  for (const part of parts) {
    if (typeof current === "object" && current !== null && !(part in current)) {
      (current as Record<string, unknown>)[part] = {};
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (typeof current === "object" && current !== null) {
    (current as Record<string, unknown>)[last] = value;
  }

  return obj;
}

const initialState: EditorState = {
  activeStep: 0,
  autoSave: false,
  devMode: true,
  formDefinition: {
    stepDefinitions: [{ ...getEmptyStepDefinition() }],
  },
  formData: {},
};

const isFieldHidden = (fieldUiSchema?: UiSchema): boolean =>
  fieldUiSchema?.["ui:widget"] === "hidden" ||
  fieldUiSchema?.["ui:field"] === "hidden" ||
  fieldUiSchema?.["ui:template"] === "hidden" ||
  fieldUiSchema?.["ui:options"]?.hidden;

/**
 * Converts field schema + uiSchema into flat formData.
 */
export const mapFieldSchemasToFormData = ({
  activeStep,
  fieldName,
  formDefinition,
}: {
  fieldName: string;
  formDefinition: FormDefinition;
  activeStep: number;
}): FormData => {
  const step = formDefinition.stepDefinitions[activeStep];

  const uiSchema = getUiSchemaByPath({ path: fieldName, uiSchema: step.uiSchema });
  const schema = getSchemaByPath({ path: fieldName, schema: step.schema });

  const required = isFieldRequired({ path: fieldName, schema: step.schema });
  const hidden = isFieldHidden(uiSchema);

  const fieldType = uiSchema?.["ui:options"]?.fieldType;
  if (!fieldType) throw new Error(`Missing fieldType for field: ${fieldName}`);

  const formData: Record<string, unknown> = {
    fieldName,
    required,
    hidden,
    ...schema,
    ...uiSchema["ui:options"],
  };

  // Only pick keys that are configured in the descriptor's data schema
  const allowedKeys = Object.keys(descriptors[fieldType as FieldType].propertiesConfiguration.dataSchema.properties || {});

  const result: Record<string, unknown> = {};
  for (const key of allowedKeys) {
    if (key in formData) {
      result[key] = formData[key];
    }
  }

  return result as FormData;
};

/**
 * Converts flat formData back into schema + uiSchema using only descriptor patches.
 */
export const mapFormDataToFieldSchemas = ({
  activeStep,
  fieldName,
  formData,
  formDefinition,
}: MapFormDataToFieldSchemasArgs): {
  schema: JSONSchema7;
  uiSchema: UiSchema;
  requiredFields: string[];
} => {
  const step = formDefinition.stepDefinitions[activeStep];
  const originalFieldName = fieldName;
  const newFieldName = (formData as { fieldName: string }).fieldName;
  const uiSchema = step.uiSchema[originalFieldName] ?? {};
  const requiredFields = [...(step.schema.required ?? [])];
  const uiOrder = step.uiSchema["ui:order"];

  const fieldType = uiSchema["ui:options"]?.fieldType as FieldType;
  const descriptor = descriptors[fieldType];

  let updatedSchema: JSONSchema7 = {};
  let updatedUiSchema: UiSchema = {};
  let newRequiredFields = [...requiredFields];

  for (const [fieldKey, value] of Object.entries(formData)) {
    const patches = descriptor.propertiesConfiguration.uiSchema?.[fieldKey]?.patches ?? [];

    for (const patch of patches) {
      if (patch.type === "schema") {
        updatedSchema = applyPatch(updatedSchema, patch.path, value);
      } else if (patch.type === "uiSchema") {
        updatedUiSchema = applyPatch(updatedUiSchema, patch.path, value);
      } else if (patch.type === "meta" && patch.path === "required") {
        if (value) {
          if (!newRequiredFields.includes(originalFieldName)) {
            newRequiredFields.push(originalFieldName);
          }
        } else {
          newRequiredFields = newRequiredFields.filter((f) => f !== originalFieldName);
        }
      }
    }
  }

  // handle renaming field
  if (newFieldName !== originalFieldName) {
    const idx = newRequiredFields.indexOf(originalFieldName);
    if (idx !== -1) {
      newRequiredFields[idx] = newFieldName;
    }

    const orderIndex = uiOrder?.indexOf(originalFieldName);
    if (uiOrder && orderIndex !== undefined && orderIndex !== -1) {
      uiOrder[orderIndex] = newFieldName;
    }
  }

  return {
    schema: updatedSchema,
    uiSchema: updatedUiSchema,
    requiredFields: newRequiredFields,
  };
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: (create) => ({
    updateSelectedField: create.reducer((state, action: PayloadAction<{ selectedField: string }>) => {
      let { selectedField } = action.payload;
      selectedField = selectedField.startsWith(`${ROOT_EFORM_ID_PREFIX}.`)
        ? selectedField.slice(`${ROOT_EFORM_ID_PREFIX}.`.length)
        : selectedField;
      state.selectedField = selectedField;
      state.activeTabInRightPanel = "Inspect";
      state.selectedFieldPropertiesFormData = mapFieldSchemasToFormData({
        activeStep: state.activeStep,
        fieldName: selectedField,
        formDefinition: state.formDefinition,
      });
    }),

    switchDevMode: create.reducer((state) => {
      state.devMode = !state.devMode;
      state.activeTabInRightPanel = "Inspect";
    }),

    switchAutoSave: create.reducer((state) => {
      state.autoSave = !state.autoSave;
    }),

    updateActiveTabInRightPanel: create.reducer((state, action: PayloadAction<{ activeTabInRightPanel: RightPanelTab }>) => {
      state.activeTabInRightPanel = action.payload.activeTabInRightPanel;
    }),

    addField: create.reducer((state, action: PayloadAction<{ fieldType: FieldType }>) => {
      const { dataSchema, uiSchema } = descriptors[action.payload.fieldType];
      const step = state.formDefinition.stepDefinitions[state.activeStep];
      step.schema.properties ??= {};
      const existingFields = step.schema.properties;
      const newFieldName = generateUniqueFieldName({ existingFields, prefix: action.payload.fieldType });
      existingFields[newFieldName] = { ...dataSchema };
      step.uiSchema[newFieldName] = { ...uiSchema };
      step.uiSchema["ui:order"] = [...(step.uiSchema["ui:order"] ?? []), newFieldName];
      // Todo - Remove this later
      step.schema.required = [...(step.schema.required || []), newFieldName];
    }),

    deleteField: create.reducer((state, action: PayloadAction<{ fieldId: string }>) => {
      let { fieldId } = action.payload;
      fieldId = fieldId.startsWith(`${ROOT_EFORM_ID_PREFIX}.`) ? fieldId.slice(`${ROOT_EFORM_ID_PREFIX}.`.length) : fieldId;
      if (state.formDefinition.stepDefinitions[state.activeStep].schema.properties) {
        // @ts-expect-error: For some reason, even though we do undefined check, ts compiler shows error
        delete state.formDefinition.stepDefinitions[state.activeStep].schema.properties[fieldId];
      }
      delete state.formDefinition.stepDefinitions[state.activeStep].uiSchema[fieldId];
      state.formDefinition.stepDefinitions[state.activeStep].uiSchema["ui:order"] = state.formDefinition.stepDefinitions[
        state.activeStep
      ].uiSchema["ui:order"]?.filter((value) => value !== fieldId);
      state.formDefinition.stepDefinitions[state.activeStep].schema.required = state.formDefinition.stepDefinitions[
        state.activeStep
      ].schema.required?.filter((value) => value !== fieldId);
      state.selectedField = undefined;
    }),

    updateFormData: create.reducer((state, action: PayloadAction<{ formData: FormData }>) => {
      state.formData = { ...action.payload.formData };
    }),

    updateSelectedFieldPropertiesFormData: create.reducer(
      (state, action: PayloadAction<{ formData: Record<string, string> }>) => {
        state.selectedFieldPropertiesFormData = { ...action.payload.formData };
        if (state.selectedField) {
          const {
            requiredFields: newRequiredFields,
            schema: newSchema,
            uiSchema: newUiSchema,
          } = mapFormDataToFieldSchemas({
            activeStep: state.activeStep,
            fieldName: state.selectedField as string,
            formData: state.selectedFieldPropertiesFormData,
            formDefinition: state.formDefinition,
          });
          const isFieldRenamed =
            (state.selectedFieldPropertiesFormData as { fieldName: string }).fieldName !== state.selectedField;
          const newFieldName = isFieldRenamed
            ? (state.selectedFieldPropertiesFormData as { fieldName: string }).fieldName
            : state.selectedField;
          if (state.formDefinition.stepDefinitions[state.activeStep].schema.properties) {
            if (isFieldRenamed) {
              // @ts-expect-error: For some reason, even though we do undefined check, ts compiler shows error
              delete state.formDefinition.stepDefinitions[state.activeStep].schema.properties[state.selectedField];
              delete state.formDefinition.stepDefinitions[state.activeStep].uiSchema[state.selectedField];
              state.selectedField = newFieldName;
            }
            // @ts-expect-error: For some reason, even though we do undefined check, ts compiler shows error
            state.formDefinition.stepDefinitions[state.activeStep].schema.properties[newFieldName] = { ...newSchema };
          }
          state.formDefinition.stepDefinitions[state.activeStep].schema.required = [...newRequiredFields];
          state.formDefinition.stepDefinitions[state.activeStep].uiSchema[newFieldName] = { ...newUiSchema };
        }
      }
    ),

    updateActiveStep: create.reducer((state, action: PayloadAction<{ activeStep: number }>) => {
      state.activeStep = action.payload.activeStep;
      state.selectedField = undefined;
    }),

    updateAddStepModalOpen: create.reducer((state, action: PayloadAction<{ isOpen: boolean }>) => {
      state.isAddStepModalOpen = action.payload.isOpen;
    }),

    addStep: create.reducer((state, action: PayloadAction<{ stepName: string; stepType: "Step" | "Summary" | "ThankYou" }>) => {
      const newStepDefinition = getEmptyStepDefinition(action.payload.stepType, action.payload.stepName);
      state.formDefinition.stepDefinitions.push(castDraft(newStepDefinition));
    }),
  }),
});

export const {
  addField,
  addStep,
  deleteField,
  switchAutoSave,
  switchDevMode,
  updateActiveStep,
  updateActiveTabInRightPanel,
  updateAddStepModalOpen,
  updateFormData,
  updateSelectedField,
  updateSelectedFieldPropertiesFormData,
} = editorSlice.actions;

export const editorReducer = editorSlice.reducer;
