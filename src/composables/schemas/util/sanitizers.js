

export const countrySanitizer =  (location) => {
    if(!location) return location

    if(location['@type'] === 'Country' && location.identifier)
      return { identifier: location.identifier, url: location.url, '@type': location['@type'] }

    return location
  }


// export const locationCountrySanitizer = {
//   'location': (location ) => {
//     if(!location) return location

//     if(location['@type'] === 'Country' && location.identifier)
//       return { identifier: location.identifier, url: location.url, '@type': location['@type'] }

//     return location
//   }
// }