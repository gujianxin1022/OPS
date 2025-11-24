<script>
import { onMounted, computed,watch } from "@vue/composition-api";
export default {
  name: "operationConfiguration",
  props: {
    iframeUrl: String
  },
  setup(props, { root }) {
    onMounted(() => {
      const oIframe = document.getElementById("bdIframe");
      const deviceWidth = document.documentElement.clientWidth;
      const deviceHeight = document.documentElement.clientHeight;
      oIframe.style.width = Number(deviceWidth) - 215 + "px"; //数字是页面布局宽度差值
      oIframe.style.height = Number(deviceHeight) - 115 + "px"; //数字是页面布局高度差
    });
    const language=computed(()=>{
      return root.$store.getters.currentLang
    })
    const isHttps = computed(() => `${process.env.VUE_APP_GROWTH_URL}${props.iframeUrl}?token=Bearer ${JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
      }&language=${language.value}&id=${JSON.parse(window.localStorage.getItem("userInfo")).id}&username=${JSON.parse(window.localStorage.getItem("userInfo")).username}`
    )
    return () => (
      <div class="referralAudit_box">
        <iframe id="bdIframe" src={isHttps.value} frameborder="0" scrolling="auto"></iframe>
      </div >
    );
  }
};
</script>
<style lang="scss" scoped>
.referralAudit_box {
  overflow: hidden;
  #bdIframe {
    width: 100%;
    height: auto;
    border: medium none;
    border: 5px solid #fff;
  }
}
</style>
