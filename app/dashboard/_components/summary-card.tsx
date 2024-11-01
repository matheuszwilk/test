import { ReactNode } from "react";

export const SummaryCardIcon = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-transparent text-muted-foreground">
      {children}
    </div>
  );
};

export const SummaryCardTitle = ({ children }: { children: ReactNode }) => {
  return (
    <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
      {children}
    </p>
  );
};

export const SummaryCardValue = ({ children }: { children: ReactNode }) => {
  return (
    <p className="text-2xl font-semibold text-foreground dark:text-foreground">
      {children}
    </p>
  );
};

export const SummaryCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="rounded-xl border border-border p-6 text-card dark:bg-card dark:text-card">
      {children}
    </div>
  );
};

export const SummaryCardSkeleton = () => {
  return (
    <div className="rounded-xl bg-card p-6 dark:bg-card">
      <div className="space-y-2">
        <div className="h-9 w-9 rounded-md bg-muted dark:bg-muted" />
        <div className="h-5 w-[86.26px] rounded-md bg-muted dark:bg-muted" />
        <div className="h-8 w-48 rounded-md bg-muted dark:bg-muted" />
      </div>
    </div>
  );
};
