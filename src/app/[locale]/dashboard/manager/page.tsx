import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";

interface Props {
  params: { locale: string };
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

export default async function ManagerDashboard({ params: { locale } }: Props) {
  const session = await auth();

  // If user is not logged in, redirect to login
  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  // Check if user has manager access
  const allowedRoles = ["admin", "manager"];
  if (!allowedRoles.includes(session.user?.role || "")) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome, {session.user?.name || session.user?.email}! You have
              manager privileges.
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6 shadow-md dark:bg-blue-900/20">
            <h3 className="mb-2 text-xl font-semibold text-blue-800 dark:text-blue-200">
              Team Management
            </h3>
            <p className="text-blue-600 dark:text-blue-300">
              Manage your team members and assign tasks.
            </p>
          </div>

          <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-6 shadow-md dark:bg-green-900/20">
            <h3 className="mb-2 text-xl font-semibold text-green-800 dark:text-green-200">
              Project Overview
            </h3>
            <p className="text-green-600 dark:text-green-300">
              Monitor project progress and deadlines.
            </p>
          </div>

          <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-6 shadow-md dark:bg-yellow-900/20">
            <h3 className="mb-2 text-xl font-semibold text-yellow-800 dark:text-yellow-200">
              Reports
            </h3>
            <p className="text-yellow-600 dark:text-yellow-300">
              Generate and review team performance reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
