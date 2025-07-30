import { JSONSchema7 } from "json-schema";

export interface GetSchemaByPathArgs {
  schema: JSONSchema7;
  path: string;
  getParent?: boolean;
}
