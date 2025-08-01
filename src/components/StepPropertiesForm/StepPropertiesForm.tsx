import { ErrorListTemplate } from "@/rjsf/templates/ErrorListTemplate";
import { useAppDispatch, useAppSelector } from "@/store/app/hooks";
import { updateStepDetails } from "@/store/features";
import { transformErrors } from "@/utils";
import { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/shadcn";
import { FormValidation, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { JSONSchema7 } from "json-schema";

import { ROOT_STEP_PROPERTIES_ID_PREFIX } from "@/constants";

const schema: JSONSchema7 = {
  type: "object",
  required: ["stepName", "stepType"],
  properties: {
    stepName: { type: "string", title: "Step Name", pattern: "^[A-Za-z]" },
    stepType: { type: "string", title: "Step Type", enum: ["Step", "Summary", "ThankYou"], readOnly: true },
  },
};

const uiSchema: UiSchema = {
  stepName: { "ui:options": {}, "ui:autofocus": true },
};

export const StepPropertiesForm = () => {
  const { activeStep, formDefinition } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  const { isSummaryPage, isThankYouPage, stepName } = formDefinition.stepDefinitions[activeStep];

  const handleChange = (e: IChangeEvent) => {
    const existingStepNames = formDefinition.stepDefinitions.map((stepDef) => stepDef.stepName);
    const newStepName = (e.formData as unknown as { stepName: string }).stepName;

    if (newStepName === undefined || newStepName === "") {
      console.log("Field ID is empty...");

      return;
    }
    if (formDefinition.stepDefinitions[activeStep].stepName !== newStepName && existingStepNames.includes(newStepName)) {
      console.log("Step Name already exists...");

      return;
    }

    if (!/^[A-Za-z]/.test(newStepName)) {
      console.log("Field ID isn't starting with alphabet...");

      return;
    }

    dispatch(updateStepDetails({ stepName: (e.formData as unknown as { stepName: string }).stepName }));
  };

  const customValidate = (formData: FormData, errors: FormValidation): FormValidation => {
    const existingStepNames = formDefinition.stepDefinitions.map((stepDef) => stepDef.stepName);
    const newStepName = (formData as unknown as { stepName: string }).stepName;

    if (formDefinition.stepDefinitions[activeStep].stepName !== newStepName && existingStepNames.includes(newStepName)) {
      errors.fieldID?.addError("Form Name already exists");
      console.log("Form Name already exists...");
    }

    return errors;
  };

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onChange={handleChange}
      customValidate={customValidate}
      formData={{
        stepName,
        stepType: isSummaryPage ? "Summary" : isThankYouPage ? "ThankYou" : "Step",
      }}
      liveValidate
      noHtml5Validate
      templates={{
        ErrorListTemplate,
      }}
      idSeparator="."
      idPrefix={ROOT_STEP_PROPERTIES_ID_PREFIX}
      className="flex flex-col gap-5"
      transformErrors={(error) => {
        return transformErrors(error, schema);
      }}
    >
      <></>
    </Form>
  );
};
