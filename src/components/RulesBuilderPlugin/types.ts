import { LucideIcon } from "lucide-react";

export type Condition = LogicalCondition | SimpleCondition;

export interface ConditionEditorProps {
  condition: Condition;
  depth?: number;
  fieldIcons: FieldIcons;
  fieldList: string[];
  onChange: (condition: Condition) => void;
  onDelete?: () => void;
}

export type ConditionType = LogicalOperator | "simple";

export interface Event {
  type: EventType;
  params: {
    fields: string[];
  };
}

export type EventType = typeof REMOVE | typeof HIDE | typeof SHOW | typeof REQUIRE;

export interface FieldIcons {
  [key: string]: LucideIcon;
}

export interface GroupSummaryItem {
  text: string;
  badge?: string | null;
  icon?: LucideIcon | null;
}

export interface LogicalCondition {
  or?: Condition[];
  and?: Condition[];
  not?: Condition;
}

export type LogicalOperator = typeof AND | typeof OR | typeof NOT;

export interface MultiSelectDropdownProps {
  fieldIcons: FieldIcons;
  onChange: (value: string[]) => void;
  options: string[];
  placeholder?: string;
  value?: string[];
}

export type Operator = typeof EQUAL | typeof NOT_EQUAL | typeof GREATER | typeof LESS | typeof EMPTY;

export type OperatorValue = string | { [operator: string]: string };

export interface Rule {
  conditions: Condition;
  event: Event;
}

export interface RuleBuilderAppProps {
  fieldIcons?: FieldIcons;
  fieldList?: string[];
}

export interface RuleItemProps {
  fieldIcons: FieldIcons;
  fieldList: string[];
  onChange: (rule: Rule) => void;
  onDelete: () => void;
  rule: Rule;
  ruleIndex: number;
}

export interface SimpleCondition {
  [fieldName: string]: OperatorValue;
}

export const AND = "and";

export const EMPTY = "empty";

export const EQUAL = "equal";

export const GREATER = "greater";

export const HIDE = "hide";

export const LESS = "less";

export const NOT = "not";

// Constants
export const NOT_EQUAL = "notEqual";

export const OR = "or";

export const REMOVE = "remove";

export const REQUIRE = "require";

export const SHOW = "show";
