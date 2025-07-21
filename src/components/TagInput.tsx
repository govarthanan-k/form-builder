"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface TagInputProps {
  tags?: string[];
  noTagsMessage?: string;
}

export function Tag({ tag, onRemove }: { tag: string; onRemove: () => void }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [tag]);

  const tagContent = (
    <span className="flex max-w-[200px] items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
      <span ref={textRef} className="min-w-0 flex-1 truncate overflow-hidden text-ellipsis whitespace-nowrap">
        {tag}
      </span>
      <button onClick={onRemove} className="shrink-0 text-white hover:text-red-300" type="button">
        <X className="h-4 w-4" />
      </button>
    </span>
  );

  return isTruncated ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{tagContent}</TooltipTrigger>
        <TooltipContent>
          <span>{tag}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    tagContent
  );
}

export function TagInput({ tags: initialTags = [], noTagsMessage = "No tags added yet." }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");
  const [duplicateError, setDuplicateError] = useState(false);
  const [liveValidate, setLiveValidate] = useState(false);

  const addTag = (value: string) => {
    const tag = value.trim();
    if (!tag) return;

    if (tags.includes(tag)) {
      setDuplicateError(true);
      setLiveValidate(true);
    } else {
      setTags([...tags, tag]);
      setInputValue("");
      setDuplicateError(false);
      setLiveValidate(false);
    }
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

  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (liveValidate) {
      const isDuplicate = tags.includes(value.trim());
      setDuplicateError(isDuplicate);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Input
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a valid AD group and press Enter"
        className={`dark:bg-zinc-900 ${duplicateError ? "border-red-500" : ""}`}
      />

      {duplicateError && <p className="mt-1 text-sm text-red-500">This tag already exists.</p>}

      <div className="mt-2 flex min-h-[2rem] flex-wrap gap-2">
        {tags.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">{noTagsMessage}</p>
        ) : (
          tags.map((tag, i) => <Tag key={i} tag={tag} onRemove={() => removeTag(i)} />)
        )}
      </div>
    </div>
  );
}
