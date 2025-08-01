"use client";

import { useAppSelector } from "@/store/app/hooks";

import { getAllPropertyPaths } from "../RightPanel";
import { RulesBuilder } from "../RulesBuilderPlugin";

export const FormProperties = () => {
  const { activeStep, formDefinition } = useAppSelector((state) => state.editor);

  return (
    <>
      <h3 className="p-6 pb-0 leading-none font-semibold">Form Rules</h3>
      <RulesBuilder fieldList={getAllPropertyPaths(formDefinition.stepDefinitions[activeStep].schema)} />
    </>
  );
};
