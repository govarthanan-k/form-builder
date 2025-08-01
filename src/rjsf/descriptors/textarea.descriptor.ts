import { Descriptor } from "./descriptors.types";

export const textareaFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "string",
    title: "New Textarea Field",
    description: "This is the field description",
  },
  uiSchema: {
    "ui:widget": "textarea",
    "ui:options": {
      fieldType: "textarea",
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
