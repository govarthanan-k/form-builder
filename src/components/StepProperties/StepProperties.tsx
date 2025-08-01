"use client";

import { JsonEditor } from "@/components/JsonEditor";

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
          <JsonEditor height="500px" value={{}} />
        </CardContent>
      </Card>
    </>
  );
};
