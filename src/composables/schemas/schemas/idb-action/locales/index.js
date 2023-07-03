export const en = import('./en.js')

const defaultModule = (({ default:d }) => d) 

export default async (lang) => {
  const languages = ['en']

  if(!languages.includes(lang)) return {}

  if(lang === 'en') return en.then(defaultModule)//.then((d) => ({ [lang]: d }))
}
