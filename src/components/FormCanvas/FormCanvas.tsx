"use client";

import { CustomFieldTemplate } from "@/rjsf/templates/CustomFieldTemplate";
import { ErrorListTemplate } from "@/rjsf/templates/ErrorListTemplate";
import { useAppDispatch, useAppSelector } from "@/store/app/hooks";
import { updateFormData } from "@/store/features";
import { transformErrors } from "@/utils";
import { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/shadcn";
import validator from "@rjsf/validator-ajv8";

import { FormSchema } from "@/types/editor.types";

import { ROOT_EFORM_ID_PREFIX } from "@/constants";

export const FormCanvas = (props: FormSchema) => {
  const dispatch = useAppDispatch();

  const { formData } = useAppSelector((state) => state.editor);

  const handleChange = (e: IChangeEvent) => {
    dispatch(updateFormData({ formData: e.formData }));
  };

  return (
    <Form
      formData={formData}
      // liveOmit
      // omitExtraData
      schema={props.dataSchema}
      uiSchema={props.uiSchema}
      validator={validator}
      onChange={handleChange}
      liveValidate
      noHtml5Validate
      templates={{
        ErrorListTemplate,
        FieldTemplate: CustomFieldTemplate,
      }}
      idSeparator="."
      idPrefix={ROOT_EFORM_ID_PREFIX}
      transformErrors={(error) => {
        return transformErrors(error, props.dataSchema);
      }}
    >
      <></>
    </Form>
  );
};
