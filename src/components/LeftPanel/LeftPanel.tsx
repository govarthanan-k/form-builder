"use client";

import { ChevronDown, ShieldCheck, ShieldOff, SquareCheck, Type } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DraggableItem } from "@/components/DraggableItem";
import { InfoField } from "@/components/InfoField";
import { TagInput } from "@/components/TagInput";

export const AVAILABLE_COMPONENTS = [
  { id: "input", name: "Input", icon: <Type className="h-6 w-6" /> },
  { id: "textarea", name: "Textarea", icon: <Type className="h-6 w-6" /> },
  { id: "checkbox", name: "Checkbox", icon: <SquareCheck className="h-6 w-6" /> },
  { id: "dropdown", name: "Dropdown", icon: <ChevronDown className="h-6 w-6" /> },
];

export const LeftPanel = () => {
  return (
    <div className="w-full overflow-y-auto" style={{ height: "calc(100vh - 88px)" }}>
      <Accordion type="single" collapsible className="w-full p-2" defaultValue="item-3">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-base font-semibold">1. Form Definition</AccordionTrigger>
          <AccordionContent className="bg-muted space-y-3 rounded-md p-4">
            <InfoField label="Form Type" value="Stepped Navigation" />
            <InfoField label="Status" value="Draft" />
            <InfoField
              label="Authenticated"
              value={
                <span className="flex items-center gap-1">
                  No
                  <ShieldOff className="h-4 w-4" color="red" />
                </span>
              }
            />
            <InfoField
              label="Authenticated"
              value={
                <span className="flex items-center gap-1">
                  Yes
                  <ShieldCheck className="h-4 w-4" color="green" />
                </span>
              }
            />
            <InfoField label="MFA" value="No" />
            <InfoField label="Created by" value="Govarthanan K" />
            <InfoField label="Created at" value="2024-01-01 12:00:00" />
            <InfoField label="Last modified by" value="John Doe" />
            <InfoField label="Last modified at" value="2025-01-01 12:00:00" />
            <InfoField label="Version" value="254" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-base font-semibold">2. Form Attributes</AccordionTrigger>
          <AccordionContent className="bg-muted space-y-3 rounded-md p-4">
            <InfoField label="Form Name" value="TEST_FORM" />
            <InfoField label="Team" value="EE Application" />
            <InfoField label="Owner Type" value="EFormsMockUser" />
            <InfoField label="Author" value="EFormsMockUser" />
            <InfoField label="Unique Form Reference" value="TEST_FORM" />
            <InfoField label="Customer Reference Template" value="${RANDOM.UUID}}" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-base font-semibold">3. Add Form Components</AccordionTrigger>
          <AccordionContent className="bg-muted space-y-3 rounded-md p-4">
            <div className="flex flex-wrap justify-start gap-5">
              {AVAILABLE_COMPONENTS.map((el) => (
                <DraggableItem key={el.id} id={el.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex h-[50px] w-[50px] cursor-grab items-center justify-center rounded-md border-2 border-gray-400 hover:border-blue-500 hover:text-blue-500 focus:border-blue-500 focus:text-blue-500 focus:outline-none active:cursor-grabbing">
                        {el.icon}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{el.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </DraggableItem>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-base font-semibold">4. Access Permissions</AccordionTrigger>
          <AccordionContent className="bg-muted space-y-3 rounded-md p-4">
            <TagInput noTagsMessage="No AD groups added yet" tags={[]} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
