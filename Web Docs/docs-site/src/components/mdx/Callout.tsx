import type { ReactNode } from "react";

type CalloutVariant = "note" | "warning" | "tip";
type ExtendedCalloutVariant = CalloutVariant | "updated" | "alert";

type CalloutProps = {
  title?: string;
  variant?: ExtendedCalloutVariant;
  children: ReactNode;
};

const titleMap: Record<ExtendedCalloutVariant, string> = {
  note: "Note",
  warning: "Warning",
  tip: "Tip",
  updated: "Updated",
  alert: "Alert",
};

export function Callout({ title, variant = "note", children }: CalloutProps) {
  return (
    <div className="callout" data-variant={variant}>
      <div className="callout-title">{title || titleMap[variant]}</div>
      <div>{children}</div>
    </div>
  );
}
