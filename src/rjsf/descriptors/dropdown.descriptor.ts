import { Descriptor } from ".";

export const dropdownFieldDescriptor: Descriptor = {
  dataSchema: {
    type: "string",
    title: "New Dropdown Field",
    enum: ["Option 1", "Option 2", "Option 3"],
  },
  uiSchema: {
    "ui:options": {
      help: "This is an help text",
      fieldType: "dropdown",
    },
  },
  propertiesConfiguration: {
    dataSchema: {
      type: "object",
      required: ["fieldName", "label"],
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
  },
};
