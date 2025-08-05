import { FormProps } from "@rjsf/core";
import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export type FormData = FormProps["formData"];

export interface FormSchema {
  dataSchema: JSONSchema7;
  uiSchema: UiSchema;
}
