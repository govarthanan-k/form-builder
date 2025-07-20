"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { JsonEditor } from "./JsonEditor";

export const StepProperties = () => {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="pl-2 text-base font-semibold">Step Properties</h3>
      <div className="bg-muted mx-2 space-y-3 rounded-md p-4">
        <div className="grid gap-2">
          <Label htmlFor="stepProperties_stepName">Step Name</Label>
          <Input id="stepProperties_stepName" defaultValue="Step-1" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stepProperties_stepType">Step Type</Label>
          <Select defaultValue="Step" disabled>
            <SelectTrigger id="stepProperties_stepType" className="w-full">
              <SelectValue placeholder="Select step type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Step">Step</SelectItem>
              <SelectItem value="Summary">Summary</SelectItem>
              <SelectItem value="ThankYou">ThankYou</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <h3 className="pl-2 text-base font-semibold">Step Rules</h3>
      <div className="bg-muted mx-2 space-y-3 rounded-md p-4">
        <JsonEditor height="500px" />
      </div>
    </div>
  );
};
