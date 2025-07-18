"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";

export function TagInput() {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addTag = (value: string) => {
    const tag = value.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const removeTag = (index: number) => {
    const updated = [...tags];
    updated.splice(index, 1);
    setTags(updated);
  };

  return (
    <div className="w-full max-w-md">
      {/* Input field */}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a valid AD group and press Enter"
        className="dark:bg-zinc-900"
      />

      {/* Tags below the input */}
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-sm text-white"
          >
            {tag}
            <button
              onClick={() => removeTag(i)}
              className="text-white hover:text-red-300"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
