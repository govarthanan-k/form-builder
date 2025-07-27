import { JSONPath } from "jsonpath-plus";

import { GetJsonValueArgs } from "./getJsonValue.types";

export const getJsonValue = <T = unknown>({ fallback, obj, path }: GetJsonValueArgs<T>): T => {
  const normalizedPath = path.startsWith("$") ? path : `$.${path}`;

  return JSONPath({ path: normalizedPath, json: obj })[0] ?? fallback;
};
