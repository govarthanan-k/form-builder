/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "json-rules-engine-simplified" {
  export type Condition = LogicalCondition | SimpleCondition;

  export interface Event {
    type: EventType;
    params: {
      field: string[];
    };
  }
  export interface LogicalCondition {
    or?: Condition[];
    and?: Condition[];
    not?: Condition;
  }

  export type OperatorValue = string | number | { [operator: string]: string | number };

  export interface Rule {
    conditions: Condition;
    event: Event;
  }

  export interface SimpleCondition {
    [fieldID: string]: OperatorValue;
  }

  export default class RulesEngine {
    constructor();

    addRule(rule: Rule): void;

    run(facts: Record<string, any>): Promise<Event[]>;
  }
}
