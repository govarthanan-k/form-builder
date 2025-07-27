import { FormDefinition } from "@/rtk/features/editor/editor.types";

export interface GetPropertiesSchemaArgs {
  formDefinition: FormDefinition;
  activeStep: number;
  selectedField: string | undefined;
}
