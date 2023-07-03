
export const idbAction  = import('./schemas/idb-action/idb-action.js')
export const idbMessage = import('./schemas/idb-message/idb-message.js')

export default async (schemaName) => {


  const schemaNames = ['idb-action', 'idb-message']

  if(!schemaNames.includes(schemaName)) return undefined

  if(schemaName === 'idb-action') return idbAction.then(returnDefaultModule)
  if(schemaName === 'idb-message') return idbMessage.then(returnDefaultModule)
}


function returnDefaultModule({ default: d }){
  return d
}