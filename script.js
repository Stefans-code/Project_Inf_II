
//start test area
 // getCountryInfo("italy").finally(it => {
 //     // is undefined for unknown reasons
 //    // print(it.fact)
 //  })

// end test area



// needs database
function getCountryBlacklist(/** @type string */ name) {
    return [name, "italian"]
}

/** @returns string */
async function getCountryInfo(/** @type string */ countryName) {
  await getData(countryName).then(response => {
    if (response.error != -1) return response.error.toString
    else return sanitizeString(response.fact, getCountryBlacklist(countryName)) 
  })
}

async function getData(/** @type string */ countryName) {
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
    fact: data.response.pages[0].excerpt
  }
  return toReturn  
}

function getURL(/** @type string */ countryName) {
  return `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${countryName}&limit=1`;
}



/** @returns string */
function sanitizeString(/** @type string */ stringToClear, /** @type Array */ keyWordBlacklist) {
  stringToClear = trimTags(stringToClear)
  stringToClear = censoreName(stringToClear, keyWordBlacklist)
  return stringToClear
}

/**
  since wikimedia api are weird, the excerpt containg the <span> tags, so here we remove them
  @returns string
 */
function trimTags( /** @type string*/str) {
  while (str.includes("<") && str.includes(">")) { // continue untile there are no more tags left
    let part1 = str.substring(0, str.indexOf("<")) //gets the part of string before the <
    let part2 = str.substring(str.indexOf(">") + 1, str.length -1) //gets the part of string after the >
    str = part1 + part2 // merge them, replacing the original string, thus removing everyithing between < and >
  }
  return str // the original string gets modified, but gets returned anyway because it's  handy
}

/** replaces al the values of `name` in `value` with *** */
function censoreName(/** @type string*/ value, /** @type Array*/ name) {
  for (n of name) {
    // weird regex spells were needed because Javascript is Javascript and needed to rembember why I hate it
    value = value.replace(new RegExp(n, "gi"), "***")
  }
  return value
}


function print(...value){
  console.log(value)
}
function print(value){
  console.log(value)
}
function printAndReturn(value){
  console.log(value)
  return value
}

