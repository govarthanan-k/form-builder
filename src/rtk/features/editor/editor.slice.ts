import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UIOptionsType, UiSchema } from "@rjsf/utils";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";

import { ROOT_EFORM_ID_PREFIX } from "../../../components/FormInTheMiddle";
import { FieldType } from "../../../components/LeftSideBar";
import { descriptors } from "../../../rjsf/descriptors";
import { EditorState, FormData, FormDefinition, RightPanelTab, StepDefinition } from "./editor.types";

export const EMPTY_STEP_DEFINITION: StepDefinition = {
  schema: { type: "object", required: [], properties: {} },
  uiSchema: { "ui:order": [] },
};

const initialState: EditorState = {
  activeStep: 0,
  autoSave: false,
  devMode: true,
  formDefinition: {
    stepDefinitions: [{ ...EMPTY_STEP_DEFINITION }],
  },
  formData: {},
};

export const generateUniqueFieldName = (
  existingFields: Record<string, JSONSchema7Definition>,
  prefix: string,
  padding: number = 3
): string => {
  let index = 1;
  let newName = `${prefix}_${String(index).padStart(padding, "0")}`;

  while (newName in existingFields) {
    index++;
    newName = `${prefix}_${String(index).padStart(padding, "0")}`;
  }

  return newName;
};

const mapFieldSchemasToFormData = ({
  fieldName,
  formDefinition,
  activeStep,
}: {
  fieldName: string;
  formDefinition: FormDefinition;
  activeStep: number;
}): FormData => {
  const fieldUiSchema = formDefinition.stepDefinitions[activeStep].uiSchema[fieldName] as UiSchema;

  const formData = {
    ...(formDefinition.stepDefinitions[activeStep].schema.properties?.[fieldName] as JSONSchema7),
    ...fieldUiSchema["ui:options"],
    fieldName,
    required: formDefinition.stepDefinitions[activeStep].schema.required?.includes(fieldName),
    hidden:
      fieldUiSchema["ui:widget"] === "hidden" ||
      fieldUiSchema["ui:field"] === "hidden" ||
      fieldUiSchema["ui:template"] === "hidden" ||
      fieldUiSchema["ui:options"]?.hidden,
  };

  return formData as FormData;
};

const mapFormDataToFieldSchemas = ({
  fieldName,
  formData,
  formDefinition,
  activeStep,
}: {
  fieldName: string;
  formData: FormData;
  formDefinition: FormDefinition;
  activeStep: number;
}): { schema: JSONSchema7; uiSchema: UiSchema; requiredFields: string[] } => {
  let fieldSchema: JSONSchema7 = formDefinition.stepDefinitions[activeStep].schema.properties?.[fieldName] as JSONSchema7;
  let fieldUiSchema: UiSchema = formDefinition.stepDefinitions[activeStep].uiSchema[fieldName];
  let newRequiredFields = [...(formDefinition.stepDefinitions[activeStep].schema.required || [])];

  const fieldType: FieldType = fieldUiSchema["ui:options"]?.fieldType;

  if (fieldType) {
    const { fieldsOfUiOptions } = descriptors[fieldType].propertiesConfiguration;

    const newUiOptions: UIOptionsType = {};
    const newSchemaProps: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (fieldsOfUiOptions?.includes(key)) {
        newUiOptions[key] = value;
      } else if (key === "required") {
        if (value && !newRequiredFields.includes(fieldName)) {
          newRequiredFields.push(fieldName);
        } else if (!value && newRequiredFields.includes(fieldName)) {
          newRequiredFields = newRequiredFields.filter((reqFieldName) => reqFieldName !== fieldName);
        }
      } else if (!["fieldName"].includes(key)) {
        newSchemaProps[key] = value;
      }
    });

    fieldUiSchema = {
      ...fieldUiSchema,
      "ui:options": {
        ...newUiOptions,
      },
    };

    fieldSchema = {
      ...newSchemaProps,
    };
  }
  return { schema: fieldSchema, uiSchema: fieldUiSchema, requiredFields: newRequiredFields };
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
      const newFieldName = generateUniqueFieldName(existingFields, action.payload.fieldType);

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
            schema: newSchema,
            uiSchema: newUiSchema,
            requiredFields: newRequiredFields,
          } = mapFormDataToFieldSchemas({
            activeStep: state.activeStep,
            fieldName: state.selectedField as string,
            formData: state.selectedFieldPropertiesFormData,
            formDefinition: state.formDefinition,
          });

          if (state.formDefinition.stepDefinitions[state.activeStep].schema.properties) {
            // @ts-expect-error: For some reason, even though we do undefined check, ts compiler shows error
            state.formDefinition.stepDefinitions[state.activeStep].schema.properties[state.selectedField] = { ...newSchema };
          }
          state.formDefinition.stepDefinitions[state.activeStep].schema.required = [...newRequiredFields];
          state.formDefinition.stepDefinitions[state.activeStep].uiSchema[state.selectedField] = { ...newUiSchema };
        }
      }
    ),
  }),
});

export const {
  updateSelectedFieldPropertiesFormData,
  updateFormData,
  deleteField,
  addField,
  updateActiveTabInRightPanel,
  switchAutoSave,
  updateSelectedField,
  switchDevMode,
} = editorSlice.actions;
export const editorReducer = editorSlice.reducer;
