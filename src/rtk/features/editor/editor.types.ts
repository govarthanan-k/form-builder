import { IChangeEvent } from "@rjsf/core";
import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export type RightPanelTab = "Inspect" | "Data Schema" | "UI Schema" | "Form Data" | "Rules";

export interface StepDefinition {
  schema: JSONSchema7;
  uiSchema: UiSchema;
}

export type FormData = Pick<IChangeEvent, "formData">;

export interface FormDefinition {
  stepDefinitions: StepDefinition[];
}

export interface EditorState {
  selectedField?: string;
  devMode?: boolean;
  autoSave?: boolean;
  activeTabInRightPanel?: RightPanelTab;
  activeStep: number;
  formDefinition: FormDefinition;
  formData: FormData;
}
