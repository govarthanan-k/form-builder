import { Descriptor } from "./descriptors.types";

export const inputFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "string",
    title: "New Input Field",
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
        type: {
          type: "string",
          title: "Type",
        },
        fieldType: {
          type: "string",
          title: "Field Type",
        },
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
        hidden: {
          type: "boolean",
          title: "Hidden?",
        },
      },
    },
    uiSchema: {
      type: { "ui:widget": "hidden", "ui:options": {} },
      fieldType: {
        "ui:widget": "hidden",
        "ui:options": {},
      },
      fieldName: {
        "ui:autofocus": true,
        "ui:options": {},
      },
      title: { "ui:options": {} },
      description: { "ui:options": {} },
      required: { "ui:options": {} },
      hidden: { "ui:options": {} },
    },
    patches: {
      type: { type: "schema" },
      fieldType: { type: "uiSchema" },
      title: { type: "schema" },
      description: { type: "uiSchema" },
      hidden: { type: "uiSchema" },
    },
  },
};
