import { RotateCcw, Trash2 } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { JsonEditor } from "./JsonEditor";

export const RightSideBar = () => {
  return (
    <div
      className="w-full overflow-y-auto"
      style={{ height: "calc(100vh - 88px)" }}
    >
      <Tabs defaultValue="Inspect" className="w-full">
        <TabsList className="flex w-full">
          <TabsTrigger
            value="Inspect"
            className="flex-1 border-b-2 border-transparent text-center data-[state=active]:border-blue-500"
          >
            Inspect
          </TabsTrigger>

          <TabsTrigger
            value="Data Schema"
            className="flex-1 border-b-2 border-transparent text-center data-[state=active]:border-blue-500"
          >
            Data Schema
          </TabsTrigger>
          <TabsTrigger
            value="UI Schema"
            className="flex-1 border-b-2 border-transparent text-center data-[state=active]:border-blue-500"
          >
            UI Schema
          </TabsTrigger>
          <TabsTrigger
            value="Form Data"
            className="flex-1 border-b-2 border-transparent text-center data-[state=active]:border-blue-500"
          >
            Form Data
          </TabsTrigger>
          <TabsTrigger
            value="Rules"
            className="flex-1 border-b-2 border-transparent text-center data-[state=active]:border-blue-500"
          >
            Rules
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Inspect">
          <Card>
            <CardHeader>
              <CardTitle>Editing Properties of First Name</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
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
                <Button
                  variant="outline"
                  className="w-1/2 rounded-md px-4 py-2"
                >
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
        </TabsContent>
        <TabsContent value="Data Schema">
          <Card>
            <CardContent className="grid gap-6">
              <JsonEditor />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="UI Schema">
          <Card>
            <CardContent className="grid gap-6">
              <JsonEditor />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Form Data">
          <Card>
            <CardContent className="grid gap-6">
              <JsonEditor />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Rules">
          <Card>
            <CardContent className="grid gap-6">
              <h2 className="text-lg font-semibold text-slate-100">
                Step Rules
              </h2>
              <JsonEditor height="35vh" />
              <h2 className="text-lg font-semibold text-slate-100">
                Form Rules
              </h2>
              <JsonEditor height="35vh" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
