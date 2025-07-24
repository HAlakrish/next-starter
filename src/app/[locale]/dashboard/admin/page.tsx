import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";

interface Props {
  params: Promise<{ locale: string }>;
}

function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        type="submit"
        className="rounded-md border border-red-600 bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
      >
        Sign Out
      </button>
    </form>
  );
}

export default async function AdminDashboard({ params }: Props) {
  const { locale } = await params;
  const session = await auth();

  // If user is not logged in, redirect to login
  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  // If user is not admin, redirect to their appropriate dashboard
  if (session.user?.role !== "admin") {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome, {session.user?.name || session.user?.email}! You have
              admin privileges.
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-6 shadow-md dark:bg-red-900/20">
            <h3 className="mb-2 text-xl font-semibold text-red-800 dark:text-red-200">
              User Management
            </h3>
            <p className="text-red-600 dark:text-red-300">
              Manage all users, roles, and permissions.
            </p>
          </div>

          <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-6 shadow-md dark:bg-purple-900/20">
            <h3 className="mb-2 text-xl font-semibold text-purple-800 dark:text-purple-200">
              System Settings
            </h3>
            <p className="text-purple-600 dark:text-purple-300">
              Configure system-wide settings and preferences.
            </p>
          </div>

          <div className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-6 shadow-md dark:bg-orange-900/20">
            <h3 className="mb-2 text-xl font-semibold text-orange-800 dark:text-orange-200">
              Analytics
            </h3>
            <p className="text-orange-600 dark:text-orange-300">
              View detailed analytics and system reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
