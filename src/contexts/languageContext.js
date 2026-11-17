import { createContext, useContext } from "react";

export const LanguageContext = createContext("English");

export function useLanguage() {
  return useContext(LanguageContext);
}
