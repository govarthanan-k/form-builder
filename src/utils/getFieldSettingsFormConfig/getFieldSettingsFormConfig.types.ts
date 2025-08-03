import { FormDefinition } from "@/store/features/editor/editor.types";

export interface GetFieldSettingsFormConfigArgs {
  formDefinition: FormDefinition;
  activeStep: number;
  selectedField: string | undefined;
}
