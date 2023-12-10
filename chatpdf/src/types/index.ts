import React from "react";

export type Props = {
    children: React.ReactNode
};

export type PDFPage = {
    pageContent: string;
    metadata: {
        loc: { pageNumber: number }
    }
}