import { Descriptor } from ".";

export const textareaFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "string",
    title: "New Textarea Field",
  },
  uiSchema: {
    "ui:widget": "textarea",
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
