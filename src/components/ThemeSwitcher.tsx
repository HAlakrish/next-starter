"use client";

import { useEffect, useState } from "react";

import { Switch } from "@heroui/react";
import { IconMoon, IconSun } from "@tabler/icons-react";

import useSystemTheme from "@/hooks/useSystemTheme";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useSystemTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <Switch
        isSelected={theme === "dark"}
        onValueChange={() =>
          theme === "dark" ? setTheme("light") : setTheme("dark")
        }
        color="secondary"
        size="lg"
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <IconSun className={className} />
          ) : (
            <IconMoon className={className} />
          )
        }
      >
        Dark mode
      </Switch>
    </div>
  );
}
