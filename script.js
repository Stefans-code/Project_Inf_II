//start test area
 // getCountryInfo("italy").finally(it => {
 //     // is undefined for unknown reasons
 //    // print(it.fact)
 //  })

// end test area



// needs database
export function getCountryBlacklist(/** @type string */ name) {
    return [name, "italian"]
}

/** @returns string */
export async function getCountryInfo(/** @type string */ countryName) {
  const response = await getData(countryName)
  if (response.error != -1) return "Errore nel caricamento"
  else return sanitizeString(response.fact, getCountryBlacklist(countryName)) 
}

export async function getData(/** @type string */ countryName) {
  let data = {
    error: -1,
    response: []
  }
  try {
    const response = await fetch(getURL(countryName))

    if (!response.ok) {
      data.error = response.status
      return data
    }

    const result = await response.json()
    data.response = result
  } catch (error) {
    data.error = error.message
  }

  let toReturn = {
    error: data.error,
    fact: (data.response.pages && data.response.pages.length > 0) ? data.response.pages[0].excerpt : "Nessuna informazione trovata"
  }
  return toReturn  
}

export function getURL(/** @type string */ countryName) {
  return `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${countryName}&limit=1`;
}

/** @returns string */
export function sanitizeString(/** @type string */ stringToClear, /** @type Array */ keyWordBlacklist) {
  stringToClear = trimTags(stringToClear)
  stringToClear = censoreName(stringToClear, keyWordBlacklist)
  return stringToClear
}

/**
  since wikimedia api are weird, the excerpt containg the <span> tags, so here we remove them
  @returns string
 */
export function trimTags( /** @type string*/str) {
  if (!str) return ""
  while (str.includes("<") && str.includes(">")) { // continue untile there are no more tags left
    let part1 = str.substring(0, str.indexOf("<")) //gets the part of string before the <
    let part2 = str.substring(str.indexOf(">") + 1, str.length) //gets the part of string after the >
    str = part1 + part2 // merge them, replacing the original string, thus removing everyithing between < and >
  }
  return str
}

/** replaces al the values of `name` in `value` with *** */
export function censoreName(/** @type string*/ value, /** @type Array*/ name) {
  if (!value) return ""
  for (let n of name) {
    value = value.replace(new RegExp(n, "gi"), "***")
  }
  return value
}

export function print(...value){
  console.log(...value)
}

export function printAndReturn(value){
  console.log(value)
  return value
}
