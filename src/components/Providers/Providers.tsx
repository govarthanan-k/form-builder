"use client";

import { ThemeProvider } from "@/components/ThemeProvider";

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
};
