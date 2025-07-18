"use client";

import { useState } from "react";
import { DndContext, UniqueIdentifier } from "@dnd-kit/core";

import { LeftSideBar } from "@/components/LeftSideBar";
import { RightSideBar } from "@/components/RightSideBar";

import { MiddlePanel } from "../components/MiddlePanel";

export default function Dashboard() {
  const [droppedItems, setDroppedItems] = useState<
    { id: number; type: UniqueIdentifier }[]
  >([]);

  return (
    <DndContext
      onDragEnd={(event) => {
        const type = event.active.id;
        const isDrop = event.over?.id === "drop-zone";
        if (isDrop) {
          setDroppedItems((prev) => [...prev, { id: Date.now(), type }]);
        }
      }}
    >
      <div
        className="flex items-start"
        style={{ height: "calc(100vh - 88px)" }}
      >
        <div className="flex w-1/6 items-center justify-center rounded-md border border-gray-400">
          <LeftSideBar />
        </div>
        <div
          className="flex flex-1 items-center justify-center rounded-md border border-gray-400"
          style={{ height: "calc(100vh - 88px)" }}
        >
          <MiddlePanel />
        </div>
        <div className="flex w-2/8 items-center justify-center rounded-md border border-gray-400">
          <RightSideBar schema={droppedItems} />
        </div>
      </div>
    </DndContext>
  );
}
