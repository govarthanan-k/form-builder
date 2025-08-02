import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { IconWithTooltipProps } from "./IconWithTooltip.types";

export const IconWithTooltip = (props: IconWithTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{props.icon}</TooltipTrigger>
        <TooltipContent>{props.text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
