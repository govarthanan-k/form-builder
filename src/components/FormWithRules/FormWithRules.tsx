"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { actions } from "@/rjsf/rules/actions";
import { transformErrors } from "@/utils";
import { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/shadcn";
import { UiSchema } from "@rjsf/utils";
import equal from "fast-deep-equal";
import RulesEngine, { Rule } from "json-rules-engine-simplified";
import { JSONSchema7 } from "json-schema";

import { FormWithRulesProps } from "./FormWithRules.types";

// ✅ Custom debounce hook
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebouncedCallback<T extends (...args: any[]) => void>(callback: T, delay: number): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounced = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debounced as T;
}

export const FormWithRules = ({ formData, onChange, onInitialChange, rules, schema, uiSchema, ...props }: FormWithRulesProps) => {
  const [rulesModifiedSchema, setRulesModifiedSchema] = useState(schema);
  const [rulesModifiedUiSchema, setRulesModifiedUiSchema] = useState(uiSchema);

  const engine = useMemo(() => {
    const eng = new RulesEngine();
    rules?.forEach((rule: Rule) => eng.addRule(rule));

    return eng;
  }, [rules]);

  useEffect(() => {
    const runRulesUntilStable = async () => {
      console.log("Running rules in useEffect");
      const newSchema = structuredClone(schema);
      const newUiSchema = structuredClone(uiSchema);
      const newFormData = structuredClone(formData);

      let hasChanged = true;
      let prevSchema: JSONSchema7;
      let prevUiSchema: UiSchema | undefined;
      let prevFormData: FormData;

      while (hasChanged) {
        console.log("Running rules in useEffect - loop");
        prevSchema = structuredClone(newSchema);
        prevUiSchema = structuredClone(newUiSchema);
        prevFormData = structuredClone(newFormData);

        const results = await engine.run(newFormData);
        results?.forEach(({ params, type }) => {
          if (actions[type]) {
            actions[type](params, newSchema, newUiSchema, newFormData);
          }
        });

        hasChanged = !equal(prevSchema, newSchema) || !equal(prevUiSchema, newUiSchema) || !equal(prevFormData, newFormData);
      }

      setRulesModifiedSchema(newSchema);
      setRulesModifiedUiSchema(newUiSchema);
      onInitialChange(newFormData);
    };

    runRulesUntilStable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = useDebouncedCallback(async (e: IChangeEvent) => {
    console.log("Running rules in handleChange - ", e.errors);
    if (e.errors.length === 0) {
      const newSchema = structuredClone(schema);
      const newUiSchema = structuredClone(uiSchema);
      const newFormData = structuredClone(e.formData);

      let hasChanged = true;
      let prevSchema: JSONSchema7;
      let prevUiSchema: UiSchema | undefined;
      let prevFormData: FormData;

      while (hasChanged) {
        console.log("Running rules in handleChange - loop");
        prevSchema = structuredClone(newSchema);
        prevUiSchema = structuredClone(newUiSchema);
        prevFormData = structuredClone(newFormData);

        const result = await engine.run(newFormData);
        result.forEach(({ params, type }) => {
          if (actions[type]) {
            actions[type](params, newSchema, newUiSchema, newFormData);
          }
        });

        hasChanged = !equal(prevSchema, newSchema) || !equal(prevUiSchema, newUiSchema) || !equal(prevFormData, newFormData);
      }

      setRulesModifiedSchema(newSchema);
      setRulesModifiedUiSchema(newUiSchema);
    }
    onChange?.(e);
  }, 200);

  return (
    <Form
      schema={rulesModifiedSchema}
      uiSchema={rulesModifiedUiSchema}
      formData={formData}
      transformErrors={(errors) => transformErrors(errors, schema)}
      onChange={handleChange}
      {...props}
    >
      <></>
    </Form>
  );
};
