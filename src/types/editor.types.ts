import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export interface FormSchema {
  dataSchema: JSONSchema7;
  uiSchema: UiSchema;
}

export interface StepDefinition {
  stepName: string;
  // Add other fields if needed
}
