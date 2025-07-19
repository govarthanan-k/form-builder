"use client";

import Form from "@rjsf/shadcn";
import validator from "@rjsf/validator-ajv8";
import { JSONSchema7 } from "json-schema";

import { descriptors } from "../rjsf/descriptors";
import { ErrorListTemplate } from "../rjsf/templates/ErrorListTemplate";
import { useAppSelector } from "../rtk/app/hooks";
import { FormDefinition } from "../rtk/features/editor/editor.types";
import { FieldType } from "./LeftSideBar";

const getPropertiesSchema = (
  formDefinition: FormDefinition,
  activeStep: number,
  selectedField: string | undefined
): JSONSchema7 => {
  console.log(selectedField, activeStep, formDefinition.stepDefinitions[activeStep].uiSchema["ui:options"]?.fieldType);
  if (selectedField && formDefinition.stepDefinitions[activeStep].uiSchema["ui:options"]?.fieldType) {
    const fieldType = formDefinition.stepDefinitions[activeStep].uiSchema["ui:options"].fieldType as FieldType;
    console.log("Schema found => ", descriptors[fieldType].propertiesConfiguration.dataSchema);
    return { ...descriptors[fieldType].propertiesConfiguration.dataSchema };
  }
  console.log("Schema NOT found");
  return {
    type: "object",
    required: [],
    properties: {},
  };
};

export const FieldPropertiesForm = () => {
  const log = (type: string) => console.log.bind(console, type);
  const { formDefinition, selectedField, activeStep } = useAppSelector((state) => state.editor);
  return (
    <Form
      schema={getPropertiesSchema(formDefinition, activeStep, selectedField)}
      validator={validator}
      onChange={log("changed")}
      onSubmit={log("submitted")}
      onError={log("errors")}
      liveValidate
      noHtml5Validate
      templates={{
        ErrorListTemplate,
      }}
      idSeparator="."
      idPrefix="eform_root"
    >
      <></>
    </Form>
  );
};
