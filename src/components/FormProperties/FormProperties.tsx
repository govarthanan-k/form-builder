"use client";

import { useAppSelector } from "@/store/app/hooks";
import { getAllPropertyPathsInSchema } from "@/utils";

import { RulesBuilder } from "@/components/RulesBuilderPlugin";

export const FormProperties = () => {
  const { activeStep, formDefinition } = useAppSelector((state) => state.editor);

  return (
    <>
      <h3 className="p-6 pb-0 leading-none font-semibold">Form Rules</h3>
      <RulesBuilder fieldList={getAllPropertyPathsInSchema(formDefinition.stepDefinitions[activeStep].schema)} />
    </>
  );
};
