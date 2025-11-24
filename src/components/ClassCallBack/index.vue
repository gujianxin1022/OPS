<template>
  <div class="class-call-back-wrap">
    <el-dialog
      :before-close="close"
      :close-on-click-modal="false"
      :title="$t('回放链接')"
      :visible.sync="show"
      append-to-body
    >
      <div class="call-back-inner" v-if="urlList">
        <div v-for="(item, index) in urlList" :key="index">
          <el-button @click="handleOpenUrl(item)" type="text" class="mt10">
            {{ $t("主讲回放链接") }} {{ index + 1 }}
          </el-button>
        </div>
        <div v-for="(item, index) in ccUrlList" :key="index">
          <el-button @click="handleOpenUrl(item)" type="text" class="mt10">
            {{ $t("视频关单回放链接") }} {{ index + 1 }}
          </el-button>
        </div>
      </div>
      <div class="call-back-inner" v-else>
        <span>{{ $t("no feedback yet") }}</span>
      </div>
      <el-dialog
        width="60vw"
        append-to-body
        :title="$t('视频')"
        :visible.sync="videoVisible"
        :before-close="handleVideoDialogClose"
      >
        <video
          v-if="videoSrc"
          :src="videoSrc"
          controls
          controlslist="nodownload"
          disablePictureInPicture
          width="100%"
          oncontextmenu="return false"
        />
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import { getStorage } from "@/utils/handleStorage";
export default {
  props: {
    show: {
      default: false,
      type: Boolean,
    },
    currentCallBackId: {
      default: "",
      type: String,
    },
    classType: {
      default: 1,
      type: Number,
    },
  },
  data() {
    return {
      urlList: [],
      ccUrlList: [] /* 销售视频关单回放链接 */,
      videoVisible: false,
      videoSrc: null,
      token: JSON.parse(getStorage("userInfo")).jwtToken,
    };
  },
  watch: {
    async show(newData) {
      if (newData) {
        this.urlList = [];
        this.ccUrlList = [];
        await this.reqReplay(5);
        await this.reqReplay(6);
      }
    },
  },
  methods: {
    close() {
      this.urlList = [];
      this.$emit("close");
    },
    handleVideoDialogClose() {
      this.videoVisible = false;
      this.videoSrc = null;
    },
    async handleOpenUrl({ replayMP4Url, replayNormalUrl }) {
      if (replayMP4Url) {
        this.videoSrc = replayMP4Url;
        this.videoVisible = true;
        return;
      }
      if (replayNormalUrl) {
        window.open(replayNormalUrl, "__blank");
      }
    },
    async reqReplay(roleType /* ops用户固定传参为5;CC关单固定传参为6 */) {
      const res = await this.$Api.base.getClassRoomReplay(
        this.classType,
        this.currentCallBackId,
        JSON.parse(window.localStorage.getItem("userInfo")).id,
        roleType /* ops用户固定传参为5 */
      );
      const { replayNormalUrl, replayMP4Url, virtualclassTypeId } = res;
      let list = [];
      if (replayMP4Url?.length) {
        list = replayMP4Url.map((v) => ({
          replayMP4Url: v,
          replayNormalUrl: null,
        }));
        roleType === 5 ? (this.urlList = list) : (this.ccUrlList = list);
        return;
      }
      if (replayNormalUrl?.length) {
        list = replayNormalUrl.map((v) => ({
          replayMP4Url: null,
          replayNormalUrl:
            virtualclassTypeId ===
            3 /* 自研教室回放（virtualclassTypeId：3）需要增加参数新标签页面打开回放 */
              ? v + `?business=ops&token=${this.token}`
              : v,
        }));
        roleType === 5 ? (this.urlList = list) : (this.ccUrlList = list);
        return;
      }
      // roleType === 5 ? (this.urlList = null) : (this.ccUrlList = null);
    },
  },
};
</script>
<style lang="scss" scoped>
.call-back-inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
