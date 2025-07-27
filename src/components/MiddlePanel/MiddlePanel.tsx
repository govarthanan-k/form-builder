"use client";

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store/app/hooks";
import { updateActiveStep, updateAddStepModalOpen } from "@/store/features";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ArrowRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AddNewStepModal } from "@/components/AddNewStepModal";
import { DropZone } from "@/components/DropZone";
import { FormCanvas } from "@/components/FormCanvas";
import { SortableStep } from "@/components/SortableStep";

export const MiddlePanel = () => {
  const { activeStep, formDefinition, isAddStepModalOpen } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const [items, setItems] = useState(formDefinition.stepDefinitions.map((s) => s.stepName));
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      // Todo: , Use formDef directly, update store with reordered list
      // dispatch(reorderSteps(newItems));
    }
  };

  useEffect(() => {
    setItems(formDefinition.stepDefinitions.map((s) => s.stepName));
  }, [formDefinition]);

  return (
    <div className="flex w-full flex-col overflow-y-auto" style={{ height: "calc(100vh - 88px)" }}>
      <div className="flex w-full">
        <div className="middle-panel-steps m-5 w-1/5">
          <Card className="gap-0 pt-4 pb-0">
            <CardHeader className="border-border border-b !pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-semibold">Steps</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => dispatch(updateAddStepModalOpen({ isOpen: true }))}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add Step</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Dialog open={isAddStepModalOpen} onOpenChange={(isOpen) => dispatch(updateAddStepModalOpen({ isOpen }))}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Step</DialogTitle>
                    <DialogDescription>
                      Please fill in the new step details and click &apos;Add&apos; to confirm.
                    </DialogDescription>
                  </DialogHeader>
                  <AddNewStepModal />
                </DialogContent>
              </Dialog>
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
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        </div>

        <div className="middle-panel-form m-5 ml-0 w-4/5">
          <Card>
            <div className="flex flex-col items-center gap-4 p-6">
              <DropZone />
            </div>
            <CardContent className="grid gap-6">
              <FormCanvas
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
