"use client";

import "@rjsf/core";

import { useAppDispatch, useAppSelector } from "@/rtk/app/hooks";
import { deleteField, updateSelectedField } from "@/rtk/features";
import { handleKey } from "@/utils";
import { getDefaultRegistry } from "@rjsf/core";
import { FieldTemplateProps } from "@rjsf/utils";
import { Settings, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { ROOT_EFORM_ID_PREFIX } from "@/constants";

export const CustomFieldTemplate = (props: FieldTemplateProps) => {
  const FieldTemplate = getDefaultRegistry().templates.FieldTemplate;

  const { selectedField } = useAppSelector((state) => state.editor);

  const dispatch = useAppDispatch();

  return props.id !== ROOT_EFORM_ID_PREFIX ? (
    <div
      className={cn(
        "group relative box-border grid gap-3 border p-4 px-4 pt-6 pb-4 transition-colors",
        selectedField && `${ROOT_EFORM_ID_PREFIX}.${selectedField}` === props.id
          ? "rounded-md border border-blue-500"
          : "border-transparent"
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
          <Trash2 className="h-4 w-4" color="red" />
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
          <Settings className="h-4 w-4" color="blue" />
        </div>
      </div>

      <FieldTemplate {...props}>{props.uiSchema?.["ui:options"]?.hidden ? <></> : props.children}</FieldTemplate>
    </div>
  ) : (
    <FieldTemplate {...props}>{props.uiSchema?.["ui:options"]?.hidden ? <></> : props.children}</FieldTemplate>
  );
};
