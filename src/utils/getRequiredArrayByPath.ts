import { getJsonValue } from "./getJsonValue";
import { GetSchemaByPathArgs } from "./getSchemaByPath";

/**
 * Builds a JSONPath to the parent schema node containing the `required` array
 */
const buildRequiredArrayPath = (dotPath: string): string => {
  const segments = dotPath.split(".");
  const pathSegments: string[] = ["$"];
  let depth = 0;

  for (const segment of segments) {
    const arrayMatch = segment.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [_, key] = arrayMatch;
      pathSegments.push("properties", key, "items");
    } else {
      pathSegments.push("properties", segment);
    }

    depth++;
  }

  // remove last `.properties.segment` to point to parent
  if (depth > 0) {
    pathSegments.splice(-2); // remove last key + "properties"
  }

  pathSegments.push("required");

  return pathSegments.join(".");
};

/**
 * Gets the `required` array for the parent object of a given path
 */
export const getRequiredArrayByPath = ({ path, schema }: GetSchemaByPathArgs): string[] | undefined => {
  const requiredPath = buildRequiredArrayPath(path);

  return getJsonValue<string[]>({ obj: schema, path: requiredPath });
};
