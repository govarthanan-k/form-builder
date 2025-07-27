import { editorReducer } from "@/store/features";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    editor: editorReducer,
  },
});
