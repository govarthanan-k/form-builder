"use client";

import { useEffect } from "react";

import { CustomFieldTemplate } from "@/rjsf/templates/CustomFieldTemplate";
import { ErrorListTemplate } from "@/rjsf/templates/ErrorListTemplate";
import { GroupedObjectFieldTemplate } from "@/rjsf/templates/ErrorListTemplate/GroupedObjectFieldTemplate";
import ToggleWidget from "@/rjsf/widgets/ToggleWidget";
import { useAppDispatch, useAppSelector } from "@/store/app/hooks";
import { updateSelectedFieldPropertiesFormData } from "@/store/features";
import { getSchemaFromDotPath, transformErrors } from "@/utils";
import { IChangeEvent } from "@rjsf/core";
import { FormValidation } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

import { FormWithRules } from "@/components/FormWithRules";

import { PROPERTIES_ROOT_EFORM_ID_PREFIX } from "@/constants";

export const FieldPropertiesForm = () => {
  const {
    activeStep,
    formDefinition,
    inspectFieldSchemas = { schema: {}, uiSchema: {} },
    selectedField,
    selectedFieldPropertiesFormData,
  } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const { rules, schema, uiSchema } = inspectFieldSchemas;

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
    const exstingFieldsInSameLevel =
      getSchemaFromDotPath({
        dotPath: selectedField,
        schema: formDefinition.stepDefinitions[activeStep].schema,
        options: { parent: true },
      })?.properties || {};
    const existingFieldIDs = Object.keys(exstingFieldsInSameLevel);

    if (
      (e.formData as unknown as { fieldID: string }).fieldID === undefined ||
      (e.formData as unknown as { fieldID: string }).fieldID === ""
    ) {
      console.log("Field ID is empty...");

      return;
    }
    if (
      selectedField.split(".").pop() !== (e.formData as unknown as { fieldID: string }).fieldID &&
      existingFieldIDs.includes((e.formData as unknown as { fieldID: string }).fieldID)
    ) {
      console.log("Field ID already exists...");

      return;
    }

    if (!/^[A-Za-z]/.test((e.formData as unknown as { fieldID: string }).fieldID)) {
      console.log("Field ID isn't starting with alphabet...");

      return;
    }

    dispatch(updateSelectedFieldPropertiesFormData({ formData: e.formData }));
  };

  const customValidate = (formData: FormData, errors: FormValidation): FormValidation => {
    const exstingFieldsInSameLevel =
      getSchemaFromDotPath({
        dotPath: selectedField,
        schema: formDefinition.stepDefinitions[activeStep].schema,
        options: { parent: true },
      })?.properties || {};
    const existingFieldIDs = Object.keys(exstingFieldsInSameLevel);

    if (
      selectedField.split(".").pop() !== (formData as unknown as { fieldID: string }).fieldID &&
      existingFieldIDs.includes((formData as unknown as { fieldID: string }).fieldID)
    ) {
      errors.fieldID?.addError("Field ID already exists");
      console.log("Field ID already exists...");
    }

    return errors;
  };

  return (
    <FormWithRules
      rules={rules}
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onChange={handleChange}
      onInitialChange={(formData: FormData) =>
        dispatch(updateSelectedFieldPropertiesFormData({ formData: formData as unknown as Record<string, string> }))
      }
      customValidate={customValidate}
      formData={selectedFieldPropertiesFormData}
      liveValidate
      noHtml5Validate
      templates={{
        ErrorListTemplate,
        FieldTemplate: CustomFieldTemplate,
        ObjectFieldTemplate: GroupedObjectFieldTemplate,
      }}
      widgets={{ CheckboxWidget: ToggleWidget }}
      idSeparator="."
      idPrefix={PROPERTIES_ROOT_EFORM_ID_PREFIX}
      className="flex flex-col gap-5"
      transformErrors={(error) => {
        return transformErrors(error, schema);
      }}
    >
      <></>
    </FormWithRules>
  );
};
