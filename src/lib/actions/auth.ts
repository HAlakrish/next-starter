"use server";

import { redirect } from "next/navigation";

import { AuthError } from "next-auth";

import { auth, signIn, signOut } from "@/auth";
import { signInSchema } from "@/lib/zod";
import { getDashboardByRole } from "@/utils/role-utils";

export async function authenticate(
  locale: string,
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const validatedFields = signInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return "Invalid credentials.";
    }

    const result = await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    });

    // Get the session to determine user role
    const session = await auth();
    if (session?.user?.role) {
      const dashboardRoute = getDashboardByRole(session.user.role as any);
      redirect(`/${locale}${dashboardRoute}`);
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }

  // Fallback redirect if role-based redirect didn't work
  redirect(`/${locale}/dashboard`);
}

export async function signOutAction() {
  await signOut();
  redirect("/");
}
