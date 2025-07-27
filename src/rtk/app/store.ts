import { editorReducer } from "@/rtk/features";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    editor: editorReducer,
  },
});
