"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepPropertiesForm } from "@/components/StepPropertiesForm";

import { AutoResizeMonaco } from "@/app/code-viewer/Comp";

export const StepProperties = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Step Properties</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <StepPropertiesForm />
        </CardContent>

        <CardHeader>
          <CardTitle>Step Rules</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <AutoResizeMonaco value={JSON.stringify({}, null, 2)} autoWidth />
        </CardContent>
      </Card>
    </>
  );
};
