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
        default: {
          type: "string",
          title: "Default Value",
        },
        required: {
          type: "boolean",
          title: "Required?",
        },
        hidden: { type: "boolean", title: "Hidden?" },
        readOnly: { type: "boolean", title: "Read Only?" },
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
    rules: [
      {
        conditions: {
          title: "empty",
        },
        event: {
          type: "remove",
          params: {
            field: "description",
          },
        },
      },
    ],
    mappings: {
      schema: ["title", "description", "default", "readOnly"],
      uiSchema: ["hidden"],
    },
  },
};
