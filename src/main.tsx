import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { queryClient } from "@/lib/query-client";
import { configureAmplify } from "@/lib/amplify";
import { warnIfWhatsAppNumberMissing } from "@/lib/whatsapp";
import "./styles/index.css";

configureAmplify();
warnIfWhatsAppNumberMissing();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
