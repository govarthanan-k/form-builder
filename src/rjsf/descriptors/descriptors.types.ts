import { UiSchema } from "@rjsf/utils";
import { Rule } from "json-rules-engine-simplified";
import { JSONSchema7 } from "json-schema";

export interface Descriptor {
  dataSchema: JSONSchema7;
  uiSchema: UiSchema;
  propertiesConfiguration: PropertiesConfiguration;
}

export type JSONSchema7Key = keyof JSONSchema7;

export interface PropertiesConfiguration {
  dataSchema: JSONSchema7;
  uiSchema: UiSchema;
  mappings: {
    schema: JSONSchema7Key[];
    uiSchema: string[];
  };
  rules?: Rule[];
}
