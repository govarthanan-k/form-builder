"use client";

import { useAppDispatch, useAppSelector } from "@/store/app/hooks";
import { updateActiveTabInRightPanel } from "@/store/features";
import { FormDefinition, RightPanelTab } from "@/store/features/editor/editor.types";
import { getSchemaFromDotPath } from "@/utils";
import { JSONSchema7 } from "json-schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldPropertiesForm } from "@/components/FieldPropertiesForm";
import { JsonEditor } from "@/components/JsonEditor";
import { StepProperties } from "@/components/StepProperties";

import { FormProperties } from "../FormProperties";

export const RightPanel = () => {
  const { activeStep, activeTabInRightPanel, devMode, formData, formDefinition, inspectType, selectedField } = useAppSelector(
    (state) => state.editor
  );
  const dispatch = useAppDispatch();

  return (
    <div className="hide-scrollbar w-full overflow-y-auto" style={{ height: "calc(100vh - 88px)" }}>
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
          {/* <TabsTrigger
            value="Rules"
            className="flex-1 border-b-2 border-transparent text-center data-[state=active]:border-blue-500"
          >
            Rules
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="Inspect">
          {inspectType === "Field" ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  Field Properties of {getFieldIDFromFieldId({ fieldID: selectedField as string, formDefinition, activeStep })}
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
        {/* <TabsContent value="Rules"> */}
        {/* <RuleBuilderApp fieldList={getAllPropertyPaths(formDefinition.stepDefinitions[activeStep].schema)} /> */}
        {/* <Card>
            <CardContent className="grid gap-6">
              <h2 className="text-primary text-lg font-semibold">Step Rules</h2>
              <JsonEditor height="35vh" value={{}} />
              <h2 className="text-primary text-lg font-semibold">Form Rules</h2>
              <JsonEditor height="35vh" value={{}} />
            </CardContent>
          </Card> */}
        {/* </TabsContent> */}
      </Tabs>
    </div>
  );
};

const getFieldIDFromFieldId = ({
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

export function getAllPropertyPaths(schema: JSONSchema7, basePath = ""): string[] {
  const paths = [];

  if (schema.type === "object" && schema.properties) {
    for (const key of Object.keys(schema.properties)) {
      const newPath = basePath ? `${basePath}.${key}` : key;
      paths.push(newPath);
      paths.push(...getAllPropertyPaths(schema.properties[key] as JSONSchema7, newPath));
    }
  }

  if (schema.type === "array") {
    const itemSchema = schema.items;

    if (Array.isArray(itemSchema)) {
      // Tuple validation (fixed items)
      for (let i = 0; i < itemSchema.length; i++) {
        const newPath = basePath;
        paths.push(...getAllPropertyPaths(itemSchema[i] as JSONSchema7, newPath));
      }
    } else if (itemSchema && typeof itemSchema === "object") {
      // Single schema for additional items
      paths.push(...getAllPropertyPaths(itemSchema, basePath));
    }
  }

  for (const keyword of ["allOf", "anyOf", "oneOf"]) {
    // @ts-expect-error Todo
    if (Array.isArray(schema[keyword])) {
      // @ts-expect-error Todo
      for (const sub of schema[keyword]) {
        paths.push(...getAllPropertyPaths(sub, basePath));
      }
    }
  }

  return paths;
}
