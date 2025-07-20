import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

import { FieldType } from "../../components/LeftSideBar";
import { checkboxFieldDescriptor } from "./checkbox.descriptor";
import { dropdownFieldDescriptor } from "./dropdown.descriptor";
import { inputFieldDescriptor } from "./input.descriptor";
import { textareaFieldDescriptor } from "./textarea.descriptor";

export interface PropertiesConfiguration {
  dataSchema: JSONSchema7;
  uiSchema: UiSchema;
  fieldsOfUiOptions?: string[];
}

export interface Descriptor {
  dataSchema: JSONSchema7;
  uiSchema: UiSchema;
  propertiesConfiguration: PropertiesConfiguration;
}

export const descriptors: Record<FieldType, Descriptor> = {
  input: inputFieldDescriptor,
  textarea: textareaFieldDescriptor,
  checkbox: checkboxFieldDescriptor,
  dropdown: dropdownFieldDescriptor,
};
