"use client";

import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

import { FieldType, LeftSideBar } from "@/components/LeftSideBar";
import { RightSideBar } from "@/components/RightSideBar";

import { MiddlePanel } from "../components/MiddlePanel";
import { useAppDispatch } from "../rtk/app/hooks";
import { addField } from "../rtk/features";

export interface FormSchema {
  dataSchema: JSONSchema7;
  uiSchema: UiSchema;
}

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
          <LeftSideBar />
        </div>
        <div
          className="flex flex-1 items-center justify-center rounded-md border border-gray-400"
          style={{ height: "calc(100vh - 88px)" }}
        >
          <MiddlePanel />
        </div>
        <div className="flex w-2/8 items-center justify-center rounded-md border border-gray-400">
          <RightSideBar />
        </div>
      </div>
    </DndContext>
  );
}
