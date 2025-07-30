import { UiSchema } from "@rjsf/utils";

import { GetUiSchemaByPathArgs } from "./getUiSchemaByPath.types";

export const getUiSchemaByPath = ({ getParent = false, path, uiSchema }: GetUiSchemaByPathArgs): UiSchema | undefined => {
  if (!uiSchema || typeof uiSchema !== "object") return undefined;

  const segments = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  const pathSegments = getParent ? segments.slice(0, -1) : segments;

  let current: UiSchema = uiSchema;

  for (const segment of pathSegments) {
    const index = parseInt(segment, 10);

    if (!isNaN(index)) {
      current = Array.isArray(current.items)
        ? (current.items[index] ?? current.additionalItems)
        : (current.items ?? current.additionalItems);
    } else {
      current = typeof current[segment] === "object" ? current[segment] : current.items?.[segment];
    }

    if (!current) return undefined;
  }

  return current;
};
