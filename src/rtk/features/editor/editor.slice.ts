import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UiSchema } from "@rjsf/utils";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";

import { ROOT_EFORM_ID_PREFIX } from "../../../components/FormInTheMiddle";
import { FieldType } from "../../../components/LeftSideBar";
import { descriptors } from "../../../rjsf/descriptors";
import { EditorState, FormData, RightPanelTab, StepDefinition } from "./editor.types";

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
      state.selectedFieldPropertiesFormData = {
        // Todo - Replace this with some mapping/reverse mapping function
        ...(state.formDefinition.stepDefinitions[state.activeStep].schema.properties?.[selectedField] as JSONSchema7),
        fieldName: selectedField,
      } as FormData;
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
    }),
    updateField: create.reducer((state, action: PayloadAction<{ schema: JSONSchema7; uiSchema: UiSchema }>) => {
      // state.activeTabInRightPanel = action.payload.activeTabInRightPanel;
      if (state.selectedField) {
        if (state.formDefinition.stepDefinitions[state.activeStep].schema.properties) {
          // @ts-expect-error: For some reason, even though we do undefined check, ts compiler shows error
          state.formDefinition.stepDefinitions[state.activeStep].schema.properties[state.selectedField] = action.payload.schema;
        }
        state.formDefinition.stepDefinitions[state.activeStep].uiSchema[state.selectedField] = action.payload.uiSchema;
      }
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
    }),
    updateFormData: create.reducer((state, action: PayloadAction<{ formData: FormData }>) => {
      state.formData = { ...action.payload.formData };
    }),
    updateSelectedFieldPropertiesFormData: create.reducer((state, action: PayloadAction<{ formData: FormData }>) => {
      state.selectedFieldPropertiesFormData = { ...action.payload.formData };
    }),
  }),
});

export const {
  updateSelectedFieldPropertiesFormData,
  updateFormData,
  deleteField,
  addField,
  updateField,
  updateActiveTabInRightPanel,
  switchAutoSave,
  updateSelectedField,
  switchDevMode,
} = editorSlice.actions;
export const editorReducer = editorSlice.reducer;
