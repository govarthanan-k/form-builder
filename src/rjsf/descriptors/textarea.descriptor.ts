import { Descriptor } from "./descriptors.types";

export const textareaFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "string",
    title: "New Textarea Field",
  },
  uiSchema: {
    "ui:widget": "textarea",
    "ui:options": {
      description: "This is the field description",
      fieldType: "textarea",
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
    fieldsOfUiOptions: ["fieldType", "description"],
  },
};
