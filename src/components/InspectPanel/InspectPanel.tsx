import { useAppSelector } from "@/store/app/hooks";
import { FormDefinition } from "@/store/features/editor/editor.types";
import { getSchemaFromDotPath } from "@/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldPropertiesForm } from "@/components/FieldPropertiesForm";
import { FormProperties } from "@/components/FormProperties";
import { StepProperties } from "@/components/StepProperties";

const getFieldNameFromFieldId = ({
  activeStep,
  fieldID,
  formDefinition,
}: {
  fieldID: string;
  formDefinition: FormDefinition;
  activeStep: number;
}): string => {
  return (
    getSchemaFromDotPath({
      dotPath: fieldID,
      schema: formDefinition.stepDefinitions[activeStep].schema,
    })?.title ?? ""
  );
};

export const InspectPanel = () => {
  const { activeStep, formDefinition, inspectType, selectedField } = useAppSelector((state) => state.editor);

  return inspectType === "Field" ? (
    <Card>
      <CardHeader>
        <CardTitle>
          Field Properties of {getFieldNameFromFieldId({ fieldID: selectedField as string, formDefinition, activeStep })}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <FieldPropertiesForm />
      </CardContent>
    </Card>
  ) : inspectType === "Step" ? (
    <StepProperties />
  ) : (
    <FormProperties />
  );
};
