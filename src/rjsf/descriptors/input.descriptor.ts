import { Descriptor } from "./descriptors.types";

export const inputFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "string",
    title: "New Input Field",
  },
  uiSchema: {
    "ui:options": {
      fieldType: "input",
      limitErrorMessage: "this is limit error messsafe",
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
      "ui:groupOrder": ["General Settings", "Field Constraints", "*"],
      "General Settings": {
        "ui:order": ["fieldID", "title", "*"],
      },
      "Field Constraints": {
        "ui:order": ["pattern", "patternErrorMessage", "minLength", "maxLength", "limitErrorMessage", "*"],
      },
      fieldID: {
        "ui:autofocus": true,
        "ui:options": {},
        "ui:group": "General Settings",
      },
      title: {
        "ui:options": {},
        "ui:group": "General Settings",
      },
      default: {
        "ui:options": {},
        "ui:group": "General Settings",
      },
      placeholder: {
        "ui:options": {},
        "ui:group": "General Settings",
      },
      required: {
        "ui:options": {},
        "ui:group": "General Settings",
      },
      readOnly: { "ui:options": {}, "ui:group": "General Settings" },
      hidden: { "ui:options": {}, "ui:group": "General Settings" },
      pattern: { "ui:options": {}, "ui:group": "Field Constraints" },
      patternErrorMessage: { "ui:widget": "textarea", "ui:options": {}, "ui:group": "Field Constraints" },
      hint: {
        "ui:options": {},
        "ui:group": "General Settings",
      },
      description: {
        "ui:widget": "textarea",
        "ui:options": {},
        "ui:group": "General Settings",
      },
      minLength: {
        "ui:options": {},
        "ui:group": "Field Constraints",
      },
      maxLength: {
        "ui:options": {},
        "ui:group": "Field Constraints",
      },
      limitErrorMessage: { "ui:widget": "textarea", "ui:options": {}, "ui:group": "Field Constraints" },
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
