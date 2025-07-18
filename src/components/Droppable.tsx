import { PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";

export interface DraggableItemProps extends PropsWithChildren {
  id: string;
}

export function DraggableItem(props: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="cursor-grab"
    >
      {props.children}
    </div>
  );
}
