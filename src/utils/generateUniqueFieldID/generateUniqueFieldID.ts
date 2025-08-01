import { GenerateUniqueFieldIDArgs } from "./generateUniqueFieldID.types";

export const generateUniqueFieldID = ({ existingFields, padding = 2, prefix }: GenerateUniqueFieldIDArgs): string => {
  let index = 1;
  let newName = `${prefix}_${String(index).padStart(padding, "0")}`;
  while (newName in existingFields) {
    index++;
    newName = `${prefix}_${String(index).padStart(padding, "0")}`;
  }

  return newName;
};
