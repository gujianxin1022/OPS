<template>
  <div>loading...</div>
</template>

<script>
import { getIMConfig } from "@/components/CustomerService/api.js";
export default {
  created() {
    // 从接口获取 腾讯IM url地址，并跳转
    const jsonStr = localStorage.getItem("userInfo");
    const userInfo = jsonStr ? JSON.parse(jsonStr) : {};
    const userId = userInfo.id;
    if (userId) {
      getIMConfig(userId).then(config => {
        const webImUrl = config.webImUrl;
        if (webImUrl) {
          window.location.replace(webImUrl);
        }
      });
    }

  },
}
</script>

<style></style>
