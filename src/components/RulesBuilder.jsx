import { useState } from "react";

import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const operators = ["equal", "notEqual", "greater", "less", "empty", "notEmpty"];
const fields = ["username", "password", "confirmPassword"];
const eventTypes = ["remove", "hide", "show"];

export default function RuleBuilderApp() {
  const [rules, setRules] = useState([
    {
      conditions: {
        username: "empty",
      },
      event: {
        type: "remove",
        params: {
          fields: ["password", "confirmPassword"],
        },
      },
    },
    {
      conditions: {
        or: [
          {
            username: {
              equal: "admin",
            },
          },
          {
            username: {
              equal: "superuser",
            },
          },
        ],
      },
      event: {
        type: "remove",
        params: {
          fields: ["confirmPassword"],
        },
      },
    },
  ]);

  const addRule = () => {
    const newRule = createEmptyRule();
    if (newRule) {
      setRules((prev) => [...prev, newRule]);
    }
  };

  const updateRule = (index, updatedRule) => {
    if (!updatedRule || typeof updatedRule !== "object") return;
    setRules((prev) => {
      const newRules = [...prev];
      newRules[index] = updatedRule;
      return newRules;
    });
  };

  const removeRule = (index) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">JSON Rule Builder</h2>
      <div className="space-y-4">
        {rules.map((rule, i) =>
          rule ? <RuleItem key={i} rule={rule} onChange={(r) => updateRule(i, r)} onDelete={() => removeRule(i)} /> : null
        )}
      </div>
      <Button onClick={addRule} className="mt-6">
        + Add Rule
      </Button>
      <pre className="mt-6 rounded bg-gray-100 p-4 text-sm">{JSON.stringify(rules, null, 2)}</pre>
    </div>
  );
}

function createEmptyRule() {
  return {
    conditions: { username: "empty" },
    event: {
      type: "remove",
      params: { fields: [] },
    },
  };
}

function RuleItem({ rule, onChange, onDelete }) {
  const updateCondition = (cond) => {
    if (cond) onChange({ ...rule, conditions: cond });
  };

  const updateEventFields = (fieldsStr) => {
    const fields = fieldsStr
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    onChange({ ...rule, event: { ...rule.event, params: { fields } } });
  };

  const updateEventType = (type) => {
    onChange({ ...rule, event: { ...rule.event, type } });
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <ConditionEditor condition={rule.conditions} onChange={updateCondition} />
        <div>
          <label className="mb-1 block font-semibold">Event Type</label>
          <Select value={rule.event?.type} onValueChange={updateEventType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block font-semibold">Event: fields</label>
          <Input
            placeholder="password, confirmPassword"
            value={rule.event?.params?.fields?.join(", ") || ""}
            onChange={(e) => updateEventFields(e.target.value)}
          />
        </div>
        <Button variant="destructive" onClick={onDelete}>
          Delete Rule
        </Button>
      </CardContent>
    </Card>
  );
}

function ConditionEditor({ condition, onChange, depth = 0 }) {
  const [type, setType] = useState(detectType(condition));
  const [collapsed, setCollapsed] = useState(false);

  const handleFieldChange = (field, operator, value) => {
    if (!field) return;
    onChange({ [field]: operator === "empty" ? "empty" : { [operator]: value } });
  };

  const handleLogicalGroup = (logicalType) => {
    onChange({ [logicalType]: [createSimpleCondition()] });
    setType(logicalType);
  };

  const handleNestedChange = (index, newCond) => {
    const logicalKey = Object.keys(condition)[0];
    const newGroup = [...condition[logicalKey]];
    newGroup[index] = newCond;
    onChange({ [logicalKey]: newGroup });
  };

  const addNestedCondition = () => {
    const logicalKey = Object.keys(condition)[0];
    const newGroup = [...condition[logicalKey], createSimpleCondition()];
    onChange({ [logicalKey]: newGroup });
  };

  const deleteNestedCondition = (index) => {
    const logicalKey = Object.keys(condition)[0];
    const newGroup = condition[logicalKey].filter((_, i) => i !== index);
    onChange({ [logicalKey]: newGroup });
  };

  if (type === "simple") {
    const field = Object.keys(condition)[0] || "";
    const opVal = condition[field];
    const operator = typeof opVal === "string" ? "empty" : Object.keys(opVal || {})[0];
    const value = typeof opVal === "string" ? "" : opVal ? opVal[operator] : "";

    return (
      <div className="space-y-2">
        <div className="text-muted-foreground font-medium">Condition</div>
        <div className="flex gap-2">
          <Select value={field} onValueChange={(val) => handleFieldChange(val, operator, value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Field" />
            </SelectTrigger>
            <SelectContent>
              {fields.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={operator} onValueChange={(val) => handleFieldChange(field, val, value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              {operators.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {operator !== "empty" && (
            <Input
              className="w-40"
              placeholder="Value"
              value={value}
              onChange={(e) => handleFieldChange(field, operator, e.target.value)}
            />
          )}
        </div>
        <div className="text-sm">
          <Button variant="link" onClick={() => handleLogicalGroup("or")}>
            Convert to OR
          </Button>
          <Button variant="link" onClick={() => handleLogicalGroup("and")}>
            Convert to AND
          </Button>
        </div>
      </div>
    );
  }

  const logicalKey = Object.keys(condition)[0];
  const group = condition[logicalKey] || [];

  return (
    <div className="space-y-2">
      <div className="flex cursor-pointer items-center space-x-2" onClick={() => setCollapsed(!collapsed)}>
        <ChevronRight className={`h-4 w-4 transform transition-transform ${collapsed ? "" : "rotate-90"}`} />
        <span className="text-muted-foreground font-semibold">{logicalKey.toUpperCase()} Group</span>
      </div>
      {collapsed ? (
        <div className="text-muted-foreground ml-6 text-sm italic">
          {flattenSummaries(group).map((summary, i) => (
            <div key={i}>- {summary}</div>
          ))}
        </div>
      ) : (
        <div className="ml-4 border-l pl-4">
          {group.map((cond, i) => (
            <div key={i} className="mb-2">
              <ConditionEditor condition={cond} onChange={(c) => handleNestedChange(i, c)} depth={depth + 1} />
              <Button variant="ghost" size="sm" onClick={() => deleteNestedCondition(i)} className="text-red-500">
                Delete
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addNestedCondition} className="mt-2">
            + Add Condition
          </Button>
        </div>
      )}
    </div>
  );
}

function detectType(cond) {
  const key = Object.keys(cond)[0];
  return key === "or" || key === "and" ? key : "simple";
}

function createSimpleCondition() {
  return { username: { equal: "" } };
}

function summarizeCondition(condition) {
  const key = Object.keys(condition)[0];
  if (key === "or" || key === "and") {
    return `${key.toUpperCase()} group`;
  }
  const op = condition[key];
  if (typeof op === "string") {
    return `${key} is ${op}`;
  }
  const operator = Object.keys(op)[0];
  const value = op[operator];
  return `${key} ${operator} ${value}`;
}

function flattenSummaries(conditions, level = 0, isLast = true) {
  const summaries = [];
  const prefix = level === 0 ? "" : `${"│  ".repeat(level - 1)}${isLast ? "└─ " : "├─ "}`;

  if (!Array.isArray(conditions)) return summaries;

  conditions.forEach((cond, idx) => {
    const key = Object.keys(cond)[0];
    const isGroup = key === "or" || key === "and";
    const isLastItem = idx === conditions.length - 1;

    if (isGroup) {
      summaries.push(`${prefix}${key.toUpperCase()} group:`);
      const nested = flattenSummaries(cond[key], level + 1);
      summaries.push(...nested);
    } else {
      summaries.push(`${prefix}${summarizeCondition(cond)}`);
    }
  });

  return summaries;
}
