import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { User } from "@/entities/User";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "es", name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  { code: "fr", name: "French", flag: "🇫🇷", nativeName: "Français" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", nativeName: "العربية", rtl: true },
  { code: "zh", name: "Chinese", flag: "🇨🇳", nativeName: "中文" },
  { code: "ru", name: "Russian", flag: "🇷🇺", nativeName: "Русский" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", nativeName: "Português" },
  { code: "de", name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
  { code: "ko", name: "Korean", flag: "🇰🇷", nativeName: "한국어" },
  { code: "it", name: "Italian", flag: "🇮🇹", nativeName: "Italiano" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", nativeName: "हिन्दी" }
];

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("en");

  const applyLanguage = useCallback((code) => {
    const language = languages.find(l => l.code === code);
    if (language) {
      document.documentElement.lang = code;
      document.documentElement.dir = language.rtl ? 'rtl' : 'ltr';
    }
  }, []);

  const loadUserLanguage = useCallback(async () => {
    try {
      const user = await User.me();
      if (user.language) {
        setCurrentLang(user.language);
        applyLanguage(user.language);
      }
    } catch (error) {
      console.error("Error loading user language:", error);
    }
  }, [applyLanguage]);

  useEffect(() => {
    loadUserLanguage();
  }, [loadUserLanguage]);

  const changeLanguage = async (code) => {
    setCurrentLang(code);
    applyLanguage(code);
    
    try {
      await User.updateMyUserData({ language: code });
      
      // In production, this would reload the UI with translations
      // For now, we'll show a notification
      const event = new CustomEvent('language-changed', { detail: { language: code } });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          <span>{currentLanguage.flag}</span>
          <span className="hidden md:inline">{currentLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#2a2a2a]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`text-white cursor-pointer ${currentLang === lang.code ? 'bg-[#2a2a2a]' : ''}`}
          >
            <span className="mr-2">{lang.flag}</span>
            <span className="flex-1">{lang.nativeName}</span>
            {lang.rtl && <span className="text-xs text-gray-400 ml-2">RTL</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}