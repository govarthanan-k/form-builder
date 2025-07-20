"use client";

import { ArrowRight, Plus, SquarePen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

import { cn } from "../lib/utils";
import { useAppDispatch, useAppSelector } from "../rtk/app/hooks";
import { updateActiveStep, updateAddStepModalOpen } from "../rtk/features";
import { AddStepForm } from "./AddStepForm";
import { DropZone } from "./DropArea";
import { FormInTheMiddle } from "./FormInTheMiddle";
import { DialogHeader } from "./ui/dialog";

export const handleKey = (e: React.KeyboardEvent, callback: () => void) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    callback();
  }
};

export const MiddlePanel = () => {
  const { formDefinition, activeStep, isAddStepModalOpen } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  return (
    <div className="flex w-full flex-col overflow-y-auto" style={{ height: "calc(100vh - 88px)" }}>
      <div className="flex w-full">
        <div className="middle-panel-steps m-5 w-1/5">
          <Card className="gap-0 pt-4 pb-0">
            <CardHeader>
              <CardDescription>
                <div className="flex justify-between gap-2">
                  <h2 className="scroll-m-20 pb-2 text-3xl font-semibold first:mt-0">Steps</h2>
                  <div className="flex cursor-pointer items-center justify-center">
                    <Plus
                      className="h-4 w-4"
                      onClick={() => {
                        dispatch(updateAddStepModalOpen({ isOpen: true }));
                      }}
                    />

                    <Dialog open={isAddStepModalOpen} onOpenChange={(isOpen) => dispatch(updateAddStepModalOpen({ isOpen }))}>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Add New Step</DialogTitle>
                          <DialogDescription>
                            Please fill in the new step details and click &apos;Add&apos; to confirm.
                          </DialogDescription>
                        </DialogHeader>
                        <AddStepForm />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col px-0">
              {formDefinition.stepDefinitions.map((stepDefinition, index) => {
                return (
                  <div
                    key={`${index}-${stepDefinition.stepName}`}
                    className={cn(
                      "border-border dark:border-border/40 w-full rounded-md border-b px-6 py-3",
                      activeStep === index ? "bg-[#5a287d] text-white" : ""
                    )}
                  >
                    <div className="flex justify-between gap-2">
                      <div>
                        {index + 1} - {stepDefinition.stepName}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <SquarePen
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => {
                            dispatch(updateActiveStep({ activeStep: index }));
                          }}
                        />
                        {/* Todo - Add a confirmation dialog after click on delete step icon */}
                        <Trash2 className="h-4 w-4" color="red" />
                      </div>
                    </div>
                  </div>
                );
              })}
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
