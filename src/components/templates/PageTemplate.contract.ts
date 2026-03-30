import { ReactNode } from "react";

export interface PageTemplateProps {
  id?: string;
  className?: string;
  banner?: {
    text: string;
    strongText: string;
    tone?: "info" | "success" | "warning";
  };
  header?: {
    kicker: string;
    title: string;
    description: string;
    actions?: ReactNode;
    panel?: ReactNode;
    callout?: ReactNode;
  };
  children: ReactNode;
}
