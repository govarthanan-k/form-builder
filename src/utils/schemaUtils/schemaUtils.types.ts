import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export interface ArrayOptions {
  mutate?: boolean;
  unique?: boolean;
}

export interface GetJsonValueArgs<T> {
  obj: Record<string, unknown>;
  path: string;
  fallback?: T;
}

export interface GetSchemaByPathArgs {
  schema: JSONSchema7;
  path: string;
  getParent?: boolean;
}

export interface GetUiSchemaByPathArgs {
  uiSchema: UiSchema;
  path: string;
}

export interface Options {
  parent?: boolean;
}
