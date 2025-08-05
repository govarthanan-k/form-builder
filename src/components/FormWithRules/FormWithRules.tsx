"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { actions, ActionsMap } from "@/rjsf/rules/actions";
import { transformErrors } from "@/utils";
import { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/shadcn";
import { UiSchema } from "@rjsf/utils";
import equal from "fast-deep-equal";
import RulesEngine, { Rule } from "json-rules-engine-simplified";
import { JSONSchema7 } from "json-schema";

import { FormData } from "@/types/editor.types";

import { FormWithRulesProps } from "./FormWithRules.types";

type RulesEngineInstance = {
  run: (formData: FormData) => Promise<Array<{ params: unknown; type: string }>>;
};

interface ApplyRulesResult {
  schema: JSONSchema7;
  uiSchema: UiSchema | undefined;
  formData: FormData;
  runs: number;
  reachedMax: boolean;
}

interface ApplyRulesOptions {
  maxRuns?: number;
  debug?: boolean;
}

const deepClone = <T = unknown,>(obj: T): T => structuredClone(obj);

const hasDataChanged = (
  prevSchema: JSONSchema7,
  newSchema: JSONSchema7,
  prevUiSchema: UiSchema | undefined,
  newUiSchema: UiSchema | undefined,
  prevFormData: FormData,
  newFormData: FormData
): boolean => {
  return !equal(prevSchema, newSchema) || !equal(prevUiSchema, newUiSchema) || !equal(prevFormData, newFormData);
};

// Log changes for debugging
const logChanges = (
  prevSchema: JSONSchema7,
  newSchema: JSONSchema7,
  prevUiSchema: UiSchema | undefined,
  newUiSchema: UiSchema | undefined,
  prevFormData: FormData,
  newFormData: FormData
): void => {
  if (!equal(prevSchema, newSchema)) {
    console.log("schema changed => ", { prevSchema, newSchema });
  }
  if (!equal(prevUiSchema, newUiSchema)) {
    console.log("uischema changed => ", { prevUiSchema, newUiSchema });
  }
  if (!equal(prevFormData, newFormData)) {
    console.log("formData changed => ", { prevFormData, newFormData });
  }
};

// Apply a single set of rule results
const applyRuleResults = (
  results: Array<{ params: unknown; type: string }>,
  actionsMap: ActionsMap,
  schema: JSONSchema7,
  uiSchema: UiSchema | undefined,
  formData: FormData,
  debug: boolean
): void => {
  results.forEach(({ params, type }) => {
    const actionFn = actionsMap[type];
    if (actionFn) {
      try {
        actionFn(params, schema, uiSchema, formData);
      } catch (err) {
        if (debug) console.error(`[rules] action ${type} threw`, err);
      }
    }
  });
};

/**
 * Apply rules repeatedly until the schema/uiSchema/formData stabilizes or maxRuns reached.
 */
const applyRulesUntilStable = async (
  engine: RulesEngineInstance,
  actionsMap: ActionsMap,
  initialSchema: JSONSchema7,
  initialUiSchema: UiSchema | undefined,
  initialFormData: FormData,
  options: ApplyRulesOptions = {}
): Promise<ApplyRulesResult> => {
  const { debug = false, maxRuns = 10 } = options;

  const newSchema = deepClone(initialSchema);
  const newUiSchema = deepClone(initialUiSchema);
  const newFormData = deepClone(initialFormData);

  let runs = 0;
  let hasChanged = true;

  while (hasChanged && runs < maxRuns) {
    runs++;
    if (debug) console.debug(`[rules] iteration #${runs}`);

    const prevSchema = deepClone(newSchema);
    const prevUiSchema = deepClone(newUiSchema);
    const prevFormData = deepClone(newFormData);

    // Run engine
    const results = await engine.run(newFormData);

    // Early exit if no results
    if (!results?.length) {
      if (debug) console.debug("[rules] engine.run returned no results -> breaking early");
      break;
    }

    // Apply actions
    applyRuleResults(results, actionsMap, newSchema, newUiSchema, newFormData, debug);

    // Check for changes
    hasChanged = hasDataChanged(prevSchema, newSchema, prevUiSchema, newUiSchema, prevFormData, newFormData);

    if (hasChanged && debug) {
      logChanges(prevSchema, newSchema, prevUiSchema, newUiSchema, prevFormData, newFormData);
    }
  }

  const reachedMax = runs >= maxRuns;
  if (reachedMax && debug) {
    console.warn(`[rules] reached maxRuns (${maxRuns}). Aborting further runs.`);
  }

  return {
    schema: newSchema,
    uiSchema: newUiSchema,
    formData: newFormData,
    runs,
    reachedMax,
  };
};

// Custom hook for debounced callbacks
const useDebouncedCallback = <T extends (...args: never[]) => void | Promise<void>>(callback: T, delay: number): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback as T;
};

// Main component
export const FormWithRules = ({
  formData,
  maxRuleRuns = 10,
  onChange,
  onInitialChange,
  rules,
  rulesDebug = true,
  schema,
  uiSchema,
  ...props
}: FormWithRulesProps & { maxRuleRuns?: number; rulesDebug?: boolean }) => {
  const [rulesModifiedSchema, setRulesModifiedSchema] = useState<JSONSchema7>(schema);
  const [rulesModifiedUiSchema, setRulesModifiedUiSchema] = useState<UiSchema | undefined>(uiSchema);
  const [rulesModifiedFormData, setRulesModifiedFormData] = useState<FormData>(formData);

  // Create rules engine
  const engine = useMemo(() => {
    const rulesEngine = new RulesEngine();
    rules?.forEach((rule: Rule) => rulesEngine.addRule(rule));

    return rulesEngine;
  }, [rules]);

  // Initial rules application
  useEffect(() => {
    const runInitialRules = async (): Promise<void> => {
      if (!engine) return;

      if (rulesDebug) console.debug("[rules] initial run starting");

      const result = await applyRulesUntilStable(engine, actions, schema, uiSchema, formData, {
        maxRuns: maxRuleRuns,
        debug: rulesDebug,
      });

      setRulesModifiedSchema(result.schema);
      setRulesModifiedUiSchema(result.uiSchema);
      setRulesModifiedFormData(result.formData);
      onInitialChange?.(result.formData);

      if (result.reachedMax && rulesDebug) {
        console.warn(`[rules] initial run hit max runs (${maxRuleRuns}).`);
      }
    };

    runInitialRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally run once on mount

  // Handle form changes with debouncing
  const handleChange = useDebouncedCallback(async (event: IChangeEvent): Promise<void> => {
    if (rulesDebug) {
      console.debug("handleChange - running rules (debounced)", event.errors ?? []);
    }

    console.log("Errors => ", event.errors);
    const result = await applyRulesUntilStable(engine, actions, schema, uiSchema, event.formData, {
      maxRuns: maxRuleRuns,
      debug: rulesDebug,
    });

    setRulesModifiedSchema(result.schema);
    setRulesModifiedUiSchema(result.uiSchema);
    setRulesModifiedFormData(result.formData);

    if (result.reachedMax && rulesDebug) {
      console.warn(`[rules] handleChange hit max runs (${maxRuleRuns}).`);
    }
    console.log("onchange event => ", event);

    onChange?.(event);
  }, 200);

  return (
    <Form
      {...props}
      schema={deepClone(rulesModifiedSchema)}
      uiSchema={deepClone(rulesModifiedUiSchema)}
      formData={deepClone(rulesModifiedFormData)}
      transformErrors={(errors) => transformErrors(errors, schema)}
      onChange={handleChange}
      // liveOmit
      // omitExtraData
    >
      <></>
    </Form>
  );
};

export default FormWithRules;
