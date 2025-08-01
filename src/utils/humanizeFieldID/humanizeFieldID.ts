export const humanizeFieldID = (field: string) => field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
