import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/app/components/AuthShell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your Tantava account"
      description="Save your favorites, track your orders, and move through checkout faster every time."
    >
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/account"
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "w-full",
              card: "w-full shadow-none border border-outline-variant/40 bg-surface-container-lowest",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "border-outline-variant/60 bg-surface hover:bg-surface-container-low",
              formButtonPrimary:
                "bg-primary text-on-primary hover:bg-on-primary-fixed-variant",
              footerActionLink: "text-primary hover:text-on-primary-fixed-variant",
            },
          }}
        />
    </AuthShell>
  );
}
