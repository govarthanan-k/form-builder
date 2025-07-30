"use client";

import { useEffect, useState } from "react";

import { useAppDispatch } from "@/store/app/hooks";
import { addField } from "@/store/features";
import { DndContext } from "@dnd-kit/core";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { FieldType, LeftPanel } from "@/components/LeftPanel";
import { MiddlePanel } from "@/components/MiddlePanel";
import { RightPanel } from "@/components/RightPanel";

export default function EFormDesigner() {
  const [isClient, setIsClient] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <DndContext
      onDragEnd={(event) => {
        const fieldType = event.active.id as FieldType;
        const isDrop = event.over?.id === "drop-zone";
        if (isDrop) {
          // addField
          dispatch(addField({ fieldType }));
        }
      }}
    >
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-88px)] w-full">
        <ResizablePanel defaultSize={15} minSize={10} maxSize={30} className="rounded-md border border-gray-400">
          <div className="flex h-full items-center justify-center">
            <LeftPanel />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50} minSize={30} maxSize={70} className="rounded-md border border-gray-400">
          <div className="flex h-full items-center justify-center">
            <MiddlePanel />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={20} minSize={10} maxSize={40} className="rounded-md border border-gray-400">
          <div className="flex h-full items-center justify-center">
            <RightPanel />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </DndContext>
  );
}
