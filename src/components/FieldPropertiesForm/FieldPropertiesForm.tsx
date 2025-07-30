"use client";

import { useEffect } from "react";

import { descriptors } from "@/rjsf/descriptors";
import { ErrorListTemplate } from "@/rjsf/templates/ErrorListTemplate";
import { useAppDispatch, useAppSelector } from "@/store/app/hooks";
import { updateSelectedFieldPropertiesFormData } from "@/store/features";
import { getUiSchemaFromDotPath, transformErrors } from "@/utils";
import { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/shadcn";
import { UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { JSONSchema7 } from "json-schema";

import { FieldType } from "@/components/LeftPanel";

import { PROPERTIES_ROOT_EFORM_ID_PREFIX } from "@/constants";

import { GetPropertiesSchemaArgs } from "./FieldPropertiesForm.types";

export const FieldPropertiesForm = () => {
  const { activeStep, formDefinition, selectedField, selectedFieldPropertiesFormData } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const { schema, uiSchema } = getPropertiesSchema({
    formDefinition,
    activeStep,
    selectedField,
  });

  useEffect(() => {
    const autofocusField = Object.entries(uiSchema).find(([, config]) => config?.["ui:autofocus"] === true)?.[0];
    let timeout: NodeJS.Timeout;
    if (autofocusField) {
      const selectorBase = `${PROPERTIES_ROOT_EFORM_ID_PREFIX}.${autofocusField}`;
      const inputSelector = `input[name='${selectorBase}']`;
      timeout = setTimeout(() => {
        const input = document.querySelector(inputSelector) as HTMLElement;
        if (input) input.focus();
      }, 0);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [uiSchema]);

  if (!selectedField) return null;

  const handleChange = (e: IChangeEvent) => {
    dispatch(updateSelectedFieldPropertiesFormData({ formData: e.formData }));
  };

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onChange={handleChange}
      formData={selectedFieldPropertiesFormData}
      liveValidate
      noHtml5Validate
      templates={{
        ErrorListTemplate,
      }}
      idSeparator="."
      idPrefix={PROPERTIES_ROOT_EFORM_ID_PREFIX}
      className="flex flex-col gap-5"
      transformErrors={(error) => {
        return transformErrors(error, schema);
      }}
    >
      <></>
    </Form>
  );
};

export const getPropertiesSchema = ({
  activeStep,
  formDefinition,
  selectedField,
}: GetPropertiesSchemaArgs): { schema: JSONSchema7; uiSchema: UiSchema } => {
  if (selectedField) {
    const stepDefinition = formDefinition.stepDefinitions[activeStep];
    const fieldUiSchema = getUiSchemaFromDotPath({
      dotPath: selectedField,
      uiSchema: stepDefinition.uiSchema,
    });
    const fieldType = fieldUiSchema?.["ui:options"]?.fieldType as FieldType | undefined;
    if (!fieldType) {
      throw new Error(`fieldType is missing for ${selectedField}`);
    }
    const { dataSchema: schema, uiSchema } = descriptors[fieldType].propertiesConfiguration;

    return { schema, uiSchema };
  }

  return {
    schema: { type: "object", required: [], properties: {} },
    uiSchema: {},
  };
};
