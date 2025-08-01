import React, { useState } from "react";

import { ChevronRight, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ConditionEditor } from "./ConditionEditor";
import { eventIcons, eventTypes } from "./constants";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { Condition, EventType, Rule, RuleItemProps } from "./types";
import { generateConditionSummary } from "./utils";

const generateRuleSummary = (rule: Rule) => {
  const conditionSummary = generateConditionSummary(rule.conditions);
  const eventType = rule.event?.type || "unknown";
  const targetFields = rule.event?.params?.fields || [];
  const EventIcon = eventIcons[eventType as EventType];

  return {
    condition: conditionSummary,
    event: eventType,
    eventIcon: EventIcon,
    targetFields: targetFields.slice(0, 2), // Show max 2 fields
    moreFields: targetFields.length > 2 ? targetFields.length - 2 : 0,
  };
};

// RuleItem component
export const RuleItem: React.FC<RuleItemProps> = ({ fieldIcons, fieldList, onChange, onDelete, rule, ruleIndex }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateCondition = (cond: Condition) => {
    if (cond) onChange({ ...rule, conditions: cond });
  };

  const updateEventFields = (fields: string[]) => {
    onChange({ ...rule, event: { ...rule.event, params: { fields } } });
  };

  const updateEventType = (type: EventType) => {
    onChange({ ...rule, event: { ...rule.event, type } });
  };

  // Generate rule summary for collapsed view

  const summary = generateRuleSummary(rule);

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
            Delete Rule
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
};
