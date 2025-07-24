"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const t = useTranslations("Auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("invalidCredentials"));
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError(t("signInError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="flex flex-col items-center gap-1">
        <h2 className="text-2xl font-bold">{t("signIn")}</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            label={t("email")}
            placeholder={t("enterEmail")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired
            variant="bordered"
          />
          <Input
            type="password"
            label={t("password")}
            placeholder={t("enterPassword")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired
            variant="bordered"
          />
          {error && (
            <div className="text-center text-sm text-red-500">{error}</div>
          )}
          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? t("signingIn") : t("signIn")}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
