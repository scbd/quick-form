import { countrySanitizer } from '../../util/sanitizers'
import   getMessages                from './locales/index'

const world =    { "@context": "https://schema.org", "@type": "Place", identifier: '5D13EC43-F3E0-415E-AF67-62CCC85899AF', name: { "en": "Global", "es": "Mundo", "ar": "عالمي", "ru": "Глобальный уровень"} }

export default {
  id         : 'idb-action-form',
  apiUrl     : 'https://api.cbd.int/api/v2023/idb/actions',
  accountsUrl: 'https://accounts.cbd.int',
  admins     : [ 'Administrator', 'idb-admin' ],
  sitekey    : '6LfM7rYaAAAAAB8Xc3Y0RQbnMb8zCerG7MKFi8Ep',
  debug      : false,
  rows: [
    {  columns: [ { name: 'useAccount',                          is: 'UseAccount',  options: { uncheckedValue: false, checkedValue: true, map: { email: 'creator.email', name: 'creator.name', organization: 'creator.worksFor.name' }} } ] },
    {  columns: [ { name: 'startDate',                           is: 'TextInput',   options: { type: 'date',      rules: { type: 'date', required: true } }  }  ] },
    {  columns: [ { name: 'endDate',                             is: 'TextInput',   options: { type: 'date',      rules: { type: 'date', startLessThanEndByDay: 'startDate' } }  }  ] },
    {  columns: [ { name: 'address.country',                     is: 'ChmSelect',   options: { type: 'countries', rules: { required: true } }  }  ] },
    {  columns: [ { name: 'isGlobal',                            is: 'CheckBox',    options: { adminOnly: true, checkedValue: world , uncheckedValue: undefined  } }  ] },
    {  columns: [ { name: 'address.locality',                    is: 'LString',     options: { } } ] },
    {  columns: [ { name: 'creator.worksFor.name',               is: 'LString',     options: { rules: { max: 100, required: true, } } } ] },
    {  columns: [ { name: 'address.hasMap',                      is: 'Attachments', options: { type: 'url', multiple: false, nonImageOnly: true } } ] },
    {  columns: [ { name: 'name',                                is: 'LString',     options: { rules: { required: true, max: 100 } } } ] },
    {  columns: [ { name: 'description',                         is: 'LStringArea', options: { rows: 3, rules: { required: true, max: 500 } } } ] },
    {  columns: [ { name: 'attachments',                         is: 'Attachments', options: { type: 'both', multiple: true } }] },
    {  columns: [ { name: 'creator.email',                       is: 'TextInput',   options: { type: 'email', rules: { format: 'email', required: true } } }  ] },
    {  columns: [ { name: 'creator.name',                        is: 'LString',     options: { rules: { required: true, max: 100 } } } ] },
    {  columns: [ { name: 'image',                               is: 'Attachments', options: { type: 'both', multiple: false, imageOnly: true  } } ] }
  ], 

  getMessages, sanitizers: { 'location': countrySanitizer }
}