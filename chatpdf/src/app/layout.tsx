import React from 'react';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import { neobrutalism } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'ChatPDF',
    description: 'Interact and extract info from Documents using AI',
}

export default function RootLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider appearance={{ baseTheme: neobrutalism }}>
            <Providers>
                <html lang="en">
                    <body className={inter.className}>
                        {children}
                    </body>
                    <Toaster />
                </html>
            </Providers>
        </ClerkProvider>
    )
}
