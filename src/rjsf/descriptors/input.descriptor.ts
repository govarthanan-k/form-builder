import { Descriptor } from "./descriptors.types";

export const inputFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "string",
    title: "New Input Field",
    default: "Gova",
    description: "This is the field description",
  },
  uiSchema: {
    "ui:options": {
      fieldType: "input",
    },
  },
  propertiesConfiguration: {
    dataSchema: {
      type: "object",
      required: ["fieldID", "title"],
      properties: {
        fieldID: {
          type: "string",
          title: "Field ID",
          pattern: "^[A-Za-z]",
          description: "This is the key under which this field's value gets stored in the form data",
        },
        title: {
          type: "string",
          title: "Field Label",
        },
        default: {
          type: "string",
          title: "Default Value",
        },
        placeholder: {
          type: "string",
          title: "Placeholder",
        },
        required: {
          type: "boolean",
          title: "Required?",
        },
        readOnly: { type: "boolean", title: "Read Only?" },
        hidden: { type: "boolean", title: "Hidden?" },
        pattern: { type: "string", title: "Regex Pattern" },
        patternErrorMessage: { type: "string", title: "Pattern Error Message" },
        hint: {
          type: "string",
          title: "Hint",
        },
        description: {
          type: "string",
          title: "Description",
        },
        minLength: {
          type: "number",
          title: "Minimum Length",
        },
        maxLength: {
          type: "number",
          title: "Maximum Length",
        },
        limitErrorMessage: { type: "string", title: "Limit Error Message" },
      },
    },
    uiSchema: {
      fieldID: {
        "ui:autofocus": true,
        "ui:options": {},
      },
      title: {
        "ui:options": {},
      },
      default: {
        "ui:options": {},
      },
      placeholder: {
        "ui:options": {},
      },
      required: {
        "ui:options": {},
      },
      readOnly: { "ui:options": {} },
      hidden: { "ui:options": {} },
      pattern: { "ui:options": {} },
      patternErrorMessage: { "ui:widget": "textarea", "ui:options": {} },
      hint: {
        "ui:options": {},
      },
      description: {
        "ui:widget": "textarea",
        "ui:options": {},
      },
      minLength: {
        "ui:options": {},
      },
      maxLength: {
        "ui:options": {},
      },
      limitErrorMessage: { "ui:widget": "textarea", "ui:options": {} },
    },
    rules: [
      {
        conditions: {
          not: {
            or: [
              {
                minLength: { greater: 0 },
              },
              {
                maxLength: { greater: 0 },
              },
            ],
          },
        },
        event: {
          type: "remove",
          params: {
            field: ["limitErrorMessage"],
          },
        },
      },
      {
        conditions: {
          pattern: "empty",
        },
        event: {
          type: "remove",
          params: {
            field: ["patternErrorMessage"],
          },
        },
      },
    ],
    mappings: {
      schema: ["title", "description", "default", "readOnly", "pattern", "minLength", "maxLength"],
      uiSchema: ["hidden", "placeholder", "patternErrorMessage", "hint", "limitErrorMessage"],
    },
  },
};
