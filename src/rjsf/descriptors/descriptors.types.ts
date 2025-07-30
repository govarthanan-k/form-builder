import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export interface Descriptor {
  dataSchema: JSONSchema7;
  uiSchema: UiSchema;
  propertiesConfiguration: PropertiesConfiguration;
}

export interface PropertiesConfiguration {
  dataSchema: JSONSchema7;
  uiSchema: UiSchema;
  mappings: {
    schema: string[];
    uiSchema: string[];
  };
}
