import { Type } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { DraggableItem } from "./Droppable";
import { TagInput } from "./TagInput";

// 84.516
export const LeftSideBar = () => {
  return (
    <div
      className="w-full overflow-y-auto"
      style={{ height: "calc(100vh - 88px)" }}
    >
      <Accordion
        type="single"
        collapsible
        className="w-full p-2"
        defaultValue="item-3"
      >
        {/* Accordion items here */}

        <AccordionItem value="item-1">
          <AccordionTrigger className="text-base font-semibold">
            1. Form Definition
          </AccordionTrigger>
          <AccordionContent className="bg-muted space-y-3 rounded-md p-4">
            <Field label="Form Type" value="Stepped Navigation" />
            <Field label="Status" value="Draft" />
            <Field label="Authenticated" value="No" />
            <Field label="MFA" value="No" />
            <Field label="Last modified by" value="John Doe" />
            <Field label="Last modified at" value="2025-01-01 12:00:00" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-base font-semibold">
            2. Form Attributes
          </AccordionTrigger>
          <AccordionContent className="bg-muted space-y-3 rounded-md p-4">
            <Field label="Form Name" value="TEST_FORM" />
            <Field label="Team" value="EE Application" />
            <Field label="Owner Type" value="EFormsMockUser" />
            <Field label="Author" value="EFormsMockUser" />
            <Field label="Unique Form Reference" value="TEST_FORM" />
            <Field
              label="Customer Reference Template"
              value="${RANDOM.UUID}}"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-base font-semibold">
            3. Add Form Components
          </AccordionTrigger>
          <AccordionContent className="bg-muted space-y-3 rounded-md p-4">
            <div className="flex flex-wrap justify-start gap-5">
              {Array.from({ length: 25 }).map((_, i) => (
                <DraggableItem key={i} id={i}>
                  <button className="flex h-[50px] w-[50px] cursor-grab items-center justify-center rounded-md border-2 border-gray-400 hover:border-blue-500 hover:text-blue-500 focus:border-blue-500 focus:text-blue-500 focus:outline-none active:cursor-grabbing">
                    <Type className="h-6 w-6" />
                  </button>
                </DraggableItem>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-base font-semibold">
            4. Access Permissions
          </AccordionTrigger>
          <AccordionContent className="bg-muted space-y-3 rounded-md p-4">
            <TagInput />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-muted-foreground text-sm">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);
