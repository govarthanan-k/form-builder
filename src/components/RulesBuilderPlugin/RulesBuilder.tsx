import React, { useState } from "react";

import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

import { JsonEditor } from "../JsonEditor";
import { defaultFieldIcons, sampleFieldList } from "./constants";
import { RuleItem } from "./RuleItem";
import { Rule, RuleBuilderAppProps } from "./types";
import { copyToClipboard, createEmptyRule } from "./utils";

export const RulesBuilder: React.FC<RuleBuilderAppProps> = ({
  fieldIcons = defaultFieldIcons,
  fieldList = [...sampleFieldList],
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);

  const addRule = () => {
    const newRule = createEmptyRule(fieldList);
    if (newRule) {
      setRules((prev) => [...prev, newRule]);
    }
  };

  const updateRule = (index: number, updatedRule: Rule) => {
    if (!updatedRule || typeof updatedRule !== "object") return;
    setRules((prev) => {
      const newRules = [...prev];
      newRules[index] = updatedRule;

      return newRules;
    });
  };

  const removeRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl p-6">
      <div className="space-y-6">
        {rules.map((rule, i) =>
          rule ? (
            <RuleItem
              key={i}
              rule={rule}
              ruleIndex={i}
              onChange={(r) => updateRule(i, r)}
              onDelete={() => removeRule(i)}
              fieldList={fieldList}
              fieldIcons={fieldIcons}
            />
          ) : null
        )}
      </div>
      <Button onClick={addRule} className="mt-8 bg-blue-600 text-white hover:bg-blue-700">
        + Add Rule
      </Button>
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Generated JSON</h3>
          <div className="flex items-center justify-between">
            <div className="ml-auto flex items-center gap-2">
              <Button
                onClick={async () => {
                  await copyToClipboard(rules);
                  setCopySuccess(true);
                  setTimeout(() => setCopySuccess(false), 2000);
                }}
                variant="outline"
                size="sm"
                className={`transition-colors ${
                  copySuccess
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : ""
                }`}
              >
                <Copy className="mr-1 h-4 w-4" />
                {copySuccess ? "Copied!" : "Copy Rules"}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-muted mx-0 space-y-3 rounded-md p-4">
          <JsonEditor value={rules} />
        </div>
      </div>
    </div>
  );
};
