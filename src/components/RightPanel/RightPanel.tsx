"use client";

import { useAppDispatch, useAppSelector } from "@/store/app/hooks";
import { updateActiveTabInRightPanel } from "@/store/features";
import { RightPanelTab } from "@/store/features/editor/editor.types";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InspectPanel } from "@/components/InspectPanel";
import { JsonEditor } from "@/components/JsonEditor";

export const RightPanel = () => {
  const { activeStep, activeTabInRightPanel, devMode, formData, formDefinition } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  return (
    <div className="hide-scrollbar w-full overflow-y-auto" style={{ height: "calc(100vh - 77px)" }}>
      {devMode ? (
        <Tabs
          defaultValue="Inspect"
          className="w-full"
          value={activeTabInRightPanel}
          onValueChange={(value) => {
            dispatch(updateActiveTabInRightPanel({ activeTabInRightPanel: value as RightPanelTab }));
          }}
        >
          <div className="bg-background sticky top-0 z-10 border-b">
            {" "}
            <TabsList className="flex w-full">
              <TabsTrigger
                value="Inspect"
                className="flex-1 rounded-t-md border-b-2 border-transparent py-2 text-center transition-colors data-[state=active]:border-blue-700 data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
              >
                Inspect
              </TabsTrigger>

              <>
                <TabsTrigger
                  value="Data Schema"
                  className="flex-1 rounded-t-md border-b-2 border-transparent py-2 text-center transition-colors data-[state=active]:border-blue-700 data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
                >
                  Data Schema
                </TabsTrigger>
                <TabsTrigger
                  value="UI Schema"
                  className="flex-1 rounded-t-md border-b-2 border-transparent py-2 text-center transition-colors data-[state=active]:border-blue-700 data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
                >
                  UI Schema
                </TabsTrigger>
                <TabsTrigger
                  value="Form Data"
                  className="flex-1 rounded-t-md border-b-2 border-transparent py-2 text-center transition-colors data-[state=active]:border-blue-700 data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
                >
                  Form Data
                </TabsTrigger>
              </>
            </TabsList>
          </div>
          <TabsContent value="Inspect">
            <InspectPanel />
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
        </Tabs>
      ) : (
        <InspectPanel />
      )}
    </div>
  );
};
