"use client";

import Image from "next/image";
import Link from "next/link";
import { Save, UploadCloud } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Switch } from "@/components/ui/switch";

import { useAppDispatch, useAppSelector } from "../../rtk/app/hooks";
import { switchAutoSave, switchDevMode } from "../../rtk/features";
import { ThemeToggle } from "../ThemeToggle";

export const SiteHeader = () => {
  const { autoSave, devMode } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  return (
    <header className="sticky top-0 z-50 w-full border-b px-4 py-3 backdrop-blur-md">
      <div className="flex items-stretch px-5">
        <div className="flex w-1/5 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="Natwest Logo" width={174} height={50} />
            <span className="text-lg font-semibold">eForms - Designer</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-6">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/forms">Forms</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Dev Mode</span>
            <Switch
              checked={devMode}
              onCheckedChange={() => {
                dispatch(switchDevMode());
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Auto Save</span>
            <Switch
              checked={autoSave}
              onCheckedChange={() => {
                dispatch(switchAutoSave());
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle oneClickSwitch />
          </div>
          <div className="flex gap-2">
            {!autoSave && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => alert("Saved!")}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Save className="mr-1 h-4 w-4" /> Save
              </Button>
            )}
            <Button size="sm" onClick={() => alert("Published!")} className="bg-blue-600 text-white hover:bg-blue-700">
              <UploadCloud className="mr-1 h-4 w-4" /> Publish
            </Button>
          </div>
          {/* Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/avatar.png" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert("Logging out...")}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
