import { UiSchema } from "@rjsf/utils";
import { Operation } from "fast-json-patch";
import { JSONSchema7 } from "json-schema";

export interface CustomPatch {
  op: Operation["op"];
  path: Operation["path"];
  type: "schema" | "uiSchema" | "meta";
}

export interface Descriptor {
  dataSchema: JSONSchema7;
  uiSchema: UiSchema;
  propertiesConfiguration: PropertiesConfiguration;
}

export interface PropertiesConfiguration {
  dataSchema: JSONSchema7;
  uiSchema: UiSchema;
  patches: Record<string, CustomPatch>;
}
