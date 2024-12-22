"use client";

import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import WebpageClient from "./client";
const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WebpageClient />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default Index;
