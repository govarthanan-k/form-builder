import { Descriptor } from ".";

export const checkboxFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "boolean",
    title: "New Checkbox Field",
  },
  uiSchema: {
    "ui:options": {
      description: "This is the field description",
      fieldType: "checkbox",
    },
  },
  propertiesConfiguration: {
    dataSchema: {
      type: "object",
      required: ["fieldName", "title"],
      properties: {
        fieldName: {
          type: "string",
          title: "Field Name",
        },
        title: {
          type: "string",
          title: "Field Label",
        },
      },
    },
    uiSchema: {
      fieldName: {
        "ui:autofocus": true,
        "ui:options": {},
      },
    },
    fieldsOfUiOptions: ["fieldType", "description"],
  },
};
