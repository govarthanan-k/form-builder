import { descriptors } from "@/rjsf/descriptors";
import {
  generateUniqueFieldID,
  getEmptyStepDefinition,
  getFieldSettingsFormConfig,
  getSchemaFromDotPath,
  getUiSchemaFromDotPath,
  remove,
  replace,
  uniq,
} from "@/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UiSchema } from "@rjsf/utils";
import { castDraft, WritableDraft } from "immer";
import { JSONSchema7 } from "json-schema";

import { FieldType } from "@/components/LeftPanel";

import { ROOT_EFORM_ID_PREFIX } from "@/constants";

import { EditorState, FormData, FormDefinition, RightPanelTab } from "./editor.types";

export const formTemplates = [
  { name: "Customer Intake", lastModified: "2025-07-30", author: "Alice", version: "1.0.2" },
  { name: "Feedback Form", lastModified: "2025-07-28", author: "Bob", version: "0.9.8" },
  { name: "Survey", lastModified: "2025-07-20", author: "Charlie", version: "2.1.0" },
  { name: "Contact Us", lastModified: "2025-07-29", author: "Diana", version: "1.3.4" },
  { name: "Registration", lastModified: "2025-07-26", author: "Ethan", version: "1.0.0" },
  { name: "Login Form", lastModified: "2025-07-25", author: "Fiona", version: "0.8.2" },
  { name: "Bug Report", lastModified: "2025-07-24", author: "George", version: "1.1.1" },
  { name: "Event RSVP", lastModified: "2025-07-23", author: "Hannah", version: "1.2.3" },
  { name: "Job Application", lastModified: "2025-07-22", author: "Ian", version: "2.0.0" },
  { name: "Checkout", lastModified: "2025-07-21", author: "Jasmine", version: "1.0.5" },
  { name: "Newsletter Signup", lastModified: "2025-07-19", author: "Kyle", version: "0.5.9" },
  { name: "Support Ticket", lastModified: "2025-07-18", author: "Laura", version: "1.0.3" },
  { name: "Onboarding", lastModified: "2025-07-17", author: "Michael", version: "1.4.0" },
  { name: "Review Request", lastModified: "2025-07-16", author: "Nina", version: "2.2.2" },
  { name: "User Profile", lastModified: "2025-07-15", author: "Oscar", version: "1.0.1" },
  { name: "Settings Form", lastModified: "2025-07-14", author: "Paula", version: "0.7.7" },
  { name: "Beta Signup", lastModified: "2025-07-13", author: "Quinn", version: "1.3.3" },
  { name: "Unsubscribe", lastModified: "2025-07-12", author: "Ryan", version: "1.0.0" },
  { name: "Donation", lastModified: "2025-07-11", author: "Sophia", version: "1.1.0" },
  { name: "Order Form", lastModified: "2025-07-10", author: "Tom", version: "1.0.4" },
  { name: "Feedback Survey", lastModified: "2025-07-09", author: "Uma", version: "2.0.0" },
  { name: "Shipping Info", lastModified: "2025-07-08", author: "Victor", version: "1.0.2" },
  { name: "Contact Directory", lastModified: "2025-07-07", author: "Wendy", version: "1.1.5" },
  { name: "Training Feedback", lastModified: "2025-07-06", author: "Xander", version: "2.0.1" },
  { name: "Employee Exit", lastModified: "2025-07-05", author: "Yara", version: "1.0.3" },
  { name: "User Consent", lastModified: "2025-07-04", author: "Zach", version: "1.1.2" },
  { name: "Student Enrollment", lastModified: "2025-07-03", author: "Aaron", version: "1.3.0" },
  { name: "Health Declaration", lastModified: "2025-07-02", author: "Becky", version: "2.1.1" },
  { name: "Covid Check-in", lastModified: "2025-07-01", author: "Carl", version: "1.2.5" },
  { name: "Meal Order", lastModified: "2025-06-30", author: "Dana", version: "0.9.9" },
  { name: "Access Request", lastModified: "2025-06-29", author: "Eli", version: "1.0.7" },
  { name: "Report Abuse", lastModified: "2025-06-28", author: "Faye", version: "1.2.8" },
  { name: "Feature Request", lastModified: "2025-06-27", author: "Glen", version: "1.3.6" },
  { name: "Leave Application", lastModified: "2025-06-26", author: "Hilda", version: "1.0.9" },
  { name: "Performance Review", lastModified: "2025-06-25", author: "Irene", version: "2.0.3" },
  { name: "Course Feedback", lastModified: "2025-06-24", author: "Jake", version: "1.2.0" },
  { name: "Insurance Claim", lastModified: "2025-06-23", author: "Kim", version: "1.1.7" },
  { name: "Return Request", lastModified: "2025-06-22", author: "Liam", version: "1.4.5" },
  { name: "Maintenance Log", lastModified: "2025-06-21", author: "Mira", version: "1.0.6" },
  { name: "Budget Proposal", lastModified: "2025-06-20", author: "Noah", version: "2.0.2" },
  { name: "Audit Checklist", lastModified: "2025-06-19", author: "Olivia", version: "1.3.7" },
  { name: "Time Off Request", lastModified: "2025-06-18", author: "Pete", version: "1.0.8" },
  { name: "Event Feedback", lastModified: "2025-06-17", author: "Queenie", version: "1.2.4" },
  { name: "Training Signup", lastModified: "2025-06-16", author: "Raj", version: "1.1.9" },
  { name: "Inventory Update", lastModified: "2025-06-15", author: "Sara", version: "0.9.7" },
  { name: "Supplier Form", lastModified: "2025-06-14", author: "Tim", version: "1.0.1" },
  { name: "Client Feedback", lastModified: "2025-06-13", author: "Usha", version: "1.3.8" },
  { name: "Guest Registration", lastModified: "2025-06-12", author: "Vik", version: "1.2.6" },
  { name: "Service Request", lastModified: "2025-06-11", author: "Wes", version: "1.1.4" },
  { name: "Safety Inspection", lastModified: "2025-06-10", author: "Xena", version: "1.0.6" },
  { name: "Travel Request", lastModified: "2025-06-09", author: "Yusuf", version: "2.1.4" },
  { name: "Recruitment Form", lastModified: "2025-06-08", author: "Zara", version: "1.4.1" },
  { name: "Performance Goals", lastModified: "2025-06-07", author: "Alan", version: "1.0.0" },
  { name: "Resignation", lastModified: "2025-06-06", author: "Bianca", version: "1.0.1" },
  { name: "Promotion Request", lastModified: "2025-06-05", author: "Cody", version: "1.0.3" },
  { name: "Equipment Checkout", lastModified: "2025-06-04", author: "Drew", version: "1.1.0" },
];

export const samplePreviewSchema: JSONSchema7 = {
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First name",
    },
    lastName: {
      type: "string",
      title: "Last name",
    },
    age: {
      type: "integer",
      title: "Age",
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
  },
};

const initialState: EditorState = {
  activeStep: 0,
  autoSave: false,
  devMode: true,
  activeTabInRightPanel: "Inspect",
  inspectType: "Form",
  selectedFieldPropertiesFormData: {},
  isAddStepModalOpen: false,
  formDefinition: {
    formId: "Account_Opening_Form",
    formName: "Account Opening Form",
    stepDefinitions: [
      {
        isThankYouPage: false,
        isSummaryPage: false,
        stepName: "Step-1",
        schema: {
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
    adGroups: ["admin"],
    formType: "Stepped Form",
    status: "Draft",
    authenticationEnabled: true,
    mfaEnabled: false,
    lwbEnabled: false,
    createdBy: "Govarthanan K",
    createdAt: "04-08-2025 12.34.56 PM",
    lastModifiedBy: "Govarthanan K",
    lastModifiedAt: "10-12-2025 12.34.56 PM",
    version: 102,
    team: "Voltron",
    customerReferenceTemplate: "Account_Opening_Form_Reference",
  },
  formData: {},
  formTemplates,
};

const mapFieldSchemasToFormData = ({
  activeStep,
  fieldID,
  formDefinition,
}: {
  fieldID: string;
  formDefinition: FormDefinition;
  activeStep: number;
}): FormData => {
  const { schema: stepSchema, uiSchema: stepUiSchema } = formDefinition.stepDefinitions[activeStep];
  const fieldSchema = getSchemaFromDotPath({
    dotPath: fieldID,
    schema: stepSchema,
    options: { parent: false },
  });

  const fieldUiSchema = getUiSchemaFromDotPath({
    dotPath: fieldID,
    uiSchema: stepUiSchema,
    options: { parent: false },
  });

  const formData = {
    ...fieldSchema,
    ...fieldUiSchema?.["ui:options"],
    fieldID: fieldID.split(".").pop(),
    // To do - This is not correct. Get required [] of parent and then check
    required: formDefinition.stepDefinitions[activeStep].schema.required?.includes(fieldID),
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
        fieldID: selectedField,
        formDefinition: state.formDefinition,
      });

      const { rules, schema, uiSchema } = getFieldSettingsFormConfig({
        activeStep: state.activeStep,
        formDefinition: state.formDefinition,
        selectedField,
      });

      state.inspectFieldSchemas = {
        schema,
        // need to check why we need to typecast only for ui schema
        uiSchema: structuredClone(uiSchema) as WritableDraft<UiSchema>,
        rules,
      };
      state.inspectType = "Field";
    }),

    switchDevMode: create.reducer((state) => {
      state.devMode = !state.devMode;
      state.activeTabInRightPanel = "Inspect";
    }),

    switchAutoSave: create.reducer((state) => {
      state.autoSave = !state.autoSave;
    }),

    updateAdGroups: create.reducer((state, action: PayloadAction<{ adGroups: string[] }>) => {
      state.formDefinition.adGroups = action.payload.adGroups;
    }),

    updateActiveTabInRightPanel: create.reducer((state, action: PayloadAction<{ activeTabInRightPanel: RightPanelTab }>) => {
      state.activeTabInRightPanel = action.payload.activeTabInRightPanel;
    }),

    updateInspectType: create.reducer((state, action: PayloadAction<{ inspectType: "Step" | "Form" | "Field" | undefined }>) => {
      state.inspectType = action.payload.inspectType;
    }),

    addField: create.reducer((state, action: PayloadAction<{ fieldType: FieldType }>) => {
      const { dataSchema, uiSchema } = descriptors[action.payload.fieldType];
      const step = state.formDefinition.stepDefinitions[state.activeStep];
      step.schema.properties ??= {};
      const existingFields = step.schema.properties;
      const newFieldID = generateUniqueFieldID({ existingFields, prefix: action.payload.fieldType });
      existingFields[newFieldID] = { ...dataSchema };
      step.uiSchema[newFieldID] = { ...uiSchema };
      step.uiSchema["ui:order"] = [...(step.uiSchema["ui:order"] ?? []), newFieldID];
    }),

    deleteField: create.reducer((state, action: PayloadAction<{ fieldId: string }>) => {
      let { fieldId } = action.payload;
      fieldId = fieldId.startsWith(`${ROOT_EFORM_ID_PREFIX}.`) ? fieldId.slice(`${ROOT_EFORM_ID_PREFIX}.`.length) : fieldId;
      const fieldName = fieldId.split(".").pop() as string;

      const parentSchema = getSchemaFromDotPath({
        dotPath: fieldId,
        schema: state.formDefinition.stepDefinitions[state.activeStep].schema,
        options: { parent: true },
      });

      const parentUiSchema = getUiSchemaFromDotPath({
        dotPath: fieldId,
        uiSchema: state.formDefinition.stepDefinitions[state.activeStep].uiSchema,
        options: { parent: true },
      });

      if (parentSchema?.properties?.[fieldName]) {
        delete parentSchema.properties[fieldName];
        remove(parentSchema.required, fieldName, { mutate: true });
      }
      if (parentUiSchema?.[fieldId]) {
        delete parentUiSchema[fieldId];
        remove(parentUiSchema["ui:order"], fieldName, { mutate: true });
      }

      if (state.selectedField === fieldId) {
        state.selectedField = undefined;
        state.inspectType = "Step";
      }
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
        const oldFieldID = parts.at(-1);
        const newFieldID = action.payload.formData.fieldID as string;

        if (!oldFieldID || !newFieldID) {
          throw new Error("field ID is missing.");
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
        if (oldFieldID !== newFieldID) {
          const newFieldPath = [...parts.slice(0, -1), newFieldID].join(".");
          replace(parentFieldSchema?.required, oldFieldID, newFieldID, { mutate: true, unique: true });
          replace(parentFieldUiSchema?.["ui:order"], oldFieldID, newFieldID, { mutate: true, unique: true });
          parentFieldUiSchema[newFieldID] = parentFieldUiSchema[oldFieldID] as UiSchema;
          parentFieldSchema.properties[newFieldID] = parentFieldSchema.properties[oldFieldID];
          delete parentFieldUiSchema[oldFieldID];
          delete parentFieldSchema.properties[oldFieldID];
          state.selectedField = newFieldPath;
        }

        // Normal flow

        const fieldType = (parentFieldUiSchema[newFieldID] as UiSchema)["ui:options"]?.fieldType as FieldType | undefined;

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

        for (const propertyKey of Object.keys(configProperties)) {
          console.log(`Checking ${propertyKey} => ${action.payload.formData[propertyKey]}`);
          if (propertyKey === "fieldID") {
            // DO nothing
          } else {
            if (propertyKey === "required") {
              if (action.payload.formData[propertyKey]) {
                // Add the field to required[]
                parentFieldSchema.required?.push(newFieldID);
                uniq(parentFieldSchema.required, { mutate: true });
              } else {
                // Remove the field from required[]
                remove(parentFieldSchema?.required, newFieldID, { mutate: true });
              }
            }

            // Schema fields
            else if ((schemaConfigProperties as string[]).includes(propertyKey)) {
              console.log(`Updating ${propertyKey} => ${action.payload.formData[propertyKey]} => in schema`);
              // @ts-expect-error - ToDo
              parentFieldSchema.properties[newFieldID][propertyKey] = action.payload.formData[propertyKey];
            }

            // UiOptions fields
            else if (uiSchemaConfigProperties.includes(propertyKey)) {
              console.log(`Updating ${propertyKey} => ${action.payload.formData[propertyKey]} => in uiSchema`);

              parentFieldUiSchema[newFieldID]["ui:options"][propertyKey] = action.payload.formData[propertyKey];
            }
          }
        }
        state.formData = {};
      }
    ),

    updateActiveStep: create.reducer((state, action: PayloadAction<{ activeStep: number }>) => {
      state.activeStep = action.payload.activeStep;
      state.selectedField = undefined;
      state.inspectType = "Step";
    }),

    updateAddStepModalOpen: create.reducer((state, action: PayloadAction<{ isOpen: boolean }>) => {
      state.isAddStepModalOpen = action.payload.isOpen;
    }),

    updateTemplatePreviewOpen: create.reducer((state, action: PayloadAction<{ isOpen: boolean; templateId?: string }>) => {
      state.isTemplatePreviewOpen = action.payload.isOpen;
      state.selectedFormTemplateForPreview = action.payload.templateId;
    }),

    addStep: create.reducer((state, action: PayloadAction<{ stepName: string; stepType: "Step" | "Summary" | "ThankYou" }>) => {
      const newStepDefinition = getEmptyStepDefinition(action.payload.stepType, action.payload.stepName);
      state.formDefinition.stepDefinitions.push(castDraft(newStepDefinition));
      state.activeStep = state.formDefinition.stepDefinitions.length - 1;
      state.inspectType = "Step";
    }),

    deleteStep: create.reducer((state, action: PayloadAction<{ index: number }>) => {
      state.formDefinition.stepDefinitions.splice(action.payload.index, 1);
      state.activeStep = 0;
      state.inspectType = "Step";
    }),

    reorderSteps: create.reducer((state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const { newIndex, oldIndex } = action.payload;

      [state.formDefinition.stepDefinitions[oldIndex], state.formDefinition.stepDefinitions[newIndex]] = [
        state.formDefinition.stepDefinitions[newIndex],
        state.formDefinition.stepDefinitions[oldIndex],
      ];
    }),

    updateStepDetails: create.reducer((state, action: PayloadAction<{ stepName: string }>) => {
      const { stepName } = action.payload;
      state.formDefinition.stepDefinitions[state.activeStep].stepName = stepName;
    }),
  }),
});

export const {
  addField,
  addStep,
  deleteField,
  deleteStep,
  reorderSteps,
  resetFormData,
  switchAutoSave,
  switchDevMode,
  updateActiveStep,
  updateActiveTabInRightPanel,
  updateAdGroups,
  updateAddStepModalOpen,
  updateFormData,
  updateInspectType,
  updateSelectedField,
  updateSelectedFieldPropertiesFormData,
  updateStepDetails,
  updateTemplatePreviewOpen,
} = editorSlice.actions;

export const editorReducer = editorSlice.reducer;
