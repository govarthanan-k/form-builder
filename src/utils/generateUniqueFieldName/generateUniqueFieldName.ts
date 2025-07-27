import { GenerateUniqueFieldNameArgs } from "./generateUniqueFieldName.types";

export const generateUniqueFieldName = ({ existingFields, padding = 2, prefix }: GenerateUniqueFieldNameArgs): string => {
  let index = 1;
  let newName = `${prefix}_${String(index).padStart(padding, "0")}`;
  while (newName in existingFields) {
    index++;
    newName = `${prefix}_${String(index).padStart(padding, "0")}`;
  }

  return newName;
};
