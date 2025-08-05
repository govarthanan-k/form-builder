import { FormProps } from "@rjsf/core";
import { Rule } from "json-rules-engine-simplified";

import { FormData } from "@/types/editor.types";

export interface FormWithRulesProps extends FormProps {
  rules?: Rule[];
  onInitialChange: (formData: FormData) => void;
}
