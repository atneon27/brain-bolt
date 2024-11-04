"use client"

import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

const Provider = ({children, ...props}: ThemeProviderProps) => {
    return(
        <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider>
                {children}
            </SessionProvider>
        </NextThemeProvider>
    )
}

export default Provider;
