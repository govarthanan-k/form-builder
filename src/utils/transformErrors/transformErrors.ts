import { humanizeFieldID } from "@/utils";
import { RJSFValidationError } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export const transformErrors = (errors: RJSFValidationError[], schema: JSONSchema7) =>
  errors.map((error) => {
    if (error.name === "required" && error.params?.missingProperty) {
      const { missingProperty } = error.params;

      const fieldTitle = (schema.properties?.[missingProperty] as JSONSchema7)?.title ?? humanizeFieldID(missingProperty);

      return {
        ...error,
        message: "Please enter a value", // Shown under field
        fieldErrorMessage: `Please enter a value in ${fieldTitle}`, // Used in error list
      };
    }

    return error;
  });
