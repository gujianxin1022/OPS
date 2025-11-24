import { getLanguageList } from "@/api/notificationManagement";
import { onMounted, ref } from "@vue/composition-api";

// 获取国际化字段
export const handleLanguageList = async () => {
  const languageList = ref(null)
  const getLangList = async () => {
    const { data: { code, data }, status } = await getLanguageList()
    if (code !== 200 || status !== 200) return Promise.reject()
    languageList.value = data
  }
  onMounted(() => {
    getLangList()
  })
  return {
    languageList
  }
}
