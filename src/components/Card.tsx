"use client";

import { Card, CardBody, CardFooter, CardHeader, Image } from "@heroui/react";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface CardComponentProps {
  title: string;
  description: string;
  themeChanger?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageWidth?: number;
  className?: string;
  showThemeSwitcher?: boolean;
  showLanguageSwitcher?: boolean;
}

export default function CardComponent({
  title,
  description,
  imageUrl = "https://placehold.co/270",
  themeChanger,
  imageAlt = "Card image",
  imageWidth = 500,
  className = "",
  showThemeSwitcher = false,
  showLanguageSwitcher = true,
}: CardComponentProps) {
  return (
    <Card className={`py-4 ${className || ""}`}>
      <CardHeader className="flex-col items-start px-4 pt-2 pb-0">
        <h1 className="text-large font-bold">{title}</h1>
        <h4 className="text-default-500">{description}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt={imageAlt}
          className="rounded-xl object-cover"
          src={imageUrl}
          width={imageWidth}
        />
      </CardBody>

      <CardFooter className="flex flex-col justify-between px-4 py-2">
        <h3 className="text-default-500">{themeChanger}</h3>
        <div className="flex flex-col items-center gap-2">
          {showThemeSwitcher && <ThemeSwitcher />}

          {showLanguageSwitcher && <LanguageSwitcher />}
        </div>
      </CardFooter>
    </Card>
  );
}
