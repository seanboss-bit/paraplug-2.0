"use client";

import { LoadingProvider } from "./LoadingProvider";
import { Toaster } from "sonner";

export function ClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LoadingProvider>
      <Toaster expand={false} richColors position="top-center" />
      {children}
    </LoadingProvider>
  );
}
