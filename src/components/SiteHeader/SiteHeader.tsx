"use client";

import Image from "next/image";
import Link from "next/link";
import { Save, UploadCloud } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Natwest Logo" width={174} height={50} />
          <span className="text-lg font-semibold">eForm Designer</span>
        </Link>

        <div className="flex items-center gap-6 space-x-4">
          <Link href="/forms" className="rounded px-3 py-1 text-sm font-medium transition-colors">
            Forms
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Dev Mode</span>
            <Switch />
          </div>

          {/* Auto Save Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Auto Save</span>
            <Switch />
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => alert("Saved!")}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Save className="mr-1 h-4 w-4" /> Save
            </Button>
            <Button size="sm" onClick={() => alert("Published!")} className="bg-blue-600 text-white hover:bg-blue-700">
              <UploadCloud className="mr-1 h-4 w-4" /> Publish
            </Button>
          </div>

          {/* Avatar */}
          <Avatar>
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
