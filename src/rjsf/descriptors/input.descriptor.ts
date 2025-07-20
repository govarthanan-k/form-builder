import { Descriptor } from ".";

export const inputFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "string",
    title: "New Input Field",
    default: "Gova",
  },
  uiSchema: {
    "ui:options": {
      help: "This is an help text",
      fieldType: "input",
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
  },
};
