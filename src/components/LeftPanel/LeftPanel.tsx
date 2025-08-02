"use client";

import { useAppDispatch, useAppSelector } from "@/store/app/hooks";
import { updateAdGroups, updateTemplatePreviewOpen } from "@/store/features";
import { JSONSchema7 } from "json-schema";
import { ChevronDown, Eye, ShieldCheck, ShieldOff, SquareCheck, Type } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const { formDefinition, formTemplates } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  return (
    <div className="hide-scrollbar w-full overflow-y-auto" style={{ height: "calc(100vh - 77px)" }}>
      <Accordion type="single" collapsible className="w-full p-2" defaultValue="item-3">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-base font-semibold">1. Form Definition</AccordionTrigger>
          <AccordionContent className="bg-muted space-y-3 rounded-md p-4">
            <InfoField label="Form Type" value={formDefinition.formType} />
            <InfoField label="Status" value={formDefinition.status} />
            <InfoField
              label="Authentication Enabled?"
              value={
                <span className="flex items-center gap-1">
                  Yes
                  <ShieldCheck className="h-4 w-4" color="green" />
                </span>
              }
            />
            <InfoField
              label="MFA Enabled?"
              value={
                <span className="flex items-center gap-1">
                  No
                  <ShieldOff className="h-4 w-4" color="red" />
                </span>
              }
            />
            <InfoField label="LWB Enabled?" value={formDefinition.lwbEnabled ? "Yes" : "No"} />
            <InfoField label="Created by" value={formDefinition.createdBy} />
            <InfoField label="Created at" value={formDefinition.createdAt} />
            <InfoField label="Last modified by" value={formDefinition.lastModifiedBy} />
            <InfoField label="Last modified at" value={formDefinition.lastModifiedAt} />
            <InfoField label="Version" value={formDefinition.version} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-base font-semibold">2. Form Attributes</AccordionTrigger>
          <AccordionContent className="bg-muted space-y-3 rounded-md p-4">
            <InfoField label="Form Name" value={formDefinition.formName} />
            <InfoField label="Team" value={formDefinition.team} />
            <InfoField label="Owner Type" value="EFormsMockUser" />
            <InfoField label="Author" value="EFormsMockUser" />
            <InfoField label="Unique Form Reference" value={formDefinition.formId} />
            <InfoField label="Customer Reference Template" value={formDefinition.customerReferenceTemplate} />
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
            <TagInput
              noTagsMessage="No AD groups added yet"
              duplicateTagMessage="AD group already added"
              tags={formDefinition.adGroups}
              onChange={(adGroups) => {
                dispatch(updateAdGroups({ adGroups }));
              }}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger className="text-base font-semibold">5. Templates</AccordionTrigger>
          <AccordionContent className="bg-muted space-y-3 rounded-md p-4">
            <div className="h-[500px] overflow-hidden rounded-xl border">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-3 p-4 pr-6">
                  {formTemplates.map((form, idx) => (
                    <Card
                      key={idx}
                      className="group bg-background hover:bg-accent cursor-pointer rounded-xl p-4 shadow-sm transition hover:border-blue-500"
                      onClick={() => {
                        dispatch(updateTemplatePreviewOpen({ isOpen: true, templateId: form.name }));
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-foreground group-hover:text-primary text-base font-semibold">{form.name}</h3>
                          <p className="text-muted-foreground text-sm">
                            Modified: <span className="font-medium">{form.lastModified}</span>
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Author: <span className="font-medium">{form.author}</span>
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Version: <span className="font-medium">{form.version}</span>
                          </p>
                        </div>
                        <Eye className="text-muted-foreground group-hover:text-primary mt-1 h-4 w-4 shrink-0 cursor-pointer" />
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export const samplePreviewSchema: JSONSchema7 = {
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First name",
    },
    lastName: {
      type: "string",
      title: "Last name",
    },
    age: {
      type: "integer",
      title: "Age",
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 3,
    },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10,
    },
  },
};
