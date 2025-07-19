"use client";

import { AlertCircleIcon, ArrowRight, Settings, Trash2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FormSchema } from "../app/page";
import { DropZone } from "./DropArea";
import { FormInTheMiddle } from "./FormInTheMiddle";

export const handleKey = (e: React.KeyboardEvent, callback: () => void) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    callback();
  }
};

export const MiddlePanel = ({ schema }: { schema: FormSchema }) => {
  return (
    <div className="flex w-full flex-col overflow-y-auto" style={{ height: "calc(100vh - 88px)" }}>
      <div className="flex w-full">
        <div className="middle-panel-steps m-5 w-1/5">
          <Card className="gap-0 pt-4 pb-0">
            <CardHeader>
              <CardDescription>
                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Steps</h2>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-0">
              <div className="border-border dark:border-border/40 w-full border-b bg-[#5e10b1] px-6 py-3">1 - Step-0</div>
              <div className="border-border dark:border-border/40 w-full border-b px-6 py-3">2 - Step-2</div>
              <div className="border-border dark:border-border/40 w-full border-b px-6 py-3">3 - Step-3</div>
              <div className="border-border dark:border-border/40 w-full border-b px-6 py-3">4 - Step-4</div>
            </CardContent>
          </Card>
        </div>

        <div className="middle-panel-form m-5 ml-0 w-4/5">
          <Card>
            <div className="flex flex-col items-center gap-4 p-6">
              <DropZone />
            </div>
            <CardContent className="grid gap-6">
              <FormInTheMiddle dataSchema={schema.dataSchema} uiSchema={schema.uiSchema} />
              {schema.dataSchema.properties && Object.keys(schema.dataSchema.properties).length === 0 && (
                <>
                  <div className="grid w-full items-start gap-4" id="error_container">
                    <Alert variant="destructive">
                      <AlertCircleIcon />
                      <AlertTitle>Unable to process your payment.</AlertTitle>
                      <AlertDescription>
                        <p>Please verify your billing information and try again.</p>
                        <ul className="list-inside list-disc text-sm">
                          <li>Check your card details</li>
                          <li>Ensure sufficient funds</li>
                          <li>Verify billing address</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </div>
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
                        onKeyDown={(e) => handleKey(e, () => alert("Delete this field"))}
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
                        onKeyDown={(e) => handleKey(e, () => alert("Edit this field"))}
                      >
                        <Settings className="h-4 w-4" />
                      </div>
                    </div>

                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Govarthanan" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="K" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="govarthanan@live.com" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="w-full">
              <div className="mt-6 flex w-full items-center justify-between">
                {/* Left buttons */}
                <div className="flex gap-4">
                  <Button className="bg-green-600 text-white hover:bg-green-700">Save</Button>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">Submit</Button>
                </div>

                {/* Right button */}
                <Button>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
