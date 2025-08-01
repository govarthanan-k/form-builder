import React, { useState } from "react";

import { ChevronRight, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { operatorIcons, operators } from "./constants";
import {
  Condition,
  ConditionEditorProps,
  ConditionType,
  LogicalCondition,
  LogicalOperator,
  Operator,
  SimpleCondition,
} from "./types";
import { createSimpleCondition, detectType, generateGroupSummary } from "./utils";

// ConditionEditor component
export const ConditionEditor: React.FC<ConditionEditorProps> = ({
  condition,
  depth = 0,
  fieldIcons,
  fieldList,
  onChange,
  onDelete,
}) => {
  const [type, setType] = useState<ConditionType>(detectType(condition));
  const [collapsed, setCollapsed] = useState(false);

  const handleFieldChange = (field: string, operator: Operator, value: string) => {
    if (!field) return;
    onChange({ [field]: operator === "empty" ? operator : { [operator]: value } });
  };

  const handleLogicalGroup = (logicalType: LogicalOperator) => {
    if (logicalType === "not") {
      onChange({ [logicalType]: condition });
    } else {
      onChange({ [logicalType]: [createSimpleCondition(fieldList)] });
    }
    setType(logicalType);
  };

  const handleNestedChange = (index: number, newCond: Condition) => {
    const logicalKey = Object.keys(condition)[0] as keyof LogicalCondition;
    const isLogicalCondition = (cond: Condition): cond is LogicalCondition => {
      return "or" in cond || "and" in cond || "not" in cond;
    };

    if (!isLogicalCondition(condition)) return;

    if (logicalKey === "or" && condition.or) {
      const newGroup = [...condition.or];
      newGroup[index] = newCond;
      onChange({ [logicalKey]: newGroup } as Condition);
    } else if (logicalKey === "and" && condition.and) {
      const newGroup = [...condition.and];
      newGroup[index] = newCond;
      onChange({ [logicalKey]: newGroup } as Condition);
    }
  };

  const addNestedCondition = () => {
    const logicalKey = Object.keys(condition)[0] as keyof LogicalCondition;
    const isLogicalCondition = (cond: Condition): cond is LogicalCondition => {
      return "or" in cond || "and" in cond || "not" in cond;
    };

    if (!isLogicalCondition(condition)) return;

    if (logicalKey === "or" && condition.or) {
      const newGroup = [...condition.or, createSimpleCondition(fieldList)];
      onChange({ [logicalKey]: newGroup } as Condition);
    } else if (logicalKey === "and" && condition.and) {
      const newGroup = [...condition.and, createSimpleCondition(fieldList)];
      onChange({ [logicalKey]: newGroup } as Condition);
    }
  };

  const deleteNestedCondition = (index: number) => {
    const logicalKey = Object.keys(condition)[0] as keyof LogicalCondition;
    const isLogicalCondition = (cond: Condition): cond is LogicalCondition => {
      return "or" in cond || "and" in cond || "not" in cond;
    };

    if (!isLogicalCondition(condition)) return;

    if (logicalKey === "or" && condition.or) {
      const newGroup = condition.or.filter((_, i) => i !== index);
      onChange({ [logicalKey]: newGroup } as Condition);
    } else if (logicalKey === "and" && condition.and) {
      const newGroup = condition.and.filter((_, i) => i !== index);
      onChange({ [logicalKey]: newGroup } as Condition);
    }
  };

  if (type === "simple") {
    const simpleCondition = condition as SimpleCondition;
    const field = Object.keys(simpleCondition)[0] || "";
    const opVal = simpleCondition[field];
    const operator = (typeof opVal === "string" ? opVal : Object.keys(opVal || {})[0]) as Operator;
    const value =
      typeof opVal === "string"
        ? ""
        : opVal && typeof opVal === "object"
          ? (opVal as Record<string, string>)[operator] || ""
          : "";

    return (
      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span className="font-medium">Condition</span>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete Condition
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full">
            <label className="text-muted-foreground mb-2 block text-sm font-medium">Field:</label>
            <Select value={field} onValueChange={(val) => handleFieldChange(val, operator, value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                {fieldList.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <label className="text-muted-foreground mb-2 block text-sm font-medium">Operator:</label>
            <Select value={operator} onValueChange={(val) => handleFieldChange(field, val as Operator, value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                {operators.map((op) => {
                  const Icon = operatorIcons[op];

                  return (
                    <SelectItem key={op} value={op}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {op}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {operator !== "empty" && (
            <div className="w-full">
              <label className="text-muted-foreground mb-2 block text-sm font-medium">Value:</label>
              <Input
                className="w-full"
                placeholder="Value"
                value={value}
                onChange={(e) => handleFieldChange(field, operator, e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-1 border-t pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLogicalGroup("or")}
            className="px-1 text-[10px] whitespace-nowrap text-blue-600 hover:text-blue-700 sm:text-sm"
          >
            Convert to OR
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLogicalGroup("and")}
            className="px-1 text-[10px] whitespace-nowrap text-green-600 hover:text-green-700 sm:text-sm"
          >
            Convert to AND
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLogicalGroup("not")}
            className="px-1 text-[10px] whitespace-nowrap text-purple-600 hover:text-purple-700 sm:text-sm"
          >
            Convert to NOT
          </Button>
        </div>
      </div>
    );
  }

  // For logical groups: and, or, not
  const isLogicalCondition = (cond: Condition): cond is LogicalCondition => {
    return "or" in cond || "and" in cond || "not" in cond;
  };

  if (!isLogicalCondition(condition)) return null;

  const logicalKey = Object.keys(condition)[0] as keyof LogicalCondition;
  const group =
    logicalKey === "not" && condition.not
      ? [condition.not]
      : logicalKey === "or" && condition.or
        ? condition.or
        : logicalKey === "and" && condition.and
          ? condition.and
          : [];

  const groupSummary = generateGroupSummary(condition, fieldIcons);

  return (
    <div className="space-y-3">
      <div className="bg-muted hover:bg-muted/80 flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors">
        <div className="flex items-center gap-3" onClick={() => setCollapsed(!collapsed)}>
          <ChevronRight
            className={`h-5 w-5 transform transition-transform ${collapsed ? "" : "rotate-90"} text-muted-foreground`}
          />
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                logicalKey === "or"
                  ? "bg-orange-500"
                  : logicalKey === "and"
                    ? "bg-green-500"
                    : logicalKey === "not"
                      ? "bg-purple-500"
                      : "bg-blue-500"
              }`}
            ></div>
            <span className="font-semibold">{logicalKey.toUpperCase()} Group</span>
            <span className="text-muted-foreground text-sm">
              ({group.length} condition{group.length !== 1 ? "s" : ""})
            </span>
          </div>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete Group
          </Button>
        )}
      </div>

      {collapsed ? (
        <div className="ml-8 space-y-2">
          {groupSummary.map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {item.icon && <item.icon className="text-muted-foreground h-4 w-4 flex-shrink-0" />}
                <span className="text-muted-foreground truncate">{item.text}</span>
                {item.badge && (
                  <span
                    className={`flex-shrink-0 rounded-full px-2 py-1 text-xs ${
                      item.badge === "OR"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400"
                        : item.badge === "AND"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                          : item.badge === "NOT"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-border ml-6 space-y-3 border-l-2 pl-4">
          {group.map((cond: Condition, i: number) => (
            <div key={i} className="space-y-2">
              <ConditionEditor
                condition={cond}
                onChange={(c) => (logicalKey === "not" ? onChange({ [logicalKey]: c } as Condition) : handleNestedChange(i, c))}
                onDelete={logicalKey !== "not" ? () => deleteNestedCondition(i) : undefined}
                depth={depth + 1}
                fieldList={fieldList}
                fieldIcons={fieldIcons}
              />
            </div>
          ))}
          {logicalKey !== "not" && (
            <Button variant="outline" size="sm" onClick={addNestedCondition} className="mt-3">
              + Add Condition
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
