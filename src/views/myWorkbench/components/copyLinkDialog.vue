<template>
  <el-dialog
    :title="$t('复制专属链接')"
    class="link-dialog"
    :visible.sync="visible"
    :before-close="closeDialog"
    width="40%"
  >
    <div v-loading="linkLoading">
      <p>{{ referrerUrl }}</p>
      <div class="btn">
        <el-button type="primary" @click="onCopyLink(referrerUrl)">
          {{ $t("复制专属链接") }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  onMounted,
  reactive,
  computed,
  ref,
  defineComponent,
  toRefs,
} from "@vue/composition-api";
import { copyLink } from "@/utils/file";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    currentItem: {
      type: Object,
      default: {},
    },
    lang: {
      type: String,
      default: null,
    },
  },
  setup(props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const linkLoading = ref(false);
    const posterInfo = reactive({
      username: "",
      registration: "",
      referrerUrl: "",
      avatarImgUrl: "",
    });

    const closeDialog = () => {
      emit("update:visible", false);
    };
    const getReferLink = async (item) => {
      linkLoading.value = true;
      posterInfo.referrerUrl = "";
      const requestApi = root.$Api.workBench.getChannel(
        item.parentUserId,
        "ops",
        props.lang,
        "link"
      );
      const {
        status,
        data: { code, data },
      } = await requestApi;
      if (status !== 200 || code !== 200) return Promise.reject();
      let context = {
        area: "", //若没有值则传空字符串
        lan: currentLang.value, //语言：zh中文，en英文；默认传zh
        appversion: "", //若没有值则传空字符串
        lp: "", //若没有值则传空字符串
        tag: "", //若没有值则传空字符串
        ug: "", //若没有值则传空字符串
      };
      root.$Api.workBench
        .getPostInfo({
          url: `${process.env.VUE_APP_SHORTCHAIN_API}/api/get-url`,
          method: "POST",
          httpHeaders: null, // 家长用户的token
          body: {
            loc: "ops/custom/copylink",
            subject: props.lang,
            userdata: { userId: item.parentUserId },
            channel: data,
            context,
          },
        })
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            posterInfo.referrerUrl = res.data.data.url.content;
          }
        })
        .finally(() => (linkLoading.value = false));
    };

    const onCopyLink = async (link) => {
      await copyLink(link)
        .then(
          () => {
            root.$notify({
              message: root.$t("复制成功"),
              type: "success",
            });
          },
          () => {
            root.$notify({
              message: root.$t("复制失败"),
              type: "error",
            });
          }
        )
        .finally(() => closeDialog());
    };

    onMounted(() => getReferLink(props.currentItem));

    return {
      linkLoading,
      ...toRefs(posterInfo),
      onCopyLink,
      closeDialog,
    };
  },
});
</script>

<style>
.link-dialog .btn {
  text-align: center;
  margin-top: 40px;
}
</style>
