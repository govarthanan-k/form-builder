import { FieldType } from "@/components/LeftPanel";

import { checkboxFieldDescriptor } from "./checkbox.descriptor";
import { Descriptor } from "./descriptors.types";
import { dropdownFieldDescriptor } from "./dropdown.descriptor";
import { inputFieldDescriptor } from "./input.descriptor";
import { textareaFieldDescriptor } from "./textarea.descriptor";

export const descriptors: Record<FieldType, Descriptor> = {
  input: inputFieldDescriptor,
  textarea: textareaFieldDescriptor,
  checkbox: checkboxFieldDescriptor,
  dropdown: dropdownFieldDescriptor,
};
