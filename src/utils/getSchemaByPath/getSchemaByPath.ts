import { JSONSchema7 } from "json-schema";

import { getJsonValue } from "../getJsonValue";
import { GetSchemaByPathArgs } from "./getSchemaByPath.types";

const buildJsonPathFromDotPath = (dotPath: string, schema: JSONSchema7): string => {
  const segments = dotPath.split(".");
  let jsonPath = "$";
  let current: JSONSchema7 | undefined = schema;

  for (const segment of segments) {
    const arrayMatch = segment.match(/^(\w+)\[(\d+)\]$/);

    if (arrayMatch) {
      // e.g. addresses[0]
      const [, arrayKey] = arrayMatch;
      jsonPath += `.properties.${arrayKey}.items`;
      current = (current?.properties?.[arrayKey] as JSONSchema7)?.items as JSONSchema7;
    } else {
      jsonPath += `.properties.${segment}`;
      current = current?.properties?.[segment] as JSONSchema7;
    }

    // Optional: fallback for missing schema types
    if (current?.type === "array" && !jsonPath.endsWith(".items")) {
      jsonPath += `.items`;
      current = current.items as JSONSchema7;
    }
  }

  return jsonPath;
};

export const getSchemaByPath = ({ path, schema }: GetSchemaByPathArgs): JSONSchema7 | undefined => {
  const jsonPath = buildJsonPathFromDotPath(path, schema);

  return getJsonValue<JSONSchema7 | undefined>({ obj: schema, path: jsonPath });
};
