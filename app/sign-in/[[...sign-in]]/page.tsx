import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/app/components/AuthShell";

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in to your Tantava account"
      description="Access your saved orders, wishlist, and checkout details from one beautifully organized place."
    >
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
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
