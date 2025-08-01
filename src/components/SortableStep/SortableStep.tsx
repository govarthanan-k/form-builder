import { useAppDispatch } from "@/store/app/hooks";
import { deleteStep } from "@/store/features";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grip, SquarePen, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { SortableStepProps } from "./SortableStep.types";

export const SortableStep: React.FC<SortableStepProps> = ({ activeStep, allowDelete, index, onSelectStep, stepDefinition }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: stepDefinition.stepName,
  });

  const dispatch = useAppDispatch();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-border dark:border-border/40 w-full rounded-md border-b px-6 py-3 select-none",
        activeStep === index ? "bg-[#5a287d] text-white" : ""
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span {...attributes} {...listeners} className="cursor-grab">
            <Grip className="h-4 w-4" />
          </span>
          <span>
            {index + 1} - {stepDefinition.stepName}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <SquarePen className="h-4 w-4 cursor-pointer" onClick={() => onSelectStep(index)} />
          {allowDelete && (
            <Trash2
              className="h-4 w-4 cursor-pointer text-red-500"
              onClick={() => {
                dispatch(deleteStep({ index }));
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
