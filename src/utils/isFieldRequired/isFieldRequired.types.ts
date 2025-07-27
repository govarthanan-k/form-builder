import { JSONSchema7 } from "json-schema";

export interface IsFieldRequiredArgs {
  schema: JSONSchema7;
  path: string;
}
