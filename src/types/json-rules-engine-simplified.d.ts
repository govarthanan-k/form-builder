/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "json-rules-engine-simplified" {
  export interface Event {
    type: string;
    params?: Record<string, any>;
  }

  export interface Rule {
    conditions: any;
    event: Event;
    name?: string;
    priority?: number;
  }

  export default class RulesEngine {
    constructor();

    addRule(rule: Rule): void;

    run(facts: Record<string, any>): Promise<Event[]>;
  }
}
