import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-[#7B1F34] hover:brightness-110",
            footerActionLink: "text-[#7B1F34] hover:text-[#5a0f22]",
          },
        }}
      />
    </div>
  );
}
