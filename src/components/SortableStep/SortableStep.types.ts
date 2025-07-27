import { StepDefinition } from "@/store/features/editor/editor.types";

export interface SortableStepProps {
  stepDefinition: StepDefinition;
  index: number;
  activeStep: number;
  onSelectStep: (index: number) => void;
}
