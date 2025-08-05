import type { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export type RelSchemaAndField = {
  field: string;
  schema: JSONSchema7;
};

export type RequireParams = string | string[];

// Navigate nested field paths (e.g., "user.address.street")
export const findSchemaForField = (fieldPath: string, schema: JSONSchema7): RelSchemaAndField => {
  if (!fieldPath.includes(".")) {
    return { field: fieldPath, schema };
  }

  const parts = fieldPath.split(".");
  let currentSchema = schema;
  let processedParts = 0;

  for (const part of parts.slice(0, -1)) {
    const nextSchema = getFieldSchema(part, currentSchema);
    if (!nextSchema) break;

    currentSchema = nextSchema;
    processedParts++;
  }

  const remainingPath = parts.slice(processedParts).join(".");

  return { field: remainingPath, schema: currentSchema };
};

// Resolve $ref pointer in schema
const resolveRef = (ref: string, rootSchema: JSONSchema7): JSONSchema7 | undefined => {
  if (!ref?.startsWith("#/")) return undefined;

  const path = ref.slice(2).split("/");
  let current: unknown = rootSchema;

  for (const segment of path) {
    if (current && typeof current === "object" && current !== null) {
      current = (current as Record<string, unknown>)[decodeURIComponent(segment)];
    } else {
      return undefined;
    }
  }

  return current && typeof current === "object" && current !== null ? (current as JSONSchema7) : undefined;
};

// Navigate nested UI schema
export const findUiSchema = (fieldPath: string, uiSchema?: UiSchema): UiSchema | undefined => {
  if (!uiSchema || !fieldPath.includes(".")) return uiSchema;

  const parts = fieldPath.split(".");
  let current: UiSchema | undefined = uiSchema;

  for (const part of parts.slice(0, -1)) {
    if (current && typeof current === "object") {
      current = (current as Record<string, UiSchema | undefined>)[part];
    } else {
      return uiSchema;
    }
    if (!current) return uiSchema;
  }

  return current || uiSchema;
};

// Get schema for a field (handles objects, arrays, and $ref)
export const getFieldSchema = (field: string, schema: JSONSchema7): JSONSchema7 | undefined => {
  const property = schema.properties?.[field];
  if (!property || typeof property !== "object") return undefined;

  // Handle $ref
  if ("$ref" in property) {
    return resolveRef(property.$ref as string, schema);
  }

  // Handle array with $ref items
  if (property.type === "array" && property.items && typeof property.items === "object" && "$ref" in property.items) {
    return resolveRef(property.items.$ref as string, schema);
  }

  // Handle array with inline items
  if (property.type === "array" && property.items) {
    return property.items as JSONSchema7;
  }

  // Handle object
  if (property.type === "object") {
    return property as JSONSchema7;
  }

  return undefined;
};

// Add field to schema's required array
const makeRequired = (field: string, schema: JSONSchema7): void => {
  if (!schema.required) {
    schema.required = [];
  }

  if (!schema.required.includes(field)) {
    schema.required.push(field);
  }
};

// Remove field from schema's required array
const makeOptional = (field: string, schema: JSONSchema7): void => {
  if (!schema.required || !Array.isArray(schema.required)) return;

  const index = schema.required.indexOf(field);
  if (index > -1) {
    schema.required.splice(index, 1);
  }
};

// Remove field completely from schema
const removeFromSchema = (field: string, schema: JSONSchema7): void => {
  // Remove from properties
  if (schema.properties && field in schema.properties) {
    delete schema.properties[field];
  }

  // Remove from required array
  makeOptional(field, schema);
};

// Remove field from UI schema
const removeFromUiSchema = (field: string, uiSchema: UiSchema | undefined): void => {
  if (!uiSchema || typeof uiSchema !== "object") return;

  const uiSchemaObj = uiSchema as Record<string, unknown>;

  // Remove field-specific UI schema
  if (field in uiSchemaObj) {
    delete uiSchemaObj[field];
  }

  // Remove from ui:order if it exists
  if ("ui:order" in uiSchemaObj && Array.isArray(uiSchemaObj["ui:order"])) {
    const order = uiSchemaObj["ui:order"] as string[];
    const index = order.indexOf(field);
    if (index > -1) {
      order.splice(index, 1);
    }
  }
};

// Main function to completely remove fields
export const removeFields = (
  params: { field?: RequireParams },
  schema: JSONSchema7,
  uiSchema?: UiSchema,
  formData?: unknown
): void => {
  if (!params?.field) return;

  const fields = Array.isArray(params.field) ? params.field : [params.field];

  for (const fieldPath of fields) {
    const { field, schema: targetSchema } = findSchemaForField(fieldPath, schema);
    const targetUiSchema = findUiSchema(fieldPath, uiSchema);

    // Remove from schema (properties + required)
    removeFromSchema(field, targetSchema);

    // Remove from UI schema (field config + ui:order)
    removeFromUiSchema(field, targetUiSchema);

    // Add this part - Remove from form data
    if (formData) {
      removeFromNestedFormData(fieldPath, formData);
    }
  }
};

// Main function to remove fields from required array
export const removeRequiredFields = (
  params: { field?: RequireParams },
  schema: JSONSchema7,
  _uiSchema?: UiSchema,
  _formData?: unknown
): void => {
  if (!params?.field) return;

  const fields = Array.isArray(params.field) ? params.field : [params.field];

  for (const fieldPath of fields) {
    const { field, schema: targetSchema } = findSchemaForField(fieldPath, schema);
    makeOptional(field, targetSchema);
  }
};

// Main function to require fields
export const requireFields = (
  params: { field?: RequireParams },
  schema: JSONSchema7,
  _uiSchema?: UiSchema,
  _formData?: unknown
): void => {
  if (!params?.field) return;

  const fields = Array.isArray(params.field) ? params.field : [params.field];

  for (const fieldPath of fields) {
    const { field, schema: targetSchema } = findSchemaForField(fieldPath, schema);
    makeRequired(field, targetSchema);
  }
};

// Remove field from form data
const removeFromFormData = (field: string, formData: unknown): void => {
  if (!formData || typeof formData !== "object" || formData === null) return;

  const formDataObj = formData as Record<string, unknown>;

  if (field in formDataObj) {
    delete formDataObj[field];
  }
};

// Navigate and remove from nested form data
const removeFromNestedFormData = (fieldPath: string, formData: unknown): void => {
  if (!formData || typeof formData !== "object" || formData === null) return;

  if (!fieldPath.includes(".")) {
    removeFromFormData(fieldPath, formData);

    return;
  }

  const parts = fieldPath.split(".");
  const fieldName = parts[parts.length - 1];
  let current: unknown = formData;

  // Navigate to the parent object
  for (const part of parts.slice(0, -1)) {
    if (current && typeof current === "object" && current !== null) {
      const currentObj = current as Record<string, unknown>;
      current = currentObj[part];
    } else {
      return; // Path doesn't exist
    }
  }

  // Remove the field from the parent object
  removeFromFormData(fieldName, current);
};
