"use client";

import { useEffect } from "react";

import { descriptors } from "@/rjsf/descriptors";
import { PropertiesConfiguration } from "@/rjsf/descriptors/descriptors.types";
import { ErrorListTemplate } from "@/rjsf/templates/ErrorListTemplate";
import { useAppDispatch, useAppSelector } from "@/store/app/hooks";
import { updateSelectedFieldPropertiesFormData } from "@/store/features";
import { transformErrors } from "@/utils";
import { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/shadcn";
import validator from "@rjsf/validator-ajv8";

import { FieldType } from "@/components/LeftPanel";

import { PROPERTIES_ROOT_EFORM_ID_PREFIX } from "@/constants";

import { GetPropertiesSchemaArgs } from "./FieldPropertiesForm.types";

export const FieldPropertiesForm = () => {
  const { activeStep, formDefinition, selectedField, selectedFieldPropertiesFormData } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const { dataSchema, uiSchema } = getPropertiesSchema({
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
      schema={dataSchema}
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
        return transformErrors(error, dataSchema);
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
}: GetPropertiesSchemaArgs): PropertiesConfiguration => {
  if (selectedField && formDefinition.stepDefinitions[activeStep]?.uiSchema?.[selectedField]?.["ui:options"]?.fieldType) {
    const fieldType = formDefinition.stepDefinitions[activeStep].uiSchema[selectedField]["ui:options"].fieldType as FieldType;

    return { ...descriptors[fieldType].propertiesConfiguration };
  }

  return {
    dataSchema: { type: "object", required: [], properties: {} },
    uiSchema: {},
  };
};
