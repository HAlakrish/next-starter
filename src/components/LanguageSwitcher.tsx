"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useLocale } from "next-intl";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    if (languageCode === locale) return;

    startTransition(() => {
      // Remove current locale from pathname and add new locale
      const segments = pathname.split("/");
      segments[1] = languageCode; // Replace the locale segment
      const newPath = segments.join("/");

      // Set cookie for preference persistence
      document.cookie = `preferred-locale=${languageCode}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;

      router.push(newPath);
      router.refresh();
    });
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          size="sm"
          isLoading={isPending}
          className="min-w-24"
        >
          <span className="flex items-center gap-2">
            <span>{currentLanguage.flag}</span>
            <span className="hidden sm:inline">{currentLanguage.name}</span>
            <span className="sm:hidden">
              {currentLanguage.code.toUpperCase()}
            </span>
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        onAction={(key) => handleLanguageChange(key as string)}
        selectedKeys={new Set([locale])}
        selectionMode="single"
      >
        {languages.map((language) => (
          <DropdownItem key={language.code} className="flex items-center gap-2">
            <span className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default LanguageSwitcher;
