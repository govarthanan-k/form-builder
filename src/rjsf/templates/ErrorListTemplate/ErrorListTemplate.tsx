"use client";

import { ErrorListProps } from "@rjsf/utils";
import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { CutomValidationError } from "./ErrorListTemplate.types";

export const ErrorListTemplate = (props: ErrorListProps) => {
  const { errors } = props;

  return (
    <div className="mb-5 grid w-full items-start gap-4" id="error_container">
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Errors</AlertTitle>
        <AlertDescription>
          <ul className="list-inside list-disc text-sm">
            {errors.map((error: CutomValidationError, i: number) => {
              return (
                <li key={i} className="error">
                  {error.fieldErrorMessage || error.message}
                </li>
              );
            })}
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};
