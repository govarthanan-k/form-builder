export interface TagInputProps {
  tags?: string[];
  noTagsMessage?: string;
  duplicateTagMessage?: string;
  onChange: (tags: string[]) => void;
}
