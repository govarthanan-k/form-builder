"use client";

import { store } from "@/store/app/store";
import { Provider } from "react-redux";

import { ThemeProvider } from "@/components/ThemeProvider";

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
};
