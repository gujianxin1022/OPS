<template>
  <div class="clearfix completed-task-result">
    <el-row class="row" v-for="(item, index) in srcList" :key="index">
      <el-col :span="5" class="label">{{ item.itemName }}</el-col>
      <el-col :span="14" class="labelContent" style="color: #f17575">{{
        item.itemContent
      }}</el-col>
      <el-col :span="5" class="value">
        <span style="color: #08af45" v-if="item.itemState">{{
          $t("deviceTestPass")
        }}</span>
        <span style="color: #f17575" v-else>{{ $t("异常") }}</span>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { computed } from "@vue/composition-api";

export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    let srcList = [
      {
        itemName: root.$t("网络检测"),
        itemContent: props.data.netCheckPass
          ? ""
          : `${root.$t("延迟")}: ${props.data.netDelayms}${props.data.netDelayms.indexOf("ms") >= 0 ? "" : "ms"}`, // | ${root.$t( "上传速度" )}: ${props.data.netUpKbps}kbps | ${root.$t("下载速度")}: ${ props.data.netDownKbps }kbps
        itemState: props.data.netCheckPass,
      },
      {
        itemName: root.$t("摄像头检测"),
        itemContent: "",
        itemState: props.data.cameraCheckPass,
      },
      {
        itemName: root.$t("麦克风检测"),
        itemContent: "",
        itemState: props.data.micCheckPass,
      },
      {
        itemName: root.$t("声音检测"),
        itemContent: "",
        itemState: props.data.speakerCheckPass,
      },
    ];

    // PC-Web
    if (props.data.app == 6) {
      srcList.push({
        itemName: root.$t("浏览器版本"),
        itemContent: props.data.browserCheckPass ? "" : props.data.model,
        itemState: props.data.browserCheckPass,
      });
    } else {
      srcList.push({
        itemName: root.$t("设备操作系统"),
        itemContent: "",
        itemState: true,
      });
    }
    return {
      isEn,
      data: props.data,
      srcList,
    };
  },
};
</script>
<style lang="scss" scoped>
.completed-task-result {
  // height: 600px;
  overflow-y: scroll;
  .row {
    .label {
      text-align: right;
      margin-bottom: 10px;
    }
    .labelContent {
      text-align: center;
      margin-bottom: 10px;
    }

    .value {
      margin-bottom: 10px;
    }
  }
}
</style>
