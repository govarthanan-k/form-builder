"use client";

import { Provider } from "react-redux";

import { ThemeProvider } from "@/components/ThemeProvider";

import { store } from "../../rtk/app/store";

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
};
