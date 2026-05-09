// Liste dei paesi integrate per evitare file esterni
const ALL_COUNTRIES = [
  "Italy", "France", "Germany", "Spain", "Japan", "Brazil", "Canada", "Australia", 
  "Argentina", "Egypt", "India", "China", "Mexico", "Norway", "Sweden", "Thailand",
  "Greece", "Portugal", "Netherlands", "Switzerland", "Austria", "Belgium", "Denmark",
  "Finland", "Poland", "Turkey", "Russia", "South Africa", "South Korea", "Vietnam",
  "Indonesia", "Peru", "Chile", "Colombia", "Morocco", "Kenya", "New Zealand", "Ireland"
];

const EUROPEAN_COUNTRIES = [
  "Italy", "France", "Germany", "Spain", "Norway", "Sweden", "Greece", "Portugal", 
  "Netherlands", "Switzerland", "Austria", "Belgium", "Denmark", "Finland", "Poland", 
  "Ireland", "Czech Republic", "Hungary", "Romania", "Bulgaria", "Slovakia", "Croatia"
];

export function getCountries(mode) {
  if (mode === 2) return EUROPEAN_COUNTRIES; // Solo Europa
  return ALL_COUNTRIES; // Mondo o Cibo
}

export function getCountryBlacklist(/** @type string */ name) {
    return [name, "italian", "italy", "france", "germany", "spain", "japan", "brazil", "republic", "kingdom", "state", "country"];
}

/** 
 * Recupera informazioni su un paese in base alla modalità 
 * mode: 0 = Curiosità, 1 = Cibo, 2 = Europa
 */
export async function getCountryInfo(/** @type string */ countryName, mode = 0) {
  let searchQuery = countryName;
  if (mode === 1) {
    searchQuery = `${countryName} cuisine`; // Cerca la cucina per la modalità cibo
  }

  const response = await getData(searchQuery);
  
  if (response.error != -1) {
    // Se la ricerca specifica fallisce (es. cucina), prova con la ricerca base
    if (mode === 1) return getCountryInfo(countryName, 0);
    return "Errore nel caricamento del fatto da Wikipedia.";
  }
  
  return sanitizeString(response.fact, getCountryBlacklist(countryName));
}

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

  let toReturn = {
    error: data.error,
    fact: (data.response.pages && data.response.pages.length > 0) ? data.response.pages[0].excerpt : "Nessuna informazione trovata su Wikipedia."
  };
  return toReturn;
}

/** @returns string */
export function sanitizeString(/** @type string */ stringToClear, /** @type Array */ keyWordBlacklist) {
  stringToClear = trimTags(stringToClear);
  stringToClear = censoreName(stringToClear, keyWordBlacklist);
  return stringToClear;
}

export function trimTags( /** @type string*/str) {
  if (!str) return "";
  // Rimuove tag HTML come <span> e rimpiazza entità comuni
  return str.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export function censoreName(/** @type string*/ value, /** @type Array*/ names) {
  if (!value) return "";
  let censoredValue = value;
  for (let n of names) {
    if (n.length < 3) continue; // Evita di censurare lettere singole
    censoredValue = censoredValue.replace(new RegExp(n, "gi"), "***");
  }
  return censoredValue;
}

export function print(...value){
  console.log(...value);
}
