"use client";

import Form from "@rjsf/shadcn";
import validator from "@rjsf/validator-ajv8";

import { FormSchema } from "../app/page";
import { ErrorListTemplate } from "../rjsf/templates/ErrorListTemplate";

export const FormInTheMiddle = (props: FormSchema) => {
  const log = (type: string) => console.log.bind(console, type);

  return (
    <Form
      schema={props.dataSchema}
      uiSchema={props.uiSchema}
      validator={validator}
      onChange={log("changed")}
      onSubmit={log("submitted")}
      onError={log("errors")}
      liveValidate
      noHtml5Validate
      templates={{
        ErrorListTemplate,
        // FieldTemplate: CustomFieldTemplate
      }}
    >
      <></>
    </Form>
  );
};
