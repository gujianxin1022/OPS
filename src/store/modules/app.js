import { setStorage, getStorage } from '@/utils/handleStorage'
import styles from '../../styles/variables.scss'

const app = {
  state: {
    // 侧边栏
    sidebar: {
      opened: !+getStorage('sidebarStatus'), // 侧边栏是否打开
      withoutAnimation: false // 用于优化手动改变屏幕宽度的时候侧边栏的过渡效果
    },
    themeColor: getStorage('theme') || styles.customPrimaryColor, // 主题颜色
    // 设备是桌面还是手机
    device: 'desktop',
    // 页面头部文案
    pageTitle: '',
    currentLang: getStorage('localeLanguage')
  },
  mutations: {
    // 切换侧边栏状态
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        setStorage('sidebarStatus', 1)
      } else {
        setStorage('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    // 开启侧边栏
    OPEN_SIDEBAR: (state, withoutAnimation) => {
      setStorage('sidebarStatus', 0)
      state.sidebar.opened = true
      state.sidebar.withoutAnimation = withoutAnimation
    },
    // 关闭侧边栏
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      setStorage('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    // 切换设备信息
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    // 切换主题颜色
    CHANGE_THEME_COLOR(state, themeColor) {
      state.themeColor = themeColor
      setStorage('theme', themeColor)
    },
    // 设置页面头部文案
    SET_PAGE_TITLE(state, pageTitle) {
      if(pageTitle!= '') {
        state.pageTitle = pageTitle
      }
    },
    // 设置版本号
    SET_VERSION(state, version) {
      state.version = version
    },
    // 改变语言
    CHANGE_LANG(state, lang) {
      state.currentLang = lang
    }
  }
}

export default app
