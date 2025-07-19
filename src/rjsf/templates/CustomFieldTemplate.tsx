"use client";

import "@rjsf/core";

import { getDefaultRegistry } from "@rjsf/core";
import { FieldTemplateProps } from "@rjsf/utils";
import { Settings, Trash2 } from "lucide-react";

import { handleKey } from "../../components/MiddlePanel";

export const CustomFieldTemplate = (props: FieldTemplateProps) => {
  const FieldTemplate = getDefaultRegistry().templates.FieldTemplate;

  console.log("Props of FT => ", props);

  return (
    <div className="group relative grid gap-3 rounded-md border border-blue-500 p-4 px-4 pt-6 pb-4 transition-colors" id="field">
      <div className="text-muted-foreground dark:text-muted absolute top-1.5 right-1.5 flex gap-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {/* Delete icon */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Delete field"
          className="focus:ring-ring h-4 w-4 cursor-pointer rounded-sm outline-none focus:ring-2 focus:ring-offset-2"
          onClick={() => alert("Delete this field")}
          onKeyDown={(e) => handleKey(e, () => alert("Delete this field"))}
        >
          <Trash2 className="h-4 w-4" />
        </div>

        {/* Settings icon */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Open field settings"
          className="focus:ring-ring h-4 w-4 cursor-pointer rounded-sm outline-none focus:ring-2 focus:ring-offset-2"
          onClick={() => alert("Edit this field")}
          onKeyDown={(e) => handleKey(e, () => alert("Edit this field"))}
        >
          <Settings className="h-4 w-4" />
        </div>
      </div>

      <FieldTemplate {...props} />
    </div>
  );
};
