import { RJSFValidationError } from "@rjsf/utils";

export interface CutomValidationError extends RJSFValidationError {
  fieldErrorMessage?: string;
}
