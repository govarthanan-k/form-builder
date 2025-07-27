import { useEffect, useRef, useState } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { X } from "lucide-react";

import { TagProps } from "./Tag.types";

export function Tag(props: TagProps) {
  const { onRemove, tag } = props;

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
