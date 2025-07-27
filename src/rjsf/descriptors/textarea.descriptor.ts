import { Descriptor } from "./descriptors.types";

export const textareaFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "object",
    title: "New Textarea Field",
    properties: {
      firstName: {
        type: "string",
        title: "First Name",
      },
    },
  },
  uiSchema: {
    "ui:options": {
      description: "This is the field description",
      fieldType: "textarea",
    },
    firstName: {
      "ui:options": {
        description: "This is the field description",
        fieldType: "input",
      },
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
    },
  },
};
