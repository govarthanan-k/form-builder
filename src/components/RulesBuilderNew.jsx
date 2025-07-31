import { useEffect, useRef, useState } from "react";

import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  Copy,
  Equal,
  EqualNot,
  Eye,
  EyeOff,
  Lock,
  Shield,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { JsonEditor } from "./JsonEditor";

const operators = ["equal", "notEqual", "greater", "less", "empty"];

// Operator icons mapping
const operatorIcons = {
  equal: Equal,
  notEqual: EqualNot,
  greater: ChevronUp,
  less: ChevronDown,
  empty: Circle,
};
const eventTypes = ["remove", "hide", "show", "required"];

// Default field icons mapping (can be overridden via props)
const defaultFieldIcons = {
  username: UserCheck,
  password: Lock,
  confirmPassword: Shield,
};

// Event type icons mapping
const eventIcons = {
  remove: Trash2,
  hide: EyeOff,
  show: Eye,
  required: AlertCircle,
};

export default function RuleBuilderApp({
  fieldList = [
    "username",
    "password",
    "confirmPassword",
    "personalDetails",
    "personalDetails.firstName",
    "personalDetails.lastName",
    "personalDetails.address",
    "personalDetails.address.addressLine1",
    "personalDetails.address.addressLine2",
    "personalDetails.address.zipcode",
  ],
  fieldIcons = defaultFieldIcons,
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [rules, setRules] = useState([
    {
      conditions: {
        [fieldList[0]]: "empty",
      },
      event: {
        type: "remove",
        params: {
          fields: fieldList.slice(1),
        },
      },
    },
    {
      conditions: {
        or: [
          {
            [fieldList[0]]: {
              equal: "admin",
            },
          },
          {
            [fieldList[0]]: {
              equal: "superuser",
            },
          },
        ],
      },
      event: {
        type: "remove",
        params: {
          fields: fieldList.slice(-1),
        },
      },
    },
  ]);

  const addRule = () => {
    const newRule = createEmptyRule(fieldList);
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(rules, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = JSON.stringify(rules, null, 2);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className={`mx-auto min-h-screen max-w-6xl p-6 ${darkMode ? "dark" : ""}`}>
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
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className={`transition-colors ${copySuccess ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400" : ""}`}
              >
                <Copy className="mr-1 h-4 w-4" />
                {copySuccess ? "Copied!" : "Copy Rules"}
              </Button>
            </div>
          </div>
        </div>

        {/* <pre className="bg-muted overflow-x-auto rounded-lg border p-6 text-sm">{JSON.stringify(rules, null, 2)}</pre> */}
        <div className="bg-muted mx-0 space-y-3 rounded-md p-4">
          <JsonEditor value={rules} />
        </div>
      </div>
    </div>
  );
}

function createEmptyRule(fieldList) {
  return {
    conditions: { [fieldList[0]]: "empty" },
    event: {
      type: "remove",
      params: { fields: [] },
    },
  };
}

function MultiSelectDropdown({ options, value = [], onChange, placeholder = "Select options...", fieldIcons }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (option) => {
    const newValue = value.includes(option) ? value.filter((v) => v !== option) : [...value, option];
    onChange(newValue);
  };

  const removeOption = (option, e) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== option));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {value.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            value.map((item) => {
              const Icon = fieldIcons[item];
              return (
                <span
                  key={item}
                  className="bg-primary/10 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
                >
                  {item}
                  <button onClick={(e) => removeOption(item, e)} className="hover:bg-primary/20 ml-1 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })
          )}
        </div>
        <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
      </div>

      {isOpen && (
        <div className="bg-popover text-popover-foreground absolute top-full z-50 mt-1 w-full rounded-md border p-1 shadow-md">
          {options.map((option) => {
            const isSelected = value.includes(option);
            return (
              <div
                key={option}
                className="hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none"
                onClick={() => toggleOption(option)}
              >
                <div className="flex flex-1 items-center gap-2">{option}</div>
                {isSelected && <Check className="h-4 w-4" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RuleItem({ rule, ruleIndex, onChange, onDelete, fieldList, fieldIcons }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateCondition = (cond) => {
    if (cond) onChange({ ...rule, conditions: cond });
  };

  const updateEventFields = (fields) => {
    onChange({ ...rule, event: { ...rule.event, params: { fields } } });
  };

  const updateEventType = (type) => {
    onChange({ ...rule, event: { ...rule.event, type } });
  };

  // Generate rule summary for collapsed view
  const generateRuleSummary = () => {
    const conditionSummary = generateConditionSummary(rule.conditions);
    const eventType = rule.event?.type || "unknown";
    const targetFields = rule.event?.params?.fields || [];
    const EventIcon = eventIcons[eventType];

    return {
      condition: conditionSummary,
      event: eventType,
      eventIcon: EventIcon,
      targetFields: targetFields.slice(0, 2), // Show max 2 fields
      moreFields: targetFields.length > 2 ? targetFields.length - 2 : 0,
    };
  };

  const summary = generateRuleSummary();

  return (
    <Card className="border-l-4 border-l-blue-500 py-0 shadow-sm">
      <CardContent className="p-0">
        {/* Accordion Header */}
        <div
          className="hover:bg-muted/50 flex cursor-pointer items-center justify-between p-6 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <ChevronRight className={`h-5 w-5 flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 text-lg font-semibold">Rule {ruleIndex + 1}</h3>
              {!isExpanded && (
                <div className="space-y-1">
                  <div className="text-muted-foreground truncate text-sm">
                    <span className="font-medium">If:</span> {summary.condition}
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <span className="font-medium">Then:</span>
                    {summary.eventIcon && <summary.eventIcon className="h-4 w-4" />}
                    <span>{summary.event}</span>
                    {summary.targetFields.length > 0 && (
                      <>
                        <span>→</span>
                        <span className="truncate">
                          {summary.targetFields.join(", ")}
                          {summary.moreFields > 0 && <span> +{summary.moreFields} more</span>}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </div>

        {/* Accordion Content */}
        {isExpanded && (
          <div className="space-y-6 border-t px-6 pb-6">
            <div className="pt-6">
              <ConditionEditor
                condition={rule.conditions}
                onChange={updateCondition}
                fieldList={fieldList}
                fieldIcons={fieldIcons}
              />
            </div>

            <div className="bg-muted space-y-4 rounded-lg p-4">
              <h4 className="font-medium">Event Configuration</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                <div>
                  <label className="text-muted-foreground mb-2 block text-sm font-medium">Event Type</label>
                  <Select value={rule.event?.type} onValueChange={updateEventType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => {
                        const Icon = eventIcons[type];
                        return (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {type}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-muted-foreground mb-2 block text-sm font-medium">Target Fields</label>
                  <MultiSelectDropdown
                    options={fieldList}
                    value={rule.event?.params?.fields || []}
                    onChange={updateEventFields}
                    placeholder="Select target fields..."
                    fieldIcons={fieldIcons}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ConditionEditor({ condition, onChange, depth = 0, fieldList, fieldIcons }) {
  const [type, setType] = useState(detectType(condition));
  const [collapsed, setCollapsed] = useState(false);

  const handleFieldChange = (field, operator, value) => {
    if (!field) return;
    onChange({ [field]: operator === "empty" ? operator : { [operator]: value } });
  };

  const handleLogicalGroup = (logicalType) => {
    if (logicalType === "not") {
      onChange({ [logicalType]: condition });
    } else {
      onChange({ [logicalType]: [createSimpleCondition(fieldList)] });
    }
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
    const newGroup = [...condition[logicalKey], createSimpleCondition(fieldList)];
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
    const operator = typeof opVal === "string" ? opVal : Object.keys(opVal || {})[0];
    const value = typeof opVal === "string" ? "" : opVal ? opVal[operator] : "";

    return (
      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <span className="font-medium">Condition</span>
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
            <Select value={operator} onValueChange={(val) => handleFieldChange(field, val, value)} className="w-full">
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

  const logicalKey = Object.keys(condition)[0];
  const group = logicalKey === "not" ? [condition[logicalKey]] : condition[logicalKey] || [];
  const groupSummary = generateGroupSummary(condition, fieldIcons);

  return (
    <div className="space-y-3">
      <div
        className="bg-muted hover:bg-muted/80 flex cursor-pointer items-center space-x-3 rounded-lg p-3 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
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
          {group.map((cond, i) => (
            <div key={i} className="space-y-2">
              <ConditionEditor
                condition={cond}
                onChange={(c) => (logicalKey === "not" ? onChange({ [logicalKey]: c }) : handleNestedChange(i, c))}
                depth={depth + 1}
                fieldList={fieldList}
                fieldIcons={fieldIcons}
              />
              {logicalKey !== "not" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNestedCondition(i)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              )}
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
}

function detectType(cond) {
  const key = Object.keys(cond)[0];
  return key === "or" || key === "and" || key === "not" ? key : "simple";
}

function createSimpleCondition(fieldList) {
  return { [fieldList[0]]: { equal: "" } };
}

function generateConditionSummary(condition) {
  const key = Object.keys(condition)[0];

  if (key === "or" || key === "and") {
    const group = condition[key] || [];
    if (group.length === 1) {
      return generateConditionSummary(group[0]);
    }
    const summaries = group.map(generateConditionSummary);
    const connector = key === "or" ? " OR " : " AND ";
    return `(${summaries.join(connector)})`;
  } else if (key === "not") {
    const innerSummary = generateConditionSummary(condition[key]);
    return `NOT (${innerSummary})`;
  } else {
    // Simple condition
    const opVal = condition[key];
    const operator = typeof opVal === "string" ? opVal : Object.keys(opVal || {})[0];
    const value = typeof opVal === "string" ? "" : opVal ? opVal[operator] : "";
    const displayValue = value ? ` "${value}"` : "";
    return `${key} ${operator}${displayValue}`;
  }
}

function generateGroupSummary(condition, fieldIcons) {
  const key = Object.keys(condition)[0];
  if (key !== "or" && key !== "and" && key !== "not") return [];

  const group = key === "not" ? [condition[key]] : condition[key] || [];
  const summary = [];

  group.forEach((cond, idx) => {
    const condKey = Object.keys(cond)[0];
    const isGroup = condKey === "or" || condKey === "and" || condKey === "not";

    if (isGroup) {
      const nestedCount = condKey === "not" ? 1 : cond[condKey].length;
      summary.push({
        text:
          condKey === "not"
            ? `NOT condition`
            : `${condKey.toUpperCase()} group with ${nestedCount} condition${nestedCount !== 1 ? "s" : ""}`,
        badge: condKey.toUpperCase(),
        icon: null,
      });
    } else {
      const opVal = cond[condKey];
      const operator = typeof opVal === "string" ? opVal : Object.keys(opVal || {})[0];
      const value = typeof opVal === "string" ? "" : opVal ? opVal[operator] : "";
      const displayValue = value ? ` "${value}"` : "";

      summary.push({
        text: `${condKey} ${operator}${displayValue}`,
        icon: null,
        badge: null,
      });
    }
  });

  return summary;
}

export { RuleBuilderApp };
