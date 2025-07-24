import { redirect } from "next/navigation";

import { auth } from "@/auth";

interface Props {
  params: { locale: string };
}

export default async function DashboardIndex({ params: { locale } }: Props) {
  const session = await auth();

  // If user is not logged in, redirect to login
  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  const userRole = session.user?.role;

  // Redirect based on role
  if (userRole === "admin") {
    redirect(`/${locale}/dashboard/admin`);
  } else if (userRole === "manager") {
    redirect(`/${locale}/dashboard/manager`);
  } else {
    // Regular users or unknown roles go back to homepage
    redirect(`/${locale}/`);
  }
}
