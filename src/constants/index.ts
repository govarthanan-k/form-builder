import { RightPanelTab } from "@/store/features/editor/editor.types";

export const PROPERTIES_ROOT_EFORM_ID_PREFIX = "eform_properties_root";

export const ROOT_ADD_STEP_FORM_ID_PREFIX = "add_step_root";

export const ROOT_EFORM_ID_PREFIX = "eform_root";

// eslint-disable-next-line sort-exports/sort-exports
export const FORM_ID_PREFIXES = [PROPERTIES_ROOT_EFORM_ID_PREFIX, ROOT_ADD_STEP_FORM_ID_PREFIX, ROOT_EFORM_ID_PREFIX];

export const RightPanelTabs: Record<RightPanelTab, RightPanelTab> = {
  Inspect: "Inspect",
  "Data Schema": "Data Schema",
  "UI Schema": "UI Schema",
  "Form Data": "Form Data",
  Rules: "Rules",
} as const;
