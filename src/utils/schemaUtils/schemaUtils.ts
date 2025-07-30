import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";
import { Options } from "prettier";

import { ArrayOptions } from "./schemaUtils.types";

export function getSchemaFromDotPath({
  dotPath,
  options = {},
  schema,
}: {
  schema: JSONSchema7;
  dotPath: string;
  options?: Options;
}): JSONSchema7 | undefined {
  const segments = dotPath.split(".");
  const targetLength = options.parent ? segments.length - 1 : segments.length;

  let current: JSONSchema7 = schema;

  for (let i = 0; i < targetLength; i++) {
    const segment = segments[i];

    if (isNumeric(segment)) {
      // Go into `items` for arrays
      if (current.type === "array" && current.items && !Array.isArray(current.items)) {
        current = current.items as JSONSchema7;
      } else {
        return undefined;
      }
    } else {
      if (current.type === "object" && current.properties?.[segment]) {
        current = current.properties[segment] as JSONSchema7;
      } else {
        return undefined;
      }
    }
  }

  return current;
}

export function getUiSchemaFromDotPath({
  dotPath,
  options = {},
  uiSchema,
}: {
  uiSchema: UiSchema;
  dotPath: string;
  options?: Options;
}): UiSchema | undefined {
  const segments = dotPath.split(".");
  const targetLength = options.parent ? segments.length - 1 : segments.length;

  let current = uiSchema;

  for (let i = 0; i < targetLength; i++) {
    const segment = segments[i];

    if (!current || typeof current !== "object") return undefined;

    if (isNumeric(segment)) {
      // If the segment is an index, assume it's an array and go through 'items'
      current = current["items"];
    } else {
      current = current[segment];
    }
  }

  return current;
}

export const isNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};

/**
 * Removes all occurrences of an item from an array
 * @param arr - The array to modify
 * @param item - The item to remove
 * @param options - Configuration options
 */
export const remove = <T>(arr: T[] | undefined, item: T, options: ArrayOptions = {}): T[] => {
  if (arr) {
    const { mutate = false, unique = false } = options;

    let result: T[];

    if (mutate) {
      // Remove items in reverse order to avoid index shifting issues
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === item) {
          arr.splice(i, 1);
        }
      }
      result = arr;
    } else {
      result = arr.filter((el) => el !== item);
    }

    return unique ? uniq(result, { mutate }) : result;
  }

  return [];
};

/**
 * Removes multiple items from an array in a single pass
 * @param arr - The array to modify
 * @param items - Set or array of items to remove
 * @param options - Configuration options
 */
export const removeMultiple = <T>(arr: T[], items: T[] | Set<T>, options: ArrayOptions = {}): T[] => {
  const { mutate = false, unique = false } = options;
  const itemSet = items instanceof Set ? items : new Set(items);

  let result: T[];

  if (mutate) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (itemSet.has(arr[i])) {
        arr.splice(i, 1);
      }
    }
    result = arr;
  } else {
    result = arr.filter((el) => !itemSet.has(el));
  }

  return unique ? uniq(result, { mutate }) : result;
};

/**
 * Replaces all occurrences of an item in an array
 * @param arr - The array to modify
 * @param oldVal - The value to replace
 * @param newVal - The new value
 * @param options - Configuration options
 */
export const replace = <T>(arr: T[] | undefined, oldVal: T, newVal: T, options: ArrayOptions = {}): T[] => {
  if (arr) {
    const { mutate = false, unique = false } = options;

    let result: T[];

    if (mutate) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === oldVal) {
          arr[i] = newVal;
        }
      }
      result = arr;
    } else {
      result = arr.map((item) => (item === oldVal ? newVal : item));
    }

    return unique ? uniq(result, { mutate }) : result;
  }

  return [];
};

/**
 * Replaces only the first occurrence of an item in an array
 * @param arr - The array to modify
 * @param oldVal - The value to replace
 * @param newVal - The new value
 * @param options - Configuration options
 */
export const replaceFirst = <T>(arr: T[], oldVal: T, newVal: T, options: ArrayOptions = {}): T[] => {
  const { mutate = false, unique = false } = options;
  const index = arr.indexOf(oldVal);

  let result: T[];

  if (index === -1) {
    // Item not found - return copy or original based on mutate flag
    result = mutate ? arr : [...arr];
  } else if (mutate) {
    arr[index] = newVal;
    result = arr;
  } else {
    // More efficient than slice operations for large arrays
    result = arr.map((item, i) => (i === index ? newVal : item));
  }

  return unique ? uniq(result, { mutate }) : result;
};

/**
 * Removes duplicate items from an array, keeping the first occurrence
 * @param arr - The array to deduplicate
 * @param options - Configuration options
 */
export const uniq = <T>(arr: T[] | undefined, options: ArrayOptions = {}): T[] => {
  if (arr) {
    const { mutate = false } = options;

    if (mutate) {
      const seen = new Set<T>();
      // Process from end to avoid index shifting when splicing
      for (let i = arr.length - 1; i >= 0; i--) {
        if (seen.has(arr[i])) {
          arr.splice(i, 1);
        } else {
          seen.add(arr[i]);
        }
      }

      return arr;
    }

    return [...new Set(arr)];
  }

  return [];
};
