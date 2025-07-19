import { Descriptor } from ".";

export const checkboxFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "boolean",
    title: "New Checkbox Field",
  },
  uiSchema: {
    "ui:options": {
      help: "This is an help text",
    },
  },
  propertiesConfiguration: {
    dataSchema: {
      type: "object",
      required: ["fieldName", "label"],
      properties: {
        fieldName: {
          type: "string",
        },
        label: {
          type: "string",
        },
      },
    },
  },
};
