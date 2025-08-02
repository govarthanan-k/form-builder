"use client";

import { PropsWithChildren } from "react";

import { useDroppable } from "@dnd-kit/core";
import { CirclePlus } from "lucide-react";
import { createPortal } from "react-dom";

export function DropZone({ children }: PropsWithChildren) {
  const { isOver, setNodeRef } = useDroppable({
    id: "drop-zone",
  });

  return (
    <>
      <div
        ref={setNodeRef}
        className={`relative w-full rounded-xl border-2 p-5 transition-colors ${
          isOver ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-dashed border-blue-500"
        }`}
      >
        {/* Apply blur when dragging over */}
        <div
          className={`flex min-h-[80px] flex-col items-center justify-center p-4 transition ${
            isOver ? "opacity-90 brightness-95" : ""
          }`}
        >
          {children ?? <p className="text-sm text-gray-500">Drop a component here</p>}
        </div>
      </div>

      {/* Overlay in center of screen */}
      {isOver &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 shadow-md dark:bg-black/80">
              <CirclePlus className="text-green-500" />
              <p className="text-sm text-gray-800 dark:text-gray-100">Release to drop</p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
