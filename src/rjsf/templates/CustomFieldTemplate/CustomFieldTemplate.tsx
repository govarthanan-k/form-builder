"use client";

import "@rjsf/core";

import { useAppDispatch, useAppSelector } from "@/store/app/hooks";
import { deleteField, updateSelectedField } from "@/store/features";
import { handleKey } from "@/utils";
import { getDefaultRegistry } from "@rjsf/core";
import { FieldTemplateProps } from "@rjsf/utils";
import { Settings, Trash2 } from "lucide-react";

import { IconWithTooltip } from "@/components/IconWithTooltip";

import { cn } from "@/lib/utils";
import { ROOT_EFORM_ID_PREFIX } from "@/constants";

export const CustomFieldTemplate = (props: FieldTemplateProps) => {
  const FieldTemplate = getDefaultRegistry().templates.FieldTemplate;

  return <FieldTemplate {...props}>{props.uiSchema?.["ui:options"]?.hidden ? <></> : props.children}</FieldTemplate>;
};

export const EditorCustomFieldTemplate = (props: FieldTemplateProps) => {
  const FieldTemplate = getDefaultRegistry().templates.FieldTemplate;
  const { selectedField } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  const isFieldAnArrayItem = Number.isInteger(Number(props.id.split(".")?.pop()));

  return props.id !== ROOT_EFORM_ID_PREFIX && !isFieldAnArrayItem ? (
    <div
      className={cn(
        "bg-background group border-muted relative rounded-md border px-4 py-6",
        selectedField &&
          `${ROOT_EFORM_ID_PREFIX}.${selectedField}` === props.id &&
          "border-blue-500 ring-1 ring-blue-500/30 transition hover:ring-blue-500/60"
      )}
    >
      <div className="text-muted-foreground dark:text-muted absolute top-2.5 right-2.5 flex gap-x-2">
        {/* Delete icon */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Delete field"
          className="focus:ring-ring h-4 w-4 cursor-pointer rounded-sm outline-none focus:ring-2 focus:ring-offset-2"
          onClick={() => {
            dispatch(deleteField({ fieldId: props.id }));
          }}
          onKeyDown={(e) => handleKey(e, () => alert("Delete this field"))}
        >
          <IconWithTooltip icon={<Trash2 className="h-4 w-4" color="red" />} text="Delete Field" />
        </div>
        {/* Settings icon */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Open field settings"
          className="focus:ring-ring h-4 w-4 cursor-pointer rounded-sm outline-none focus:ring-2 focus:ring-offset-2"
          onClick={() => {
            dispatch(updateSelectedField({ selectedField: props.id }));
          }}
          onKeyDown={(e) =>
            handleKey(e, () => {
              dispatch(updateSelectedField({ selectedField: props.id }));
            })
          }
        >
          <IconWithTooltip icon={<Settings className="h-4 w-4" color="blue" />} text="Edit Field" />
        </div>
      </div>
      <FieldTemplate {...props}>{props.uiSchema?.["ui:options"]?.hidden ? <></> : props.children}</FieldTemplate>
    </div>
  ) : (
    <FieldTemplate {...props}>{props.uiSchema?.["ui:options"]?.hidden ? <></> : props.children}</FieldTemplate>
  );
};
