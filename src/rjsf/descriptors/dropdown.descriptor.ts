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

export const f1 = () => {};

export const f2 = () => {};
