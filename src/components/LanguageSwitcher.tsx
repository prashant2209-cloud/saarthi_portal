import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation("components");
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const languages = [
    { code: "en", name: t("languageSwitcher.english"), flag: "🇺🇸" },
    { code: "hi", name: t("languageSwitcher.hindi"), flag: "🇮🇳" },
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
    localStorage.setItem("i18nextLng", languageCode);
  };

  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.flag}</span>
          <span className="hidden md:inline">{currentLang.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`gap-2 ${currentLanguage === language.code ? "bg-accent" : ""}`}
          >
            <span>{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
