"use client";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";

import { signOutAction } from "@/lib/actions/auth";

export function UserStatus() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
        <div>
          <p className="text-sm text-green-800 dark:text-green-200">
            Signed in as: {session.user?.email}
          </p>
        </div>
        <Button
          size="sm"
          color="primary"
          onClick={() => router.push(`/${locale}/dashboard`)}
        >
          Dashboard
        </Button>
        <form action={signOutAction}>
          <Button size="sm" color="danger" variant="bordered" type="submit">
            Sign Out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
      <p className="text-sm text-blue-800 dark:text-blue-200">
        You are not signed in
      </p>
      <Button
        size="sm"
        color="primary"
        onClick={() => router.push(`/${locale}/auth/login`)}
      >
        Sign In
      </Button>
    </div>
  );
}
