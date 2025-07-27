import { JSONSchema7 } from "json-schema";

import { IsFieldRequiredArgs } from "./isFieldRequired.types";

/**
 * Checks if a field is marked as required at its corresponding parent level in a nested JSONSchema7.
 */
export const isFieldRequired = ({ path, schema }: IsFieldRequiredArgs): boolean => {
  const pathSegments = path.split(".");
  let currentSchema: JSONSchema7 | undefined = schema;

  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];

    // Check for array access like "addresses[0]"
    const arrayMatch = segment.match(/^(\w+)\[(\d+)\]$/);
    const key = arrayMatch ? arrayMatch[1] : segment;

    if (!currentSchema || typeof currentSchema !== "object") return false;

    // Check if this field is required at the parent level
    const isRequired = (currentSchema.required as string[] | undefined)?.includes(key) ?? false;

    // Move into the next schema segment
    if (currentSchema.type === "object" && currentSchema.properties?.[key]) {
      currentSchema = currentSchema.properties[key] as JSONSchema7;
    } else if (currentSchema.type === "array" && currentSchema.items) {
      currentSchema = currentSchema.items as JSONSchema7;
    } else {
      return false;
    }

    // If this is the last segment and was required at its level, return true
    if (i === pathSegments.length - 1) return isRequired;
  }

  return false;
};
