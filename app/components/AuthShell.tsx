import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="min-h-[100svh] bg-surface px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col items-center justify-center gap-8 text-center">
        <div className="max-w-2xl space-y-3">
          <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface sm:text-headline-lg">
            {title}
          </h1>
          <p className="mx-auto max-w-xl text-body-md text-on-surface-variant">
            {description}
          </p>
        </div>

        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </main>
  );
}
