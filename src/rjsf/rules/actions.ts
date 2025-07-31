import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const remove = (params: any, schema: JSONSchema7, uiSchema: UiSchema, formData: any) => {
  delete formData[params.field];
  delete schema.properties?.[params.field];
  delete uiSchema[params.field];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const require = (params: any, schema: JSONSchema7, _uiSchema: UiSchema, formData: any) => {
  console.log("Making require => ", params);
  schema.required = [...(schema.required || []), params.field];
};

// eslint-disable-next-line sort-exports/sort-exports
export const actions = {
  require: require,
  remove: remove,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
