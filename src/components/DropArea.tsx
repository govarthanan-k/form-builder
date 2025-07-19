"use client";

import { useDroppable } from "@dnd-kit/core";
import { CirclePlus } from "lucide-react";

export function DropZone() {
  const { setNodeRef, isOver } = useDroppable({
    id: "drop-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative flex h-20 w-full items-center justify-center rounded-xl border-2 transition-colors ${
        isOver ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-dashed border-blue-500"
      }`}
    >
      {isOver ? (
        <div className="flex flex-row gap-5">
          <CirclePlus className="text-green-500" />
          <p className="mb-2 text-sm text-gray-500">Release to drop</p>
        </div>
      ) : (
        <p className="mb-2 text-sm text-gray-500">Drop a component here</p>
      )}
    </div>
  );
}
