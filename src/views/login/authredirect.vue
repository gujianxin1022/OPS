<template>
  <div />
</template>

<script>
export default {
  name: 'Authredirect',
  created() {
    const hash = window.location.search.slice(1)
    // 测试window.opener获取不到
    // window.opener.location.href = window.location.origin + '/login#' + hash
    window.location.href = window.location.origin + '/login#' + hash
    window.close()
  }
}
</script>
