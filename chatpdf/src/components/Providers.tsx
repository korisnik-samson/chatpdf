'use client'
import React from 'react';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

type PropsType = {
    children: React.ReactNode
};

const queryClient = new QueryClient();

const Providers = ({ children }: PropsType) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

export default Providers;