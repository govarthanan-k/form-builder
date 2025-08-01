import { JSONSchema7Definition } from "json-schema";

export interface GenerateUniqueFieldIDArgs {
  existingFields: Record<string, JSONSchema7Definition>;
  prefix: string;
  padding?: number;
}
