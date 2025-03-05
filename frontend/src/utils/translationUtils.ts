import i18n from '../i18n';

/**
 * Translates product data from backend
 * 
 * This utility helps translate product data from the backend
 * - If the string has a direct translation in i18n resources, returns the translation
 * - If not, returns the original string
 * 
 * @param text The text to translate
 * @returns Translated text if available, otherwise original text
 */
export const translateBackendData = (text: string): string => {
  const translation = i18n.t(text);
  
  // If i18next returns the key itself (no translation found), return original
  return translation === text && !i18n.exists(text) ? text : translation;
};

/**
 * Translates a product description based on the current language
 * 
 * This implementation uses a simple mapping of English descriptions to Czech translations
 * In a real app, you would:
 * 1. Either fetch translated descriptions from backend
 * 2. Or use machine translation API
 * 3. Or create manual translations for each product
 * 
 * @param description The product description from the backend
 * @returns Translated description
 */
export const translateDescription = (description: string): string => {
  const currentLanguage = i18n.language;
  
  if (currentLanguage !== 'cz') {
    return description;
  }
  
  // Map of English descriptions to Czech translations
  const descriptionTranslations: Record<string, string> = {
    "Classic Italian pizza with tomato sauce, mozzarella cheese, fresh basil, salt, and extra-virgin olive oil.": 
      "Klasická italská pizza s rajčatovou omáčkou, mozzarellou, čerstvou bazalkou, solí a extra panenským olivovým olejem.",
      
    "Pizza divided into four sections with different toppings representing the four seasons: artichokes, ham and mushrooms, olives, and tomatoes.": 
      "Pizza rozdělená do čtyř částí s různými ingrediencemi představujícími čtyři roční období: artyčoky, šunka a houby, olivy a rajčata.",
      
    "Juicy beef patty with fresh lettuce, tomato, onion, and our special sauce on a toasted sesame seed bun.": 
      "Šťavnatá hovězí placka s čerstvým salátem, rajčetem, cibulí a naší speciální omáčkou v opečené sezamové housce.",
      
    "Our classic burger topped with melted cheddar cheese for an extra flavor kick.": 
      "Náš klasický burger s rozpuštěným čedarem pro extra chuťový zážitek.",
      
    "Crispy golden fries made from hand-cut potatoes, perfectly seasoned with sea salt.": 
      "Křupavé zlaté hranolky z ručně krájených brambor, dokonale ochucené mořskou solí.",
      
    "Delicious sweet potato fries, slightly crispy on the outside and tender on the inside.": 
      "Lahodné hranolky ze sladkých brambor, mírně křupavé na povrchu a jemné uvnitř."
  };
  
  return descriptionTranslations[description] || description;
};