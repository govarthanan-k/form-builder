"use client";

import { useDraggable } from "@dnd-kit/core";

import { DraggableItemProps } from "./DraggableItem.types";

export const DraggableItem = (props: DraggableItemProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style} className="cursor-grab">
      {props.children}
    </div>
  );
};
