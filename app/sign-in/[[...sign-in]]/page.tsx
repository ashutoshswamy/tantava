import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low py-20 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Welcome Back</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Sign in to your Tantava account
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
