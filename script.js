const ALL_COUNTRIES = [
  "Italy", "France", "Germany", "Spain", "Japan", "Brazil", "Canada", "Australia", 
  "Argentina", "Egypt", "India", "China", "Mexico", "Norway", "Sweden", "Thailand",
  "Greece", "Portugal", "Netherlands", "Switzerland", "Austria", "Belgium", "Denmark",
  "Finland", "Poland", "Turkey", "Russia", "South Africa", "South Korea", "Vietnam",
  "Indonesia", "Peru", "Chile", "Colombia", "Morocco", "Kenya", "New Zealand", "Ireland"
];

// Lista ridotta per la modalità Europa. Nota: usiamo array separati per semplicità e velocità di accesso.
const EUROPEAN_COUNTRIES = [
  "Italy", "France", "Germany", "Spain", "Norway", "Sweden", "Greece", "Portugal", 
  "Netherlands", "Switzerland", "Austria", "Belgium", "Denmark", "Finland", "Poland", 
  "Ireland"
];

/** 
 * LOGICA DI SELEZIONE: Restituisce l'array di paesi in base alla modalità selezionata.
 * Questo permette di riutilizzare la stessa logica di gioco per sfide diverse.
 */
export function getCountries(mode) {
  if (mode === 2) return EUROPEAN_COUNTRIES; 
  return ALL_COUNTRIES; 
}

/** 
 * Lista di parole da censurare per non rendere il quiz troppo ovvio (nomi di paesi, lingue, ecc.)
 */
export function getCountryBlacklist(/** @type string */ name) {
    return [name, "italian", "italy", "france", "germany", "spain", "japan", "brazil", "republic", "kingdom", "state", "country"];
}

/** 
 * Funzione principale che recupera il fatto da Wikipedia.
 * Gestisce anche la modalità "Cibo" aggiungendo una specifica alla ricerca.
 */
export async function getCountryInfo(/** @type string */ countryName, mode = 0) {
  let searchQuery = countryName;
  if (mode === 1) {
    searchQuery = `${countryName} cuisine`; // Modalità Cibo: cerca la cucina del paese
  }

  const response = await getData(searchQuery);
  
  if (response.error != -1) {
    // Se la ricerca specifica fallisce, prova con quella base per non bloccare il gioco
    if (mode === 1) return getCountryInfo(countryName, 0);
    return "Errore nel caricamento del fatto da Wikipedia.";
  }
  
  // Pulisce il testo e censura il nome del paese
  return sanitizeString(response.fact, getCountryBlacklist(countryName));
}

/** 
 * Effettua la chiamata HTTP all'API REST di Wikipedia.
 */
export async function getData(/** @type string */ query) {
  let data = { error: -1, response: [] };
  try {
    const url = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(query)}&limit=1`;
    const response = await fetch(url);

    if (!response.ok) {
      data.error = response.status;
      return data;
    }

    const result = await response.json();
    data.response = result;
  } catch (error) {
    data.error = error.message;
  }

  // Estrae l'estratto (excerpt) della pagina se disponibile
  let toReturn = {
    error: data.error,
    fact: (data.response.pages && data.response.pages.length > 0) ? data.response.pages[0].excerpt : "Nessuna informazione trovata."
  };
  return toReturn;
}

/** 
 * Funzione di utilità per pulire la stringa (rimozione tag e censura nomi).
 */
export function sanitizeString(/** @type string */ stringToClear, /** @type Array */ keyWordBlacklist) {
  stringToClear = trimTags(stringToClear);
  stringToClear = censoreName(stringToClear, keyWordBlacklist);
  return stringToClear;
}

/** 
 * Rimuove i tag HTML (es. <span>) che Wikipedia restituisce a volte negli estratti.
 */
export function trimTags( /** @type string*/str) {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

/** 
 * Sostituisce il nome del paese con degli asterischi (***) all'interno del testo.
 */
export function censoreName(/** @type string*/ value, /** @type Array*/ names) {
  if (!value) return "";
  let censoredValue = value;
  for (let n of names) {
    if (n.length < 3) continue; 
    censoredValue = censoredValue.replace(new RegExp(n, "gi"), "***");
  }
  return censoredValue;
}

