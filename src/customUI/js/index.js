import store from '@/store'

export function $setPageTitle(title) {
  store.commit('SET_PAGE_TITLE', title)
}
