"use client";

import { useEffect, useState } from "react";

import { descriptors } from "@/rjsf/descriptors";
import { Rule } from "@/rjsf/descriptors/descriptors.types";
import { actions } from "@/rjsf/rules/actions";
import { ErrorListTemplate } from "@/rjsf/templates/ErrorListTemplate";
import { useAppDispatch, useAppSelector } from "@/store/app/hooks";
import { updateSelectedFieldPropertiesFormData } from "@/store/features";
import { getUiSchemaFromDotPath, transformErrors } from "@/utils";
import { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/shadcn";
import { UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import RulesEngine from "json-rules-engine-simplified";
import { JSONSchema7 } from "json-schema";

import { FieldType } from "@/components/LeftPanel";

import { PROPERTIES_ROOT_EFORM_ID_PREFIX } from "@/constants";

import { GetPropertiesSchemaArgs } from "./FieldPropertiesForm.types";

export const FieldPropertiesForm = () => {
  const {
    inspectFieldSchemas = { schema: {}, uiSchema: {} },
    selectedField,
    selectedFieldPropertiesFormData,
  } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const { rules, schema, uiSchema } = inspectFieldSchemas;

  const [rulesModifiedSchema, setRulesModifiedSchema] = useState(schema);
  const [rulesModifiedUiSchema, setRulesModifiedUiSchema] = useState(uiSchema);

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

  useEffect(() => {
    const formDataAfterRules = structuredClone(selectedFieldPropertiesFormData);
    const engine = new RulesEngine();
    const newSchema = structuredClone(schema);
    const newUiSchema = structuredClone(uiSchema);

    // Add rules to the engine
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rules?.forEach((rule: any) => engine.addRule(rule));

    // Run the engine to evaluate the conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    engine.run(formDataAfterRules).then((results: any) => {
      console.log(results);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results.forEach((event: any) => {
        const { params: eventParams, type: eventType } = event;
        if (Object.keys(actions).includes(eventType)) {
          actions[eventType](eventParams, newSchema, newUiSchema, formDataAfterRules);
        }
      });

      setRulesModifiedSchema(newSchema);
      setRulesModifiedUiSchema(newUiSchema);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedField]);

  if (!selectedField) return null;

  const handleChange = (e: IChangeEvent) => {
    const formDataAfterRules = structuredClone(e.formData);
    console.log("formDataBeforeRules => ", formDataAfterRules);
    const engine = new RulesEngine();
    const newSchema = structuredClone(schema);
    const newUiSchema = structuredClone(uiSchema);

    // Add rules to the engine
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rules?.forEach((rule: any) => engine.addRule(rule));

    // Run the engine to evaluate the conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    engine.run(formDataAfterRules).then((results: any) => {
      console.log(results);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results.forEach((event: any) => {
        const { params: eventParams, type: eventType } = event;
        if (Object.keys(actions).includes(eventType)) {
          actions[eventType](eventParams, newSchema, newUiSchema, formDataAfterRules);
        }
      });

      setRulesModifiedSchema(newSchema);
      setRulesModifiedUiSchema(newUiSchema);
      console.log("formDataAfterRules => ", formDataAfterRules);
      dispatch(updateSelectedFieldPropertiesFormData({ formData: formDataAfterRules }));
    });
  };

  return (
    <Form
      schema={structuredClone(rulesModifiedSchema)}
      uiSchema={structuredClone(rulesModifiedUiSchema)}
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
}: GetPropertiesSchemaArgs): { schema: JSONSchema7; uiSchema: UiSchema; rules?: Rule[] } => {
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
    const { dataSchema: schema, rules, uiSchema } = descriptors[fieldType].propertiesConfiguration;

    return { schema, uiSchema, rules };
  }

  return {
    schema: { type: "object", required: [], properties: {} },
    uiSchema: {},
  };
};
