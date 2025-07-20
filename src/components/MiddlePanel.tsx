"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";

import { useAppSelector } from "../rtk/app/hooks";
import { DropZone } from "./DropArea";
import { FormInTheMiddle } from "./FormInTheMiddle";

export const handleKey = (e: React.KeyboardEvent, callback: () => void) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    callback();
  }
};

export const MiddlePanel = () => {
  const { formDefinition, activeStep } = useAppSelector((state) => state.editor);

  return (
    <div className="flex w-full flex-col overflow-y-auto" style={{ height: "calc(100vh - 88px)" }}>
      <div className="flex w-full">
        <div className="middle-panel-steps m-5 w-1/5">
          <Card className="gap-0 pt-4 pb-0">
            <CardHeader>
              <CardDescription>
                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold first:mt-0">Steps</h2>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-0">
              <div className="border-border dark:border-border/40 w-full border-b bg-[#5a287d] px-6 py-3 text-white">
                1 - Step-1
              </div>
              <div className="border-border dark:border-border/40 w-full border-b px-6 py-3">2 - Step-2</div>
              <div className="border-border dark:border-border/40 w-full border-b px-6 py-3">3 - Summary</div>
              <div className="border-border dark:border-border/40 w-full border-b px-6 py-3">4 - Thank You Page </div>
            </CardContent>
          </Card>
        </div>

        <div className="middle-panel-form m-5 ml-0 w-4/5">
          <Card>
            <div className="flex flex-col items-center gap-4 p-6">
              <DropZone />
            </div>
            <CardContent className="grid gap-6">
              <FormInTheMiddle
                dataSchema={formDefinition.stepDefinitions[activeStep].schema}
                uiSchema={formDefinition.stepDefinitions[activeStep].uiSchema}
              />
            </CardContent>
            <CardFooter className="w-full">
              <div className="mt-6 flex w-full items-center justify-between">
                {/* Left buttons */}
                <div className="flex gap-4">
                  <Button className="bg-green-600 text-white hover:bg-green-700">Save</Button>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">Submit</Button>
                </div>

                {/* Right button */}
                <Button>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
