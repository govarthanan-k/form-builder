"use client";

import { useEffect } from "react";
import { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/shadcn";
import validator from "@rjsf/validator-ajv8";

import { descriptors, PropertiesConfiguration } from "../rjsf/descriptors";
import { ErrorListTemplate } from "../rjsf/templates/ErrorListTemplate";
import { useAppDispatch, useAppSelector } from "../rtk/app/hooks";
import { updateSelectedFieldPropertiesFormData } from "../rtk/features";
import { FormDefinition } from "../rtk/features/editor/editor.types";
import { FieldType } from "./LeftSideBar";

export const PROPERTIES_ROOT_EFORM_ID_PREFIX = "eform_properties_root";

interface GetPropertiesSchemaArgs {
  formDefinition: FormDefinition;
  activeStep: number;
  selectedField: string | undefined;
}

export const getPropertiesSchema = ({
  formDefinition,
  activeStep,
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

export const humanizeFieldName = (field: string) => field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

export const FieldPropertiesForm = () => {
  const { selectedField, formDefinition, activeStep, selectedFieldPropertiesFormData } = useAppSelector((state) => state.editor);

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
      transformErrors={(errors) =>
        errors.map((error) => {
          if (error.name === "required" && error.params?.missingProperty) {
            return {
              ...error,
              message: "Please enter a value", // Shown under field
              fieldErrorMessage: `Please enter a value in ${humanizeFieldName(error.params.missingProperty)}`, // Used in error list
            };
          }
          return error;
        })
      }
    >
      <></>
    </Form>
  );
};
