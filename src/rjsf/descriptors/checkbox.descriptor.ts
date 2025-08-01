import { Descriptor } from "./descriptors.types";

export const checkboxFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "boolean",
    title: "New Checkbox Field",
    description: "This is the field description",
  },
  uiSchema: {
    "ui:options": {
      fieldType: "checkbox",
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
        },
        title: {
          type: "string",
          title: "Field Label",
        },
      },
    },
    uiSchema: {
      fieldID: {
        "ui:autofocus": true,
        "ui:options": {},
      },
    },
    mappings: {
      schema: ["title", "description", "default", "readOnly", "required"],
      uiSchema: ["hidden"],
    },
  },
};
