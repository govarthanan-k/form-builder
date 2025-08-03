import { descriptors } from "@/rjsf/descriptors";
import { UiSchema } from "@rjsf/utils";
import { Rule } from "json-rules-engine-simplified";
import { JSONSchema7 } from "json-schema";

import { FieldType } from "@/components/LeftPanel";

import { getUiSchemaFromDotPath } from "../schemaUtils";
import { GetFieldSettingsFormConfigArgs } from "./getFieldSettingsFormConfig.types";

export const getFieldSettingsFormConfig = ({
  activeStep,
  formDefinition,
  selectedField,
}: GetFieldSettingsFormConfigArgs): { schema: JSONSchema7; uiSchema: UiSchema; rules?: Rule[] } => {
  if (selectedField) {
    const stepDefinition = formDefinition.stepDefinitions[activeStep];
    const fieldUiSchema = getUiSchemaFromDotPath({
      dotPath: selectedField,
      uiSchema: stepDefinition.uiSchema,
    });
    const fieldType = fieldUiSchema?.["ui:options"]?.fieldType as FieldType | undefined;
    if (!fieldType) {
      throw new Error(`fieldType is missing for ${selectedField}`);
    }
    const { dataSchema: schema, rules, uiSchema } = descriptors[fieldType].propertiesConfiguration;

    return { schema, uiSchema, rules };
  }

  return {
    schema: { type: "object", required: [], properties: {} },
    uiSchema: {},
    rules: [],
  };
};
