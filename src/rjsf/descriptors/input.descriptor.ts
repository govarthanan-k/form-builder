import { Descriptor } from ".";

export const inputFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "string",
    title: "New Input Field",
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
