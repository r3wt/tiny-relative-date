const getTranslationsFor = (locale) => {
  if (typeof locale === 'string') {
    // Name of an existing locale
    return require(`../translations/${locale}`)
  }

  // Custom translation object
  return locale
}

const calculateDelta = (now, date) => Math.round(Math.abs(now - date) / 1000)

export default function relativeDateFactory (locale) {
  const translations = getTranslationsFor(locale)

  return function relativeDate (date, now = new Date()) {
    if (!(date instanceof Date)) {
      date = new Date(date)
    }

    let delta = null

    const minute = 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const month = day * 30
    const year = day * 365

    delta = calculateDelta(now, date)

    if (delta > day && delta < week) {
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
      delta = calculateDelta(now, date)
    }

    const translate = (translatePhrase, timeValue) => {
      let key

      if (translatePhrase === 'just_now') {
        key = translatePhrase
      } else if (now >= date) {
        key = `${translatePhrase}_ago`
      } else {
        key = `${translatePhrase}_from_now`
      }

      const translation = translations[key]

      if (typeof translation === 'function') {
        return translation(timeValue)
      }

      return translation.replace('{{time}}', timeValue)
    }

    switch (false) {
      case !(delta < 30):
        return translate('just_now')

      case !(delta < minute):
        return translate('seconds', delta)

      case !(delta < 2 * minute):
        return translate('a_minute')

      case !(delta < hour):
        return translate('minutes', Math.floor(delta / minute))

      case Math.floor(delta / hour) !== 1:
        return translate('an_hour')

      case !(delta < day):
        return translate('hours', Math.floor(delta / hour))

      case !(delta < day * 2):
        return translate('a_day')

      case !(delta < week):
        return translate('days', Math.floor(delta / day))

      case Math.floor(delta / week) !== 1:
        return translate('a_week')

      case !(delta < month):
        return translate('weeks', Math.floor(delta / week))

      case Math.floor(delta / month) !== 1:
        return translate('a_month')

      case !(delta < year):
        return translate('months', Math.floor(delta / month))

      case Math.floor(delta / year) !== 1:
        return translate('a_year')

      default:
        return translate('over_a_year')
    }
  }
}
