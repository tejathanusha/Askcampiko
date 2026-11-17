import { LanguageContext } from "./languageContext";

export function LanguageProvider({ language, children }) {
  return (
    <LanguageContext.Provider value={language}>
      {children}
    </LanguageContext.Provider>
  );
}
