"use client";

import { RotateCcw, Settings, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DropZone } from "./DropArea";

export const MiddlePanel = () => {
  const handleKey = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div
      className="flex w-full overflow-y-auto"
      style={{ height: "calc(100vh - 88px)" }}
    >
      <div className="middle-panel-steps m-5 w-1/5">
        <Card className="pb-0">
          <CardHeader>
            <CardTitle>Steps</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 px-0">
            <div className="border-border dark:border-border/40 w-full border-b bg-purple-800 px-6 py-3">
              1 - Step-0
            </div>
            <div className="border-border dark:border-border/40 w-full border-b px-6 py-3">
              2 - Step-2
            </div>
            <div className="border-border dark:border-border/40 w-full border-b px-6 py-3">
              3 - Step-3
            </div>
            <div className="border-border dark:border-border/40 w-full border-b px-6 py-3">
              4 - Step-4
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="middle-panel-form m-5 ml-0 w-4/5">
        <Card>
          <div className="flex flex-col items-center gap-4 p-6">
            <DropZone />
          </div>
          <CardContent className="grid gap-6">
            <div
              className="group relative grid gap-3 rounded-md border border-blue-500 p-4 px-4 pt-6 pb-4 transition-colors"
              id="field"
            >
              <div className="text-muted-foreground dark:text-muted absolute top-1.5 right-1.5 flex gap-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {/* Delete icon */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Delete field"
                  className="focus:ring-ring h-4 w-4 cursor-pointer rounded-sm outline-none focus:ring-2 focus:ring-offset-2"
                  onClick={() => alert("Delete this field")}
                  onKeyDown={(e) =>
                    handleKey(e, () => alert("Delete this field"))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </div>

                {/* Settings icon */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Open field settings"
                  className="focus:ring-ring h-4 w-4 cursor-pointer rounded-sm outline-none focus:ring-2 focus:ring-offset-2"
                  onClick={() => alert("Edit this field")}
                  onKeyDown={(e) =>
                    handleKey(e, () => alert("Edit this field"))
                  }
                >
                  <Settings className="h-4 w-4" />
                </div>
              </div>

              <Label htmlFor="fieldName">Field Name</Label>
              <Input id="fieldName" defaultValue="firstName" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="label">Label</Label>
              <Input id="label" defaultValue="First Name" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input id="placeholder" defaultValue="Enter your first name" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="defaultValue">Default Value</Label>
              <Input id="defaultValue" />
            </div>

            <div className="flex items-center gap-3">
              <Checkbox id="required" />
              <Label htmlFor="required">Required</Label>
            </div>
          </CardContent>
          <CardFooter className="w-full">
            <div className="flex w-full gap-2">
              <Button variant="outline" className="w-1/2 rounded-md px-4 py-2">
                <RotateCcw />
                Reset Field
              </Button>
              <Button
                variant="destructive"
                className="w-1/2 rounded-md px-4 py-2"
              >
                <Trash2 /> Delete Field
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
