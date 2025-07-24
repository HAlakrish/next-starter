import { useTranslations } from "next-intl";

import CardComponent from "@/components/Card";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <CardComponent
      className="mx-auto my-auto mt-4 w-md rounded-lg border-1 shadow-lg"
      title={t("title")}
      description={t("description")}
      themeChanger={t("ThemeChanger")}
      showThemeSwitcher={true}
      showLanguageSwitcher={true}
      imageUrl="https://placehold.co/500"
      imageWidth={500}
    />
  );
}
