"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Tag } from "@/components/Tag";

import { TagInputProps } from "./TagInput.types";

export function TagInput(props: TagInputProps) {
  const { noTagsMessage = "No tags added yet.", onChange, tags = [] } = props;

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
      onChange([...tags, tag]);
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
    const updated = tags.filter((_, i) => i !== index);
    onChange?.(updated);
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
      {duplicateError && <p className="mt-1 text-sm text-red-500">{props.duplicateTagMessage ?? "This tag already exists."}</p>}
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
