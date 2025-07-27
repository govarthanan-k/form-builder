import { UiSchema } from "@rjsf/utils";

import { getJsonValue } from "../getJsonValue";
import { GetUiSchemaByPathArgs } from "./getUiSchemaByPath.types";

export const buildUiJsonPath = (path: string): string => {
  return path
    .split(".")
    .map((part) => {
      const match = part.match(/^(\w+)\[(\d+)\]$/);
      if (match) {
        return `${match[1]}.items`;
      }

      return part;
    })
    .join(".");
};

export const getUiSchemaByPath = ({ path, uiSchema }: GetUiSchemaByPathArgs): UiSchema | undefined => {
  const normalizedPath = buildUiJsonPath(path);
  const jsonPath = `$.${normalizedPath}`;

  return getJsonValue<UiSchema | undefined>({ obj: uiSchema, path: jsonPath });
};
