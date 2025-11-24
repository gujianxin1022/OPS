import Vue from 'vue'
import VueI18n from '@lingoace/vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import store from '../../store/index'

Vue.use(VueI18n)

const DEFAULT_LANG = 'zh'
const LOCALE_KEY = 'localeLanguage'

const locales = {
  zh: {
    ...require('./messages/zh.json'),
    ...zhLocale
  },
  en: {
    ...require('./messages/en.json'),
    ...enLocale
  },
}

const i18n = new VueI18n({
  locale: DEFAULT_LANG,
  messages: locales,
  silentTranslationWarn: true,
})
export const setup = lang => {
  if (lang === undefined) {
    lang = window.localStorage.getItem(LOCALE_KEY)
  }

  if (locales[lang] === undefined) {
    lang = DEFAULT_LANG
  }
  window.localStorage.setItem(LOCALE_KEY, lang)

  Vue.config.lang = lang
  i18n.locale = lang
  setTimeout(() => store.commit('CHANGE_LANG', lang))
}
var lang = navigator.language || navigator.userLanguage;
lang = lang.substr(0, 2);
if (lang != 'zh') {
  lang = 'en';
}
const langArr = navigator.language.split('')
const localeLang = window.localStorage.getItem(LOCALE_KEY)
langArr.length = 2

setup(localeLang ? localeLang : langArr.join('') == 'en' ? langArr.join('') : null)
export default i18n
