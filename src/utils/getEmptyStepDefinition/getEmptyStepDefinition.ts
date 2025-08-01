import { StepDefinition } from "@/store/features/editor/editor.types";

export const getEmptyStepDefinition = (stepType?: "Step" | "Summary" | "ThankYou", stepName?: string): StepDefinition => {
  return {
    stepName: stepName ?? "Step-1",
    schema: {
      type: "object",
      required: [],
      properties: {},
    },
    uiSchema: {
      "ui:order": [],
    },
    isThankYouPage: stepType === "ThankYou",
    isSummaryPage: stepType === "Summary",
  };
};
