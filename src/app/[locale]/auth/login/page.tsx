import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignIn } from "@/components/sign-in";

interface Props {
  params: { locale: string };
}

export default async function LoginPage({ params: { locale } }: Props) {
  const session = await auth();

  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
