import { descriptors } from "@/rjsf/descriptors";
import {
  generateUniqueFieldName,
  getEmptyStepDefinition,
  getSchemaFromDotPath,
  getUiSchemaFromDotPath,
  remove,
  replace,
  uniq,
} from "@/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UiSchema } from "@rjsf/utils";
import { castDraft, WritableDraft } from "immer";

import { getPropertiesSchema } from "@/components/FieldPropertiesForm";
import { FieldType } from "@/components/LeftPanel";

import { ROOT_EFORM_ID_PREFIX } from "@/constants";

import { EditorState, FormData, FormDefinition, RightPanelTab } from "./editor.types";

const initialState: EditorState = {
  activeStep: 0,
  autoSave: false,
  devMode: true,
  activeTabInRightPanel: "Inspect",
  selectedFieldPropertiesFormData: {},
  isAddStepModalOpen: false,
  formDefinition: {
    stepDefinitions: [
      {
        isThankYouPage: false,
        isSummaryPage: false,
        stepName: "Step-1",
        schema: {
          title: "A registration form",
          description: "A simple form example.",
          type: "object",
          required: ["firstName", "lastName"],
          properties: {
            firstName: {
              type: "string",
              title: "First name",
              default: "Chuck",
            },
            lastName: {
              type: "string",
              title: "Last name",
            },
            age: {
              type: "integer",
              title: "Age",
            },
            bio: {
              type: "string",
              title: "Bio",
            },
            password: {
              type: "string",
              title: "Password",
              minLength: 3,
            },
            telephone: {
              type: "string",
              title: "Telephone",
              minLength: 10,
            },
            personalDetails: {
              type: "object",
              title: "Personal Details",
              properties: {
                firstName: {
                  type: "string",
                  title: "First Name",
                },
                address: {
                  type: "object",
                  title: "Address",
                  properties: {
                    addressLine1: {
                      type: "string",
                      title: "Address Line 1",
                    },
                    addressLine2: {
                      type: "string",
                      title: "Address Line 2",
                    },
                  },
                },
              },
            },
            list: {
              type: "array",
              title: "List",
              items: {
                type: "object",
                title: "Address",
                properties: {
                  addressLine1: {
                    type: "string",
                    title: "Address Line 1",
                  },
                  addressLine2: {
                    type: "string",
                    title: "Address Line 2",
                  },
                },
              },
            },
          },
        },
        uiSchema: {
          "ui:order": ["firstName", "lastName", "age", "bio", "password", "telephone", "personalDetails", "list"],
          firstName: {
            "ui:autofocus": true,
            "ui:emptyValue": "",
            "ui:placeholder": "ui:emptyValue causes this field to always be valid despite being required",
            "ui:autocomplete": "family-name",
            "ui:enableMarkdownInDescription": true,
            "ui:description":
              "Make text **bold** or *italic*. Take a look at other options [here](https://markdown-to-jsx.quantizor.dev/).",
            "ui:options": {
              fieldType: "input",
            },
          },
          lastName: {
            "ui:autocomplete": "given-name",
            "ui:enableMarkdownInDescription": true,
            "ui:description":
              "Make things **bold** or *italic*. Embed snippets of `code`. <small>And this is a small texts.</small> ",
            "ui:options": {
              fieldType: "input",
            },
          },
          age: {
            "ui:widget": "updown",
            "ui:title": "Age of person",
            "ui:description": "(earth year)",
            "ui:options": {
              fieldType: "input",
            },
          },
          bio: {
            "ui:widget": "textarea",
            "ui:options": {
              fieldType: "textarea",
            },
          },
          password: {
            "ui:widget": "password",
            "ui:help": "Hint: Make it strong!",
            "ui:options": {
              fieldType: "input",
            },
          },
          telephone: {
            "ui:options": { inputType: "tel", fieldType: "input" },
          },
          personalDetails: {
            "ui:options": {
              fieldType: "group",
            },
            firstName: {
              "ui:placeholder": "Enter your first name",
              "ui:options": {
                fieldType: "input",
              },
            },
            address: {
              "ui:options": {
                fieldType: "group",
              },
              addressLine1: {
                "ui:placeholder": "Enter address line 1",
                "ui:options": {
                  fieldType: "input",
                },
              },
              addressLine2: {
                "ui:placeholder": "Enter address line 2",
                "ui:options": {
                  fieldType: "input",
                },
              },
            },
          },
          list: {
            "ui:options": {
              fieldType: "list",
            },
            items: {
              "ui:options": {
                fieldType: "group",
              },
              addressLine1: {
                "ui:placeholder": "Enter address line 1",
                "ui:options": {
                  fieldType: "input",
                },
              },
              addressLine2: {
                "ui:placeholder": "Enter address line 2",
                "ui:options": {
                  fieldType: "input",
                },
              },
            },
          },
        },
      },
    ],
  },
  // {
  //   stepDefinitions: [{ ...getEmptyStepDefinition() }],
  // }
  formData: {},
};

const mapFieldSchemasToFormData = ({
  activeStep,
  fieldName,
  formDefinition,
}: {
  fieldName: string;
  formDefinition: FormDefinition;
  activeStep: number;
}): FormData => {
  const { schema: stepSchema, uiSchema: stepUiSchema } = formDefinition.stepDefinitions[activeStep];
  const fieldSchema = getSchemaFromDotPath({
    dotPath: fieldName,
    schema: stepSchema,
    options: { parent: false },
  });
  console.log("fieldSchema => ", JSON.stringify(fieldSchema, null, 4));

  const fieldUiSchema = getUiSchemaFromDotPath({
    dotPath: fieldName,
    uiSchema: stepUiSchema,
    options: { parent: false },
  });

  const formData = {
    ...fieldSchema,
    ...fieldUiSchema?.["ui:options"],
    fieldName: fieldName.split(".").pop(),
    // To do - This is not correct. Get required [] of parent and then check
    required: formDefinition.stepDefinitions[activeStep].schema.required?.includes(fieldName),
    hidden:
      fieldUiSchema?.["ui:widget"] === "hidden" ||
      fieldUiSchema?.["ui:field"] === "hidden" ||
      fieldUiSchema?.["ui:template"] === "hidden" ||
      fieldUiSchema?.["ui:options"]?.hidden,
  };

  return formData as FormData;
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

      const { rules, schema, uiSchema } = getPropertiesSchema({
        activeStep: state.activeStep,
        formDefinition: state.formDefinition,
        selectedField,
      });

      state.inspectFieldSchemas = {
        schema,
        uiSchema: structuredClone(uiSchema) as WritableDraft<UiSchema>,
        rules,
      };
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

    resetFormData: create.reducer((state) => {
      state.formData = {};
    }),

    updateSelectedFieldPropertiesFormData: create.reducer(
      (state, action: PayloadAction<{ formData: Record<string, string> }>) => {
        state.selectedFieldPropertiesFormData = action.payload.formData;

        const oldFieldPath = state.selectedField;

        if (!oldFieldPath) {
          throw new Error("Selected field path is missing.");
        }

        const parts = oldFieldPath.split(".");
        const oldFieldName = parts.at(-1);
        const newFieldName = action.payload.formData.fieldName as string;

        if (!oldFieldName || !newFieldName) {
          throw new Error("field name is missing.");
        }

        const { schema: stepSchema, uiSchema: stepUiSchema } = state.formDefinition.stepDefinitions[state.activeStep];

        console.log("stepSchema => ", JSON.stringify(stepSchema, null, 4));
        const parentFieldSchema = getSchemaFromDotPath({
          dotPath: oldFieldPath,
          schema: stepSchema,
          options: { parent: true },
        });
        console.log("parentFieldSchema => ", JSON.stringify(parentFieldSchema, null, 4));

        const parentFieldUiSchema = getUiSchemaFromDotPath({
          dotPath: oldFieldPath,
          uiSchema: stepUiSchema,
          options: { parent: true },
        });
        console.log("parentFieldUiSchema => ", JSON.stringify(parentFieldUiSchema, null, 4));

        if (!parentFieldSchema || !parentFieldUiSchema || !parentFieldSchema.properties) {
          throw new Error("parent schema is missing.");
        }

        // Rename flow
        if (oldFieldName !== newFieldName) {
          const newFieldPath = [...parts.slice(0, -1), newFieldName].join(".");
          replace(parentFieldSchema?.required, oldFieldName, newFieldName, { mutate: true, unique: true });
          replace(parentFieldUiSchema?.["ui:order"], oldFieldName, newFieldName, { mutate: true, unique: true });
          parentFieldUiSchema[newFieldName] = parentFieldUiSchema[oldFieldName] as UiSchema;
          parentFieldSchema.properties[newFieldName] = parentFieldSchema.properties[oldFieldName];
          delete parentFieldUiSchema[oldFieldName];
          delete parentFieldSchema.properties[oldFieldName];
          state.selectedField = newFieldPath;
        }

        // Normal flow

        const fieldType = (parentFieldUiSchema[newFieldName] as UiSchema)["ui:options"]?.fieldType as FieldType | undefined;

        if (!fieldType) {
          throw new Error("fieldType is missing.");
        }
        const {
          propertiesConfiguration: {
            dataSchema: { properties: configProperties },
            mappings: { schema: schemaConfigProperties, uiSchema: uiSchemaConfigProperties },
          },
        } = descriptors[fieldType];

        if (!configProperties) {
          throw new Error("configProperties is missing.");
        }

        console.log("configProperties ", configProperties);

        for (const propertyKey of Object.keys(configProperties)) {
          console.log(`Checking ${propertyKey} => ${action.payload.formData[propertyKey]}`);
          if (propertyKey === "fieldName") {
            // DO nothing
          } else {
            if (propertyKey === "required") {
              if (action.payload.formData[propertyKey]) {
                // Add the field to required[]
                parentFieldSchema.required?.push(newFieldName);
                uniq(parentFieldSchema.required, { mutate: true });
              } else {
                // Remove the field from required[]
                remove(parentFieldSchema?.required, newFieldName, { mutate: true });
              }
            }

            // Schema fields
            else if (schemaConfigProperties.includes(propertyKey)) {
              console.log(`Updating ${propertyKey} => ${action.payload.formData[propertyKey]} => in schema`);
              // @ts-expect-error - ToDo
              parentFieldSchema.properties[newFieldName][propertyKey] = action.payload.formData[propertyKey];
            }

            // UiOptions fields
            else if (uiSchemaConfigProperties.includes(propertyKey)) {
              console.log(`Updating ${propertyKey} => ${action.payload.formData[propertyKey]} => in uiSchema`);

              parentFieldUiSchema[newFieldName]["ui:options"][propertyKey] = action.payload.formData[propertyKey];
            }
          }
        }
        state.formData = {};
        console.log("updated ui schema => ", JSON.stringify(parentFieldUiSchema[newFieldName], null, 4));
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
      state.activeStep = state.formDefinition.stepDefinitions.length - 1;
    }),
  }),
});

export const {
  addField,
  addStep,
  deleteField,
  resetFormData,
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
