import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, SquarePen, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface StepDefinition {
  stepName: string;
  // Add other fields if needed
}

interface SortableStepProps {
  stepDefinition: StepDefinition;
  index: number;
  activeStep: number;
  onSelectStep: (index: number) => void;
}

export const SortableStep: React.FC<SortableStepProps> = ({ stepDefinition, index, activeStep, onSelectStep }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: stepDefinition.stepName,
  });

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
            <GripVertical className="h-4 w-4" />
          </span>
          <span>
            {index + 1} - {stepDefinition.stepName}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <SquarePen className="h-4 w-4 cursor-pointer" onClick={() => onSelectStep(index)} />
          <Trash2 className="h-4 w-4 cursor-pointer text-red-500" />
        </div>
      </div>
    </div>
  );
};
