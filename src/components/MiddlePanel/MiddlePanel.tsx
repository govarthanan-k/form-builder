"use client";

import { useAppDispatch, useAppSelector } from "@/store/app/hooks";
import {
  reorderSteps,
  updateActiveStep,
  updateAddStepModalOpen,
  updateInspectType,
  updateTemplatePreviewOpen,
} from "@/store/features";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Form from "@rjsf/shadcn";
import validator from "@rjsf/validator-ajv8";
import { ChevronLeft, ChevronRight, Plus, SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AddNewStepModal } from "@/components/AddNewStepModal";
import { DropZone } from "@/components/DropZone";
import { FormCanvas } from "@/components/FormCanvas";
import { samplePreviewSchema } from "@/components/LeftPanel";
import { SortableStep } from "@/components/SortableStep";

export const MiddlePanel = () => {
  const { activeStep, formDefinition, isAddStepModalOpen, isTemplatePreviewOpen, selectedFormTemplateForPreview } =
    useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const items = formDefinition.stepDefinitions.map((s) => s.stepName);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      dispatch(reorderSteps({ oldIndex, newIndex }));
    }
  };

  return (
    <div className="hide-scrollbar flex w-full flex-col overflow-y-auto" style={{ height: "calc(100vh - 77px)" }}>
      <div className="flex w-full">
        {/* Steps */}
        <div className="middle-panel-steps m-5 mt-[3.625rem] w-1/5">
          <Card className="gap-0 pt-4 pb-0">
            <CardHeader className="border-border border-b !pb-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-row items-center gap-2">
                  <CardTitle className="text-3xl font-semibold">Steps</CardTitle>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <SquarePen
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => {
                      dispatch(updateInspectType({ inspectType: "Form" }));
                    }}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Plus className="h-4 w-4" onClick={() => dispatch(updateAddStepModalOpen({ isOpen: true }))} />
                      </TooltipTrigger>
                      <TooltipContent>Add Step</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col px-0">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                  {items.map((stepName, index) => {
                    const stepDefinition = formDefinition.stepDefinitions.find((s) => s.stepName === stepName)!;

                    return (
                      <SortableStep
                        key={stepName}
                        stepDefinition={stepDefinition}
                        index={index}
                        activeStep={activeStep}
                        onSelectStep={(stepIdx) => dispatch(updateActiveStep({ activeStep: stepIdx }))}
                        allowDelete={items.length > 1}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <div className="middle-panel-form m-5 ml-0 w-4/5">
          <DropZone>
            <Card className="w-full">
              <CardHeader className="border-border border-b !pb-2">
                <CardTitle className="text-3xl font-semibold">{formDefinition.stepDefinitions[activeStep].stepName}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <FormCanvas
                  dataSchema={formDefinition.stepDefinitions[activeStep].schema}
                  uiSchema={formDefinition.stepDefinitions[activeStep].uiSchema}
                />
              </CardContent>
              <CardFooter className="w-full">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activeStep !== 0 && (
                      <Button type="button" variant="secondary" className="gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button type="button" variant="secondary" className="gap-2">
                      Save
                    </Button>

                    {activeStep === formDefinition.stepDefinitions.length - 1 && (
                      <Button type="submit" variant="secondary" className="gap-2">
                        Submit
                      </Button>
                    )}
                    {activeStep !== formDefinition.stepDefinitions.length - 1 && (
                      <Button type="button" variant="secondary" className="gap-2">
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </DropZone>
        </div>
      </div>
      <Dialog open={isAddStepModalOpen} onOpenChange={(isOpen) => dispatch(updateAddStepModalOpen({ isOpen }))}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Step</DialogTitle>
            <DialogDescription>Please fill in the new step details and click &apos;Add&apos; to confirm.</DialogDescription>
          </DialogHeader>
          <AddNewStepModal />
        </DialogContent>
      </Dialog>
      <Dialog open={isTemplatePreviewOpen} onOpenChange={(isOpen) => dispatch(updateTemplatePreviewOpen({ isOpen }))}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Form Template Preview for {selectedFormTemplateForPreview}</DialogTitle>
          </DialogHeader>
          <Form schema={samplePreviewSchema} validator={validator} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
