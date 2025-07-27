import { JSONSchema7Definition } from "json-schema";

export interface GenerateUniqueFieldNameArgs {
  existingFields: Record<string, JSONSchema7Definition>;
  prefix: string;
  padding?: number;
}
