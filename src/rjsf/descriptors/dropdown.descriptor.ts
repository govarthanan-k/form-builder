import { Descriptor } from ".";

export const dropdownFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "string",
    title: "New Dropdown Field",
    enum: ["Option 1", "Option 2", "Option 3"],
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
