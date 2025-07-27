import { StepDefinition } from "@/types/editor.types";

export interface SortableStepProps {
  stepDefinition: StepDefinition;
  index: number;
  activeStep: number;
  onSelectStep: (index: number) => void;
}
