"use client"

import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const Provider = ({ children, ...props }: ThemeProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </NextThemeProvider>
        </QueryClientProvider>
    )
}

export default Provider;
