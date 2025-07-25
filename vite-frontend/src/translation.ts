type LanguageMap = { [key: string]: string };
export const MONTH_NAMES: LanguageMap[] = [
  { en: "january", nl: "januari" },
  { en: "february", nl: "februari" },
  { en: "march", nl: "maart" },
  { en: "april", nl: "april" },
  { en: "may", nl: "mei" },
  { en: "june", nl: "juni" },
  { en: "july", nl: "juli" },
  { en: "august", nl: "augustus" },
  { en: "september", nl: "september" },
  { en: "october", nl: "oktober" },
  { en: "november", nl: "november" },
  { en: "december", nl: "december" },
];
export const DAY_NAMES: LanguageMap[] = [
  { en: "monday", nl: "maandag" },
  { en: "tuesday", nl: "dinsdag" },
  { en: "wednesday", nl: "woensdag" },
  { en: "thursday", nl: "donderdag" },
  { en: "friday", nl: "vrijdag" },
  { en: "saturday", nl: "zaterdag" },
  { en: "sunday", nl: "zondag" },
];
export const TEXT_MAP: { [key: string]: LanguageMap } = {
  language: {
    en: "language",
    nl: "taal",
  },
  groups: {
    en: "groups",
    nl: "groepen",
  },
  not_found: {
    en: "Page could not be found.",
    nl: "Pagina kan niet gevonden worden.",
  },
  name: {
    en: "name",
    nl: "naam",
  },
  message: {
    en: "message",
    nl: "bericht",
  },
  send: {
    en: "send",
    nl: "verstuur",
  },
  everyone: {
    en: "everyone",
    nl: "iedereen",
  },
};
export function capitalize(str: string): string {
  if (!str) return "";
  return str[0].toUpperCase() + str.slice(1);
}
