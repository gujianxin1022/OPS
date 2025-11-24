<template>
  <div class="clearfix completed-task-result">
    <el-row
      class="row"
      :gutter="20"
      v-for="(item, index) in data.filedRespList"
      :key="index"
    >
      <el-col :span="isEn ? 8 : 5" class="label">{{ item.title }}:</el-col>
      <el-col :span="isEn ? 16 : 19" class="value">
        <span>{{ item.value }}</span>
      </el-col>
    </el-row>
    <div
      class="pt10"
      style="border-top: 1px solid #e6ebf5"
      v-if="data.associatedRecord === 1"
    >
      <el-row class="row" :gutter="20">
        <el-col :span="isEn ? 8 : 5" class="label"
          >{{ $t("沟通方式") }}:</el-col
        >
        <el-col span="16" class="value">
          <span>{{
            columnMap.completionStatus[data.contactInformation - 0]
          }}</span>
        </el-col>
        <el-col :span="isEn ? 8 : 5" class="label"
          >{{ $t("沟通记录") }}:</el-col
        >
        <el-col :span="isEn ? 16 : 19" class="value">
          <div
            class="image__preview"
            v-if="data.imageRecordList && data.imageRecordList.length"
          >
            <el-image
              v-for="item in srcList"
              :key="item"
              style="width: 100px; height: 100px; margin-right: 4px"
              :src="item"
              :preview-src-list="srcList"
            >
            </el-image>
          </div>
          <div
            class="record__preview"
            v-if="data.contactRecordList && data.contactRecordList.length"
          >
            <div v-for="msg in data.contactRecordList" :key="msg.msgTime">
              <Message :msg="msg" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  onMounted,
  ref,
  reactive,
  computed,
  watch,
} from "@vue/composition-api";
import Message from "./record/msgType/Message.vue";

export default {
  components: {
    Message,
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    const columnMap = reactive({
      completionStatus: {
        1: root.$t("打电话"),
        2: root.$t("发消息"),
        3: root.$t("发邮件"),
      },
    });
    const srcList = ref([]);
    onMounted(() => {
      props.data.imageRecordList.forEach((e) => {
        srcList.value.push(e.fileUrl);
      });
      if (props.data.contactRecordList?.length) {
        props.data.contactRecordList.sort(function (a, b) {
          return a.msgTime - b.msgTime;
        });
      }
    });
    return {
      isEn,
      data: props.data,
      columnMap,
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
    .value {
      margin-bottom: 10px;
    }
  }
}
</style>
