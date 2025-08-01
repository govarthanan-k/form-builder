import React, { isValidElement } from "react";

import { ObjectFieldTemplateProps, UiSchema } from "@rjsf/utils";

export function GroupedObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  const { properties, uiSchema } = props;

  const groupOrder: string[] = uiSchema?.["ui:groupOrder"] || [];

  const grouped: Record<string, typeof properties> = {};
  const ungrouped: typeof properties = [];

  // Step 1: Split fields into groups and ungrouped
  properties.forEach((element) => {
    if (isValidElement(element.content)) {
      const props = element.content.props as { uiSchema?: UiSchema };
      const group = props.uiSchema?.["ui:group"];
      if (group) {
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(element);
      } else {
        ungrouped.push(element);
      }
    }
  });

  // Step 2: Helper to sort fields in a group by ui:order
  function sortGroupFields(fields: typeof properties, groupName?: string) {
    const order = groupName ? uiSchema?.[groupName]?.["ui:order"] : uiSchema?.["ui:order"];
    if (!order || !Array.isArray(order)) return fields;

    const orderMap = Object.fromEntries(order.map((key, idx) => [key, idx]));

    return [...fields].sort((a, b) => {
      const aIdx = orderMap[a.name] ?? Infinity;
      const bIdx = orderMap[b.name] ?? Infinity;

      return aIdx - bIdx;
    });
  }

  // Step 3: Render according to groupOrder with "*"
  const output: React.ReactNode[] = [];

  groupOrder.forEach((group, i) => {
    if (group === "*") {
      const sortedUngrouped = sortGroupFields(ungrouped);
      sortedUngrouped.forEach((field) =>
        output.push(
          <div key={`ungrouped-${field.name}`} className="mb-4">
            {field.content}
          </div>
        )
      );
    } else if (grouped[group]) {
      const sortedFields = sortGroupFields(grouped[group], group);
      output.push(
        <fieldset key={group} className="mb-6 rounded border p-4">
          <legend className="mb-2 text-lg font-semibold">{group}</legend>
          {sortedFields.map((field) => (
            <div key={field.name} className="mb-4">
              {field.content}
            </div>
          ))}
        </fieldset>
      );
    }
  });

  // Step 4: Render any remaining groups (not in groupOrder)
  const remainingGroups = Object.keys(grouped).filter((g) => !groupOrder.includes(g));
  remainingGroups.forEach((group) => {
    const sortedFields = sortGroupFields(grouped[group], group);
    output.push(
      <fieldset key={group} className="mb-6 rounded border p-4">
        <legend className="mb-2 text-lg font-semibold">{group}</legend>
        {sortedFields.map((field) => (
          <div key={field.name} className="mb-4">
            {field.content}
          </div>
        ))}
      </fieldset>
    );
  });

  return <div>{output}</div>;
}
