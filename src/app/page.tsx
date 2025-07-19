"use client";

import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

import { LeftSideBar } from "@/components/LeftSideBar";
import { RightSideBar } from "@/components/RightSideBar";

import { MiddlePanel } from "../components/MiddlePanel";
import { descriptors } from "../rjsf/descriptors";

export interface FormSchema {
  dataSchema: JSONSchema7;
  uiSchema: UiSchema;
}

export default function Dashboard() {
  const [droppedItems, setDroppedItems] = useState<FormSchema>({
    dataSchema: {
      type: "object",
      required: [],
      properties: {},
    },
    uiSchema: {},
  });

  return (
    <DndContext
      onDragEnd={(event) => {
        const fieldType = event.active.id as string;
        const isDrop = event.over?.id === "drop-zone";
        if (isDrop) {
          setDroppedItems((prev) => {
            const { dataSchema, uiSchema } = descriptors[fieldType];
            const newFieldName = `${fieldType}${Object.keys(prev.dataSchema.properties || {}).length + 1}`;
            return {
              dataSchema: { ...prev.dataSchema, properties: { ...prev.dataSchema.properties, [newFieldName]: dataSchema } },
              uiSchema: { ...prev.uiSchema, [newFieldName]: uiSchema },
            };
          });
        }
      }}
    >
      <div className="flex items-start" style={{ height: "calc(100vh - 88px)" }}>
        <div className="flex w-1/6 items-center justify-center rounded-md border border-gray-400">
          <LeftSideBar />
        </div>
        <div
          className="flex flex-1 items-center justify-center rounded-md border border-gray-400"
          style={{ height: "calc(100vh - 88px)" }}
        >
          <MiddlePanel schema={droppedItems} />
        </div>
        <div className="flex w-2/8 items-center justify-center rounded-md border border-gray-400">
          <RightSideBar schema={droppedItems} />
        </div>
      </div>
    </DndContext>
  );
}
