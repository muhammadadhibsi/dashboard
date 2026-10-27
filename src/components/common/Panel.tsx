import type { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/utils/cn";

interface PanelProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  /** Overrides the default 20px title, e.g. the larger Revenue Analytics heading. */
  titleClassName?: string;
  children: ReactNode;
}

/** Titled shadcn Card used by every dashboard and customers widget. */
export function Panel({
  title,
  description,
  actions,
  className,
  titleClassName,
  children,
}: PanelProps) {
  return (
    <Card className={cn("gap-4 p-5", className)}>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3 px-0">
        <div className="min-w-0">
          <CardTitle
            className={cn(
              "text-lg leading-6 font-semibold text-fg",
              titleClassName,
            )}
          >
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-sm leading-5 text-muted">
              {description}
            </CardDescription>
          )}
        </div>
        {actions && <CardAction>{actions}</CardAction>}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-0">
        {children}
      </CardContent>
    </Card>
  );
}
