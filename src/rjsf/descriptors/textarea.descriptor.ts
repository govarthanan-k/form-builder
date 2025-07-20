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
      fieldType: "textarea",
    },
  },
  propertiesConfiguration: {
    dataSchema: {
      type: "object",
      required: ["fieldName", "label"],
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
  },
};
