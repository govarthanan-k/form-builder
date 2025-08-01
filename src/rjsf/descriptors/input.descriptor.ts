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
      "ui:groupOrder": ["Basic", "Validations", "*"],
      Basic: {
        "ui:order": ["fieldID", "title", "*"],
      },
      Validations: {
        "ui:order": ["required", "pattern", "patternErrorMessage", "minLength", "maxLength", "limitErrorMessage", "*"],
      },
      fieldID: {
        "ui:autofocus": true,
        "ui:options": {},
        "ui:group": "Basic",
      },
      title: {
        "ui:options": {},
        "ui:group": "Basic",
      },
      default: {
        "ui:options": {},
        "ui:group": "Basic",
      },
      placeholder: {
        "ui:options": {},
        "ui:group": "Basic",
      },
      required: {
        "ui:options": {},
        "ui:group": "Validations",
      },
      readOnly: { "ui:options": {}, "ui:group": "Basic" },
      hidden: { "ui:options": {}, "ui:group": "Basic" },
      pattern: { "ui:options": {}, "ui:group": "Validations" },
      patternErrorMessage: { "ui:widget": "textarea", "ui:options": {}, "ui:group": "Validations" },
      hint: {
        "ui:options": {},
        "ui:group": "Basic",
      },
      description: {
        "ui:widget": "textarea",
        "ui:options": {},
        "ui:group": "Basic",
      },
      minLength: {
        "ui:options": {},
        "ui:group": "Validations",
      },
      maxLength: {
        "ui:options": {},
        "ui:group": "Validations",
      },
      limitErrorMessage: { "ui:widget": "textarea", "ui:options": {}, "ui:group": "Validations" },
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
