"use client";

import { useSearchParams } from "next/navigation";

import { useTranslations } from "next-intl";

export default function AuthErrorPage() {
  const t = useTranslations("Error");
  const search = useSearchParams();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <a
        href="#"
        className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t("title")}
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400">
          {t("description")}
        </div>
      </a>
    </div>
  );
}
