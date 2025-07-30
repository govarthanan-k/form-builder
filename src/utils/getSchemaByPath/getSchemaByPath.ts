import { JSONSchema7, JSONSchema7Definition } from "json-schema";

import { GetSchemaByPathArgs } from "./getSchemaByPath.types";

export const getSchemaByPath = ({ getParent = false, path, schema }: GetSchemaByPathArgs): JSONSchema7 | undefined => {
  const segments = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  const pathSegments = getParent ? segments.slice(0, -1) : segments;

  let current: JSONSchema7 | undefined = schema;

  for (const segment of pathSegments) {
    if (!current) return undefined;

    const index = parseInt(segment, 10);
    const isIndex = !isNaN(index);

    if (current.type === "object" && current.properties) {
      current = current.properties[segment] as JSONSchema7;
    } else if (current.type === "array") {
      const items: JSONSchema7Definition | JSONSchema7Definition[] | undefined = current.items;

      if (isIndex) {
        if (Array.isArray(items)) {
          current = index < items.length ? (items[index] as JSONSchema7) : (current.additionalItems as JSONSchema7);
        } else {
          current = items as JSONSchema7;
        }
      } else if (items && typeof items === "object" && (items as JSONSchema7).type === "object") {
        current = (items as JSONSchema7).properties?.[segment] as JSONSchema7;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  return current;
};
