"use client";

import { useEffect, useState } from "react";

import { useAppDispatch } from "@/rtk/app/hooks";
import { addField } from "@/rtk/features";
import { DndContext } from "@dnd-kit/core";

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
      <div className="flex items-start" style={{ height: "calc(100vh - 88px)" }}>
        <div className="flex w-1/6 items-center justify-center rounded-md border border-gray-400">
          <LeftPanel />
        </div>
        <div
          className="flex flex-1 items-center justify-center rounded-md border border-gray-400"
          style={{ height: "calc(100vh - 88px)" }}
        >
          <MiddlePanel />
        </div>
        <div className="flex w-2/8 items-center justify-center rounded-md border border-gray-400">
          <RightPanel />
        </div>
      </div>
    </DndContext>
  );
}
