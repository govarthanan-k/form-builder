import { Rule } from "@/rjsf/descriptors/descriptors.types";
import { IChangeEvent } from "@rjsf/core";
import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export interface EditorState {
  selectedField?: string;
  devMode: boolean;
  autoSave: boolean;
  activeTabInRightPanel: RightPanelTab;
  activeStep: number;
  formDefinition: FormDefinition;
  formData: FormData;
  selectedFieldPropertiesFormData: FormData;
  inspectFieldSchemas?: {
    schema: JSONSchema7;
    uiSchema: UiSchema;
    rules?: Rule[];
  };
  isAddStepModalOpen: boolean;
}

export type FormData = Pick<IChangeEvent, "formData">;

export interface FormDefinition {
  stepDefinitions: StepDefinition[];
}

export type RightPanelTab = "Inspect" | "Data Schema" | "UI Schema" | "Form Data" | "Rules";

export interface StepDefinition {
  stepName: string;
  schema: JSONSchema7;
  uiSchema: UiSchema;
  isThankYouPage?: boolean;
  isSummaryPage?: boolean;
}
