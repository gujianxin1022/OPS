
import store from '@/store'

// 根据权限处理dom
function handlePermission(hasPermission, binding, el) {
  if (!(hasPermission)) {
    if (binding.modifiers.clear) {
      el.parentNode && el.parentNode.removeChild(el)
    } else {
      el.style.display = 'none'
    }
  }
}

function judgePermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.secondMenuIndex.children
  if (value && typeof value === 'string' && value.length > 0) {
    const hasPermission = roles.includes(value)

    handlePermission(hasPermission, binding, el)
  } else if (value && value instanceof Array && value.length > 0) {
    const hasPermission = value.some(role => {
      return roles.includes(role)
    })

    handlePermission(hasPermission, binding, el)
  } else {
    throw new Error(`need roles! Like v-permission="'/sm/order#post'" or v-permission="['/sm/order#post', '/sm/order#get']"`)
  }
}

export default {
  bind(el, binding) {
    setTimeout(() => {
      judgePermission(el, binding)
    }, 300)
  }
}
