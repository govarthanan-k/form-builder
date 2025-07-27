import { Descriptor } from "./descriptors.types";

export const inputFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "string",
    title: "New Input Field",
    default: "Gova",
  },
  uiSchema: {
    "ui:options": {
      description: "This is the field description",
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
        description: {
          type: "string",
          title: "Description",
        },
        required: {
          type: "boolean",
          title: "Required?",
        },
        hidden: { type: "boolean", title: "Hidden?" },
      },
    },
    uiSchema: {
      fieldName: {
        "ui:autofocus": true,
        "ui:options": {},
      },
      title: {
        "ui:options": {},
      },
      description: {
        "ui:options": {},
      },
      required: {
        "ui:options": {},
      },
      hidden: {
        "ui:options": {},
      },
    },
    fieldsOfUiOptions: ["fieldType", "description", "hidden"],
  },
};
