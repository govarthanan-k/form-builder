import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

import { removeFields, requireFields } from "./actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionsMap = Record<string, (params: any, schema: JSONSchema7, uiSchema?: UiSchema, formData?: unknown) => void>;

export const actions: ActionsMap = {
  require: requireFields,
  remove: removeFields,
};
