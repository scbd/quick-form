import   getMessages                from './locales/index'

const additionalOptions = [
  {

    identifier : 'headliner',
    name       : 'Headliner',
    adminOnly  : 'true'
  },
  {

    identifier : 'cop-presidencies',
    name       : 'COP Presidency'
  },
  {
    identifier : 'individual',
    name       : 'Individual'

  }
]

export default {
  id         : 'idb-message-form',
  apiUrl     : 'https://api.cbd.int/api/v2023/idb/messages',
  accountsUrl: 'https://accounts.cbd.int',
  admins     : [ 'Administrator', 'idb-admin' ],
  sitekey    : '6LfM7rYaAAAAAB8Xc3Y0RQbnMb8zCerG7MKFi8Ep',
  debug      : false,
  rows: [
    {  columns: [ { name: 'useAccount',                  is: 'UseAccount',  options: { uncheckedValue: false, checkedValue: true, map: { email: 'creator.email', name: 'creator.name', organization: 'creator.worksFor.name', country: 'creator.worksFor.country'  }} } ] },
    {  columns: [ { name: 'creator.email',              is: 'TextInput',   options: { type: 'email', rules: { format: 'email', required: true } } }  ] },
    {  columns: [ { name: 'creator.name',               is: 'LString',     options: { rules: { required: true, max: 100 } } } ] },
    {  columns: [ { name: 'creator.worksFor.name',      is: 'LString',     options: { rules: { max: 100 } } } ] },
    {  columns: [ { name: 'creator.jobTitle',           is: 'LString',     options: { rules: { max: 100 } } } ] },
    {  columns: [ { name: 'creator.worksFor.country',   is: 'ChmSelect',   options: { type: 'countries',  rules: { required: true } }  }  ] },
    {  columns: [ { name: 'name',                       is: 'LString',     options: { adminOnly: true, rules: { max: 100 } } } ] },
    {  columns: [ { name: 'commentText',                is: 'LStringArea', options: { rows: 3, rules: { max: 300 } } } ] },
    {  columns: [ { name: 'image',                      is: 'Attachments', options: { type: 'both', multiple: false, imageOnly: true  } } ] },
    {  columns: [ { name: 'attachments',                is: 'Attachments', options: { type: 'both', multiple: true } } ] },
    {  columns: [ { name: 'type',                       is: 'ChmSelect',   options: { type: 'allOrgTypes', additionalOptions,  rules: { required: true } }  }  ] },
  ],
  getMessages
}

