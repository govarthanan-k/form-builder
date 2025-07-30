import { Descriptor } from "./descriptors.types";

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
    mappings: {
      schema: ["title", "description", "default", "readOnly", "required"],
      uiSchema: ["hidden"],
    },
  },
};
