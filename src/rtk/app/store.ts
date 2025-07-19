import { configureStore } from "@reduxjs/toolkit";

import { editorReducer } from "../features";

export const store = configureStore({
  reducer: {
    editor: editorReducer,
  },
});
