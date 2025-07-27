import { getJsonValue } from "./getJsonValue";
import { GetUiSchemaByPathArgs } from "./getUiSchemaByPath";

/**
 * Builds the dot-path to the `ui:order` at the same level as the given field.
 * We strip the last segment since `ui:order` belongs to the parent object.
 */
const buildUiOrderPath = (dotPath: string): string => {
  const segments = dotPath.split(".");
  const normalizedSegments = segments.map((part) => {
    const match = part.match(/^(\w+)\[(\d+)\]$/);

    return match ? `${match[1]}.items` : part;
  });

  // Remove last field to target parent
  if (normalizedSegments.length > 0) {
    normalizedSegments.pop();
  }

  return `$.${normalizedSegments.join(".")}.ui:order`;
};

/**
 * Gets the `ui:order` array from the parent node of the given field path
 */
export const getUiOrderByPath = ({ path, uiSchema }: GetUiSchemaByPathArgs): string[] | undefined => {
  const uiOrderPath = buildUiOrderPath(path);

  return getJsonValue<string[]>({ obj: uiSchema, path: uiOrderPath });
};
