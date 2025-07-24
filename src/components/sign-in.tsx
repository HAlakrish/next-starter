"use client";

import { useParams } from "next/navigation";
import { useActionState } from "react";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { useTranslations } from "next-intl";

import { authenticate } from "@/lib/actions/auth";

export function SignIn() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("Auth");

  const [errorMessage, dispatch] = useActionState(
    (prevState: string | undefined, formData: FormData) =>
      authenticate(locale, prevState, formData),
    undefined
  );

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="flex flex-col items-center gap-1">
        <h2 className="text-2xl font-bold">{t("signIn")}</h2>
      </CardHeader>
      <CardBody>
        <form action={dispatch} className="flex flex-col gap-4">
          <Input
            type="email"
            name="email"
            label={t("email")}
            placeholder={t("enterEmail")}
            isRequired
            variant="bordered"
          />
          <Input
            type="password"
            name="password"
            label={t("password")}
            placeholder={t("enterPassword")}
            isRequired
            variant="bordered"
          />
          {errorMessage && (
            <div className="text-center text-sm text-red-500">
              {errorMessage}
            </div>
          )}
          <Button type="submit" color="primary" className="w-full">
            {t("signIn")}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
