import { InfoFieldProps } from "./InfoField.types";

export const InfoField = ({ label, value }: InfoFieldProps) => (
  <div className="flex flex-col">
    <span className="text-muted-foreground text-sm">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);
