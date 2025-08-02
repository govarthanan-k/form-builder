import { JSONSchema7 } from "json-schema";

export function getAllPropertyPathsInSchema(schema: JSONSchema7, basePath = ""): string[] {
  const paths = [];

  if (schema.type === "object" && schema.properties) {
    for (const key of Object.keys(schema.properties)) {
      const newPath = basePath ? `${basePath}.${key}` : key;
      paths.push(newPath);
      paths.push(...getAllPropertyPathsInSchema(schema.properties[key] as JSONSchema7, newPath));
    }
  }

  if (schema.type === "array") {
    const itemSchema = schema.items;

    if (Array.isArray(itemSchema)) {
      // Tuple validation (fixed items)
      for (let i = 0; i < itemSchema.length; i++) {
        const newPath = basePath;
        paths.push(...getAllPropertyPathsInSchema(itemSchema[i] as JSONSchema7, newPath));
      }
    } else if (itemSchema && typeof itemSchema === "object") {
      // Single schema for additional items
      paths.push(...getAllPropertyPathsInSchema(itemSchema, basePath));
    }
  }

  for (const keyword of ["allOf", "anyOf", "oneOf"]) {
    // @ts-expect-error Todo
    if (Array.isArray(schema[keyword])) {
      // @ts-expect-error Todo
      for (const sub of schema[keyword]) {
        paths.push(...getAllPropertyPathsInSchema(sub, basePath));
      }
    }
  }

  return paths;
}
