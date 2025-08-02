"use client";

import { AutoResizeMonaco } from "@/app/code-viewer/Comp";

import { StepPropertiesForm } from "../StepPropertiesForm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
