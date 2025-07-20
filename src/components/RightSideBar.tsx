"use client";

import { JSONSchema7 } from "json-schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAppDispatch, useAppSelector } from "../rtk/app/hooks";
import { updateActiveTabInRightPanel } from "../rtk/features";
import { FormDefinition, RightPanelTab } from "../rtk/features/editor/editor.types";
import { FieldPropertiesForm } from "./FieldPropertiesForm";
import { JsonEditor } from "./JsonEditor";
import { StepProperties } from "./StepProperties";

const getFieldNameFromFieldId = ({
  fieldName,
  formDefinition,
  activeStep,
}: {
  fieldName: string;
  formDefinition: FormDefinition;
  activeStep: number;
}): string => {
  return (formDefinition.stepDefinitions[activeStep].schema.properties?.[fieldName] as JSONSchema7).title ?? "";
};

export const RightSideBar = () => {
  const { selectedField, devMode, activeTabInRightPanel, formDefinition, activeStep, formData } = useAppSelector(
    (state) => state.editor
  );
  const dispatch = useAppDispatch();

  return (
    <div className="w-full overflow-y-auto" style={{ height: "calc(100vh - 88px)" }}>
      <Tabs
        defaultValue="Inspect"
        className="w-full"
        value={activeTabInRightPanel}
        onValueChange={(value) => {
          dispatch(updateActiveTabInRightPanel({ activeTabInRightPanel: value as RightPanelTab }));
        }}
      >
        <TabsList className="flex w-full">
          <TabsTrigger
            value="Inspect"
            className="flex-1 border-b-2 border-transparent text-center data-[state=active]:border-blue-500"
          >
            Inspect
          </TabsTrigger>

          {devMode && (
            <>
              <TabsTrigger
                value="Data Schema"
                className="flex-1 border-b-2 border-transparent text-center data-[state=active]:border-blue-500"
              >
                Data Schema
              </TabsTrigger>
              <TabsTrigger
                value="UI Schema"
                className="flex-1 border-b-2 border-transparent text-center data-[state=active]:border-blue-500"
              >
                UI Schema
              </TabsTrigger>
              <TabsTrigger
                value="Form Data"
                className="flex-1 border-b-2 border-transparent text-center data-[state=active]:border-blue-500"
              >
                Form Data
              </TabsTrigger>
            </>
          )}
          <TabsTrigger
            value="Rules"
            className="flex-1 border-b-2 border-transparent text-center data-[state=active]:border-blue-500"
          >
            Rules
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Inspect">
          {selectedField ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  Field Properties of {getFieldNameFromFieldId({ fieldName: selectedField, formDefinition, activeStep })}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <FieldPropertiesForm />
              </CardContent>
            </Card>
          ) : (
            <StepProperties />
          )}
        </TabsContent>
        <TabsContent value="Data Schema">
          <Card>
            <CardContent className="grid gap-6">
              <JsonEditor value={formDefinition.stepDefinitions[activeStep].schema} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="UI Schema">
          <Card>
            <CardContent className="grid gap-6">
              <JsonEditor value={formDefinition.stepDefinitions[activeStep].uiSchema} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Form Data">
          <Card>
            <CardContent className="grid gap-6">
              <JsonEditor value={formData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Rules">
          <Card>
            <CardContent className="grid gap-6">
              <h2 className="text-primary text-lg font-semibold">Step Rules</h2>
              <JsonEditor height="35vh" />
              <h2 className="text-primary text-lg font-semibold">Form Rules</h2>
              <JsonEditor height="35vh" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
