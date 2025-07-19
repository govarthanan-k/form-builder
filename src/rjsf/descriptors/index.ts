import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

import { checkboxFieldDescriptor } from "./checkbox.descriptor";
import { dropdownFieldDescriptor } from "./dropdown.descriptor";
import { inputFieldDescriptor } from "./input.descriptor";
import { textareaFieldDescriptor } from "./textarea.descriptor";

export interface Descriptor {
  dataSchema: JSONSchema7;
  uiSchema: UiSchema;
  propertiesConfiguration: { dataSchema: JSONSchema7 };
}

export const descriptors: Record<string, Descriptor> = {
  input: inputFieldDescriptor,
  textarea: textareaFieldDescriptor,
  checkbox: checkboxFieldDescriptor,
  dropdown: dropdownFieldDescriptor,
};
