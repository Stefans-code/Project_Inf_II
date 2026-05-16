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
 * @param {number} mode - 0 per World, 1 per Food, 2 per Europe.
 * @returns {Array} La lista dei nomi dei paesi.
 */
export function getCountries(mode) {
  if (mode === 2) return EUROPEAN_COUNTRIES;
  return ALL_COUNTRIES;
}

/** 
 * BLACKLIST PAROLE: Restituisce una lista di parole da censurare (nomi paesi, lingue) 
 * per non rendere il quiz troppo facile.
 * @param {string} name - Il nome del paese corrente.
 * @returns {Array} La lista di parole da oscurare.
 */
export function getCountryBlacklist(/** @type string */ name) {
  return [name, "italian", "italy", "france", "germany", "spain", "japan", "brazil", "republic", "kingdom", "state", "country"];
}

/** 
 * RECUPERO INFO PAESE: Ottiene un estratto da Wikipedia per il paese specificato.
 * @param {string} countryName - Il nome del paese da cercare.
 * @param {number} mode - La modalità di gioco (se 1, cerca la cucina).
 * @returns {Promise<string>} Il testo della curiosità già pulito e censurato.
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
 * CHIAMATA API WIKIPEDIA: Effettua la richiesta HTTP alle API REST di Wikipedia.
 * @param {string} query - La stringa di ricerca.
 * @returns {Promise<Object>} Un oggetto contenente l'estratto della pagina o un errore.
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
/** 
 * PULIZIA DATI WIKIPEDIA: Rimuove tag HTML e decodifica le entità comuni (apostrofi, ecc.)
 * per garantire una lettura pulita del fatto nel quiz.
 */
export function trimTags( /** @type string*/str) {
  if (!str) return "";
  return str
    .replace(/<[^>]*>/g, '')          // Rimuove i tag HTML (es. <span>)
    .replace(/&nbsp;/g, ' ')         // Converte gli spazi non-breaking
    .replace(/&#039;/g, "'")         // Decodifica l'apostrofo (fondamentale per i nomi inglesi)
    .replace(/&amp;/g, "&")          // Decodifica la &
    .replace(/&quot;/g, '"')         // Decodifica le virgolette
    .trim();
}

/** 
 * CENSURA NOMI: Sostituisce il nome del paese con degli asterischi (***) nel testo.
 * @param {string} value - Il testo originale.
 * @param {Array} names - La lista di nomi da censurare.
 * @returns {string} Il testo censurato.
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

/** 
 * ALGORITMO FISHER-YATES: Un metodo equo (unbiased) per mescolare un array.
 * @param {Array} array - L'array da mescolare.
 * @returns {Array} L'array mescolato.
 */
export function shuffleArray(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

