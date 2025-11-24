<template>
  <div
    v-loading="loading"
    class="log-container"
    id="emailTemplate"
  ></div>
</template>
<script>
import { defineComponent, onMounted, ref } from '@vue/composition-api'
export default defineComponent({
  setup (_, { root }) {
    const loading = ref(false)
    onMounted(() => {
      loading.value = true
      const { uri } = root.$route.query
      const a = `${process.env.VUE_APP_BASE_API}${decodeURIComponent(uri)}`
      console.log(a)
      root.$Axios({
        method: "get",
        headers: {
          "Content-type": "multipart/form-data",
          authorization: `Bearer ${JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
            }`
        },
        url: `${process.env.VUE_APP_BASE_API}${decodeURIComponent(uri)}`,
      }).then(({ data }) => {
        document.getElementById('emailTemplate').innerHTML = data
        loading.value = false
      }).catch(() => {
        document.getElementById('emailTemplate').innerText = 'No Data'
        loading.value = false
      })
    })
    return {
      loading
    }
  },
})
</script>
<style lang="scss" scoped>
</style>
