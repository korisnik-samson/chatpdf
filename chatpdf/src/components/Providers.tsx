'use client'
import React from 'react';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ProviderProps } from "@/types";

const queryClient = new QueryClient();

const Providers = ({ children }: ProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

export default Providers;