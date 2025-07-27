import { useRef, useState } from "react";

import { ErrorListTemplate } from "@/rjsf/templates/ErrorListTemplate";
import { useAppDispatch, useAppSelector } from "@/store/app/hooks";
import { addStep, updateAddStepModalOpen } from "@/store/features";
import { transformErrors } from "@/utils";
import RJSFForm, { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/shadcn";
import { FormValidation, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { JSONSchema7 } from "json-schema";

import { Button } from "@/components/ui/button";

import { ROOT_ADD_STEP_FORM_ID_PREFIX } from "@/constants";

import { StepFormData } from "./AddNewStepModal.types";

export const AddNewStepModal = () => {
  const { formDefinition } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const formRef = useRef<InstanceType<typeof RJSFForm>>(null);
  const [formData, setFormData] = useState<StepFormData>({});
  const [liveValidate, setLiveValidate] = useState(false);
  const uiSchema: UiSchema = {};

  const handleChange = (e: IChangeEvent<StepFormData>) => {
    setFormData(e.formData || {});
  };

  const handleSubmit = () => {
    setLiveValidate(true);
    if (formRef.current) {
      formRef.current.submit();
    }
  };
  const onSubmit = (event: IChangeEvent) => {
    if (event.formData.stepName) {
      dispatch(updateAddStepModalOpen({ isOpen: false }));
      // Use setTimeout to prevent race condition
      setTimeout(() => {
        dispatch(addStep({ stepName: event.formData.stepName, stepType: event.formData.stepType }));
      }, 100);
    }
  };

  const onError = () => {
    // This will be called if there are validation errors
    console.log("Form has validation errors");
  };

  const customValidate = (formData: StepFormData, errors: FormValidation): FormValidation => {
    const stepNames = formDefinition.stepDefinitions.map((s) => s.stepName.trim().toLowerCase());
    const currentStep = formData.stepName?.trim().toLowerCase();
    if (currentStep && stepNames.includes(currentStep)) {
      errors.stepName?.addError("Step name already exists");
    }

    return errors;
  };

  const getSchema = (): JSONSchema7 => {
    const stepTypes = ["Step"];
    if (formDefinition.stepDefinitions.every(({ isSummaryPage }) => !isSummaryPage)) {
      stepTypes.push("Summary");
    }
    if (formDefinition.stepDefinitions.every(({ isThankYouPage }) => !isThankYouPage)) {
      stepTypes.push("ThankYou");
    }

    return {
      type: "object",
      required: ["stepName", "stepType"],
      properties: {
        stepName: {
          type: "string",
          title: "Step Name",
        },
        stepType: { type: "string", title: "Step Type", enum: stepTypes, default: "Step" },
      },
    };
  };

  const schema = getSchema();

  return (
    <>
      <Form
        ref={formRef}
        formData={formData}
        schema={schema}
        uiSchema={uiSchema}
        validator={validator}
        customValidate={customValidate}
        onChange={handleChange}
        onSubmit={onSubmit}
        onError={onError}
        noHtml5Validate
        liveValidate={liveValidate}
        templates={{ ErrorListTemplate }}
        idSeparator="."
        idPrefix={ROOT_ADD_STEP_FORM_ID_PREFIX}
        transformErrors={(errors) => transformErrors(errors, schema)}
      >
        <></>
      </Form>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={() => dispatch(updateAddStepModalOpen({ isOpen: false }))}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Add</Button>
      </div>
    </>
  );
};
