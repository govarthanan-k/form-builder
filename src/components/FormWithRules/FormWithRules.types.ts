import { FormProps } from "@rjsf/core";
import { Rule } from "json-rules-engine-simplified";

export interface FormWithRulesProps extends FormProps {
  rules?: Rule[];
  onInitialChange: (formData: FormData) => void;
}
