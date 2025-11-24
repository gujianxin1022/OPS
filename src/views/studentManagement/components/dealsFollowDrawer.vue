<template>
  <el-drawer
    class="follow-drawer"
    :title="$t('商机Follow')"
    :visible.sync="visible"
    direction="rtl"
    :before-close="handleClose"
    size="40%"
  >
    <div class="content">
      <el-radio-group v-model="activeTab" style="margin-bottom: 30px">
        <el-radio-button :label="TabType.Follow"
          >{{ $t("Follow Up") }}
        </el-radio-button>
        <el-radio-button :label="TabType.TimeLine"
          >{{ $t("时间轴") }}
        </el-radio-button>
      </el-radio-group>
      <div v-if="activeTab === TabType.Follow" v-loading="loadingFollow">
        <el-input
          type="textarea"
          :rows="4"
          :placeholder="$t('添加Follow up')"
          v-model="followContent"
        >
        </el-input>
        <div class="mt10" style="textalign: right">
          <el-button
            :disabled="!followContent"
            type="primary"
            @click="handleSubmit"
            >{{ $t("确认") }}</el-button
          >
        </div>
        <div v-for="(item, i) in followUpList" :key="i">
          <p class="item-title">
            {{
              DateTimeUtils.dateClockTime(item.updateTime || item.createTime)
            }}
            <span class="ml10">{{ item.createUserName }}</span>
          </p>
          <el-card shadow="never" class="item-content mb30">
            <div :id="'message-content-' + i">
              {{ getContent(item.content, i) }}
            </div>
          </el-card>
        </div>
      </div>
      <div v-else style="marginleft: -35px" v-loading="loadingTimeLine">
        <el-timeline>
          <el-timeline-item
            placement="top"
            v-for="(item, i) in timeLineList"
            :key="i"
          >
            <el-card>
              <h4>
                {{ DateTimeUtils.dateClockTime(item.content.operateTime) }}
                {{ getInfo(item) }}
              </h4>
              <p>{{item.content.org ? item.content.org : $t('无')}} ->
                {{item.content.new}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  unref,
  watch,
} from "@vue/composition-api";
const TabType = {
  Follow: "follow",
  TimeLine: "timeLine",
};
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
  },
  setup(props, { root, emit }) {
    const userId = JSON.parse(window.localStorage.getItem("userInfo")).id;
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const activeTab = ref(TabType.Follow);
    const followContent = ref("");
    const followUpList = ref(null);
    const timeLineList = ref(null);
    const flagState = reactive({
      loadingTimeLine: false,
      loadingFollow: true,
    });
    const handleSubmit = () => {
      const params = {
        dealId: props.currentItem.id || props.currentItem.dealId,
        followType: "ops",
        content: unref(followContent),
        createUserId: userId,
      };
      root.$Api.studentManagement
        .addFollowByDeal(params)
        .then(({ status, data: { code, data } }) => {
          if (status !== 200 || code !== 200) return Promise.reject();
          followContent.value = "";
          getFollowList();
        });
    };
    const handleClose = () => {
      emit("update:visible", false);
    };

    const getInfo = (item) => {
      const typeMap = {
        1: unref(isEn) ? 'Created the Deal' : '创建了商机',
        2: unref(isEn) ? 'Changed the LA of Deal' : '更改了商机学管归属',
        3: unref(isEn) ? 'Changed Deal stage' : '更改了商机状态'
      }
      const str = typeMap[item.content.operateType]
      return `${item.operateName} ${str}`
    }

    const getFollowList = () => {
      flagState.loadingFollow = true;
      root.$Api.studentManagement
        .getDealsFollows(props.currentItem.id || props.currentItem.dealId)
        .then(({ status, data: { code, data } }) => {
          if (status !== 200 || code !== 200) return Promise.reject();
          followUpList.value = data;
          flagState.loadingFollow = false;
        })
        .catch(() => {
          flagState.loadingFollow = false;
        });
    };

    const getTimeLines = () => {
      flagState.loadingTimeLine = true;
      root.$Api.studentManagement
        .getDealFollowTimeLine(
          props.currentItem.id || props.currentItem.dealId,
          props.currentItem.eventType||props.currentItem.touchType/* 商机管理row字段名是eventType；家长详情是touchType */
        )
        .then(({ status, data: { code, data } }) => {
          if (status !== 200 || code !== 200) return Promise.reject();
          timeLineList.value = data.sort((a, b) => {
            b.content.operateTime - a.content.operateTime;
          });
          flagState.loadingTimeLine = false;
        })
        .catch(() => {
          flagState.loadingTimeLine = false;
        });
    };

    const getContent = (content, key) => {
      root.$nextTick(() => {
        document.getElementById(`message-content-${key}`).innerText = content;
      });
    };

    watch(activeTab, (val) => {
      if (val === TabType.Follow) {
        getFollowList();
      } else {
        getTimeLines();
      }
    });

    onMounted(getFollowList);

    return {
      isEn,
      TabType,
      ...toRefs(flagState),
      activeTab,
      followContent,
      followUpList,
      timeLineList,
      getContent,
      getInfo,

      handleClose,
      handleSubmit,
    };
  },
});
</script>
<style lang="scss" scoped>
.follow-drawer {
  .content {
    padding: 0px 15px;
  }
  .item-title {
    font-size: 14px;
  }
  .item-content {
    background: #f2f2f2;
  }
}
</style>
