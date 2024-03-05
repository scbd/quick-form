
import { string, number, date, addMethod  } from 'yup'

import { computed      } from 'vue'
import { DateTime      } from 'luxon'
import   isFunction      from 'lodash.isfunction'
import   isPlainObject   from 'lodash.isplainobject'


addMethod(date, 'startLessThanEndByDay', startLessThanEndByDay )


export function readFieldRules({ props, t, computedLabel }){
  const needsComputing = props?.options?.rules?.startLessThanEndByDay || props?.options?.rules?.computed

  return needsComputing? computed(()=>readRules({ props, t, computedLabel })) : readRules({ props, t, computedLabel })
}

function readRules ({ props, t, computedLabel }) {

  const getMsg      = getMsgFunc(t, computedLabel)
  const rules       = (props?.options?.rules || undefined)
  const isUndefined = typeof rules === 'undefined'

  if(isFunction(rules) || isUndefined) return rules // passed override
  if(!isPlainObject(rules)) return undefined

  const isString  = !rules.type || rules.type === 'text'
  const isNumber  = rules.type === 'number'
  const isDate    = rules.type === 'date'

  if(!isString && !isNumber && !isDate) throw new Error('field type not known: must be text or number or Date')

  let rule = isNumber? number() : isDate? date() : string()
  

  if(rules.format === 'url') rule = rule.url(getMsg('url')).max(256, getMsg('max', 256))
  if(rules.format === 'email') rule = rule.email(getMsg('email')).test(getEmailTest()).max(256, getMsg('max', 256))
  if(rules.format === 'uuid') rule = rule.uuid(getMsg('uuid'))

  
  if(!isDate && rules.max) rule = rule.max(rules.max, getMsg(isString? 'max': 'maxN', rules.max))
  if(!isDate && rules.min) rule = rule.min(rules.min, getMsg(isString? 'min': 'minN', rules.man))


  if(isDate && rules.max) rule = rule.max(rules.max, getMsg('dateMin', rules.max))
  if(isDate && rules.min) rule = rule.min(rules.min, getMsg('dateMax', rules.min))

  if(rules.lessThan) rule = rule.lessThan(rules.lessThan, getMsg('lessThan', rules.lessThan))
  if(rules.moreThan) rule = rule.moreThan(rules.moreThan, getMsg('moreThan', rules.moreThan))

  if(rules.required) rule = rule.required(getMsg('required'))

  if(isDate) rule = rule.nullable().transform(v => (v instanceof Date && !isNaN(v) ? v : null))

  if(isDate && rules.startLessThanEndByDay)
    rule = rule.startLessThanEndByDay(rules.startLessThanEndByDay, getMsg('startLessThanEndByDay'), props )


  return rule

}
const validationMessageMap = new Map([
  [ 'required'           , 'is a required field'                                ],
  [ 'max'                , 'exceeds the specified character limit: '            ],
  [ 'min'                , 'does not meet the specified character limit: '      ],
  [ 'maxN'               , 'number must not exceed: '                           ],
  [ 'minN'               , 'number must be at least: '                          ],
  [ 'integer'            , 'number must be an integer'                          ],
  [ 'lessThan'           , 'must be less than: '                                ],
  [ 'moreThan'           , 'must be more than: '                                ],
  [ 'url'                , 'must be a valid url format'                         ],
  [ 'email'              , 'must be a valid email format'                       ],
  [ 'uuid'               , 'must be a valid uuid format'                        ],
  [ 'dateMin'            , 'date must be greater than or equal to: '            ],
  [ 'dateMax'            , 'date must be less than or equal to: '               ],
  [ 'startLessThanEndByDay', 'must be greater than the start by at least one day' ]
])

export function getMsgFunc(t, computedLabel){
  const label = computedLabel.value

  return (rule, value = '') => `${label} ${t(validationMessageMap.get(rule))} ${value}`
}


function startLessThanEndByDay(startName, msg, props){
  return (v) => {
    const start = props.formCtx.values[startName]? DateTime.fromISO(props.formCtx.values[startName]) : undefined
    const end   = v? DateTime.fromISO(v) : undefined

    if(!start || !end) return true

    const diffDays = end.diff(start, 'days')
    const { days } = diffDays.toObject()

    return days > 0? true : msg
  }
}

function getEmailTest(){
  return {
    name: 'email-fix',
    skipAbsent: true,
    test(value, ctx) {
      if (value.startsWith('.')) 
        return ctx.createError({ message: 'Email cannot start with a .' })

      return true
    }
  }
}