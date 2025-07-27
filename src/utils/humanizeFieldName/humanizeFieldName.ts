export const humanizeFieldName = (field: string) => field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
