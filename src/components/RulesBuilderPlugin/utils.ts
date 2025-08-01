import {
  AND,
  Condition,
  ConditionType,
  FieldIcons,
  GroupSummaryItem,
  LogicalCondition,
  LogicalOperator,
  NOT,
  OR,
  REMOVE,
  Rule,
  SimpleCondition,
} from "./types";

export const copyToClipboard = async (object: object) => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(object, null, 2));
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = JSON.stringify(object, null, 2);
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};

export const createEmptyRule = (fieldList: string[]): Rule => {
  return {
    conditions: { [fieldList[0]]: "empty" },
    event: {
      type: REMOVE,
      params: { fields: [] },
    },
  };
};

export const createSimpleCondition = (fieldList: string[]): Condition => {
  return { [fieldList[0]]: { equal: "" } };
};

// Utility functions
export const detectType = (condition: Condition): ConditionType => {
  const key = Object.keys(condition)[0];

  return key === OR || key === AND || key === NOT ? (key as LogicalOperator) : "simple";
};

export const generateConditionSummary = (condition: Condition): string => {
  const key = Object.keys(condition)[0];

  const isLogicalCondition = (cond: Condition): cond is LogicalCondition => {
    return OR in cond || AND in cond || NOT in cond;
  };

  if (key === OR || key === AND) {
    if (!isLogicalCondition(condition)) return "";

    const group = key === OR ? condition.or : condition.and;
    if (!group) return "";

    if (group.length === 1) {
      return generateConditionSummary(group[0]);
    }
    const summaries = group.map(generateConditionSummary);
    const connector = key === OR ? " OR " : " AND ";

    return `(${summaries.join(connector)})`;
  } else if (key === NOT) {
    if (!isLogicalCondition(condition) || !condition.not) return "";
    const innerSummary = generateConditionSummary(condition.not);

    return `NOT (${innerSummary})`;
  } else {
    // Simple condition
    const simpleCondition = condition as SimpleCondition;
    const opVal = simpleCondition[key];
    const operator = typeof opVal === "string" ? opVal : Object.keys(opVal || {})[0];
    const value =
      typeof opVal === "string" ? "" : opVal && typeof opVal === "object" ? (opVal as Record<string, string>)[operator] : "";
    const displayValue = value ? ` "${value}"` : "";

    return `${key} ${operator}${displayValue}`;
  }
};

export const generateGroupSummary = (condition: Condition, fieldIcons: FieldIcons): GroupSummaryItem[] => {
  const key = Object.keys(condition)[0];
  if (key !== OR && key !== AND && key !== NOT) return [];

  const isLogicalCondition = (cond: Condition): cond is LogicalCondition => {
    return OR in cond || AND in cond || NOT in cond;
  };

  if (!isLogicalCondition(condition)) return [];

  const group =
    key === NOT && condition.not
      ? [condition.not]
      : key === OR && condition.or
        ? condition.or
        : key === AND && condition.and
          ? condition.and
          : [];

  const summary: GroupSummaryItem[] = [];

  group.forEach((cond: Condition) => {
    const condKey = Object.keys(cond)[0];
    const isGroup = condKey === OR || condKey === AND || condKey === NOT;

    if (isGroup && isLogicalCondition(cond)) {
      const nestedCount =
        condKey === NOT ? 1 : condKey === OR && cond.or ? cond.or.length : condKey === AND && cond.and ? cond.and.length : 0;

      summary.push({
        text:
          condKey === NOT
            ? `NOT condition`
            : `${condKey.toUpperCase()} group with ${nestedCount} condition${nestedCount !== 1 ? "s" : ""}`,
        badge: condKey.toUpperCase(),
        icon: null,
      });
    } else {
      const simpleCondition = cond as SimpleCondition;
      const opVal = simpleCondition[condKey];
      const operator = typeof opVal === "string" ? opVal : Object.keys(opVal || {})[0];
      const value =
        typeof opVal === "string" ? "" : opVal && typeof opVal === "object" ? (opVal as Record<string, string>)[operator] : "";
      const displayValue = value ? ` "${value}"` : "";

      summary.push({
        text: `${condKey} ${operator}${displayValue}`,
        icon: null,
        badge: null,
      });
    }
  });

  return summary;
};
