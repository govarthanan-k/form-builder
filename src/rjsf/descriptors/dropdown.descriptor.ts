import { Descriptor } from "./descriptors.types";

export const dropdownFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "string",
    title: "New Dropdown Field",
    enum: ["Option 1", "Option 2", "Option 3"],
    description: "This is the field description",
  },
  uiSchema: {
    "ui:options": {
      fieldType: "dropdown",
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
