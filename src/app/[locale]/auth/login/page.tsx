import { useTranslations } from "next-intl";

import { SignIn } from "@/components/sign-in";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
