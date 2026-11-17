export const defaultPreferences = {
  campusNotifications: true,
  emailNotifications: true,
  darkMode: false,
  language: "English",
};

const supportedLanguages = ["English", "Tamil", "Telugu"];

function getStorageKey(userId) {
  return `askcampiko.preferences.${userId || "guest"}`;
}

export function readPreferences(userId) {
  try {
    const stored = window.localStorage.getItem(getStorageKey(userId));
    if (!stored) {
      return defaultPreferences;
    }

    const parsed = JSON.parse(stored);
    return {
      campusNotifications:
        typeof parsed.campusNotifications === "boolean"
          ? parsed.campusNotifications
          : defaultPreferences.campusNotifications,
      emailNotifications:
        typeof parsed.emailNotifications === "boolean"
          ? parsed.emailNotifications
          : defaultPreferences.emailNotifications,
      darkMode:
        typeof parsed.darkMode === "boolean"
          ? parsed.darkMode
          : defaultPreferences.darkMode,
      language: supportedLanguages.includes(parsed.language)
        ? parsed.language
        : defaultPreferences.language,
    };
  } catch (error) {
    console.error("Unable to load saved Ask Campiko preferences.", error);
    return defaultPreferences;
  }
}

export function savePreferences(userId, preferences) {
  try {
    window.localStorage.setItem(
      getStorageKey(userId),
      JSON.stringify(preferences)
    );
    return null;
  } catch (error) {
    return error;
  }
}
