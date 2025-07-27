import { Descriptor } from "./descriptors.types";

export const dropdownFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "string",
    title: "New Dropdown Field",
    enum: ["Option 1", "Option 2", "Option 3"],
  },
  uiSchema: {
    "ui:options": {
      description: "This is the field description",
      fieldType: "dropdown",
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
        enum: {
          type: "array",
          title: "Options",
          items: {
            type: "string",
          },
        },
      },
    },
    uiSchema: {
      type: { "ui:widget": "hidden", "ui:options": {}, patches: [{ op: "replace", path: "type", type: "schema" }] },
      fieldType: {
        "ui:widget": "hidden",
        "ui:options": {},
        patches: [{ op: "replace", path: "ui:options.fieldType", type: "uiSchema" }],
      },
      fieldName: {
        "ui:autofocus": true,
        "ui:options": {},
        patches: [{ op: "replace", path: "fieldName", type: "meta" }],
      },
      title: { "ui:options": {}, patches: [{ op: "replace", path: "title", type: "schema" }] },
      description: { "ui:options": {}, patches: [{ op: "replace", path: "ui:options.description", type: "uiSchema" }] },
      required: { "ui:options": {}, patches: [{ op: "replace", path: "required", type: "meta" }] },
      hidden: { "ui:options": {}, patches: [{ op: "replace", path: "ui:options.hidden", type: "uiSchema" }] },
      enum: { "ui:options": {}, patches: [{ op: "replace", path: "enum", type: "schema" }] },
    },
  },
};
