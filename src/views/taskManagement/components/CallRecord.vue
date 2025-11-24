<template>
  <div class="call-record-warp" v-loading="tableState.loading">
    <div class="search-warp">
      <el-date-picker
        :clearable="false"
        class="mr10"
        v-model="paramsDate"
        type="daterange"
        align="right"
        range-separator="~"
        :start-placeholder="$t('开始日期')"
        :end-placeholder="$t('结束日期')"
        :picker-options="pickerOptions"
        :default-time="['00:00:00', '23:59:59']"
      >
      </el-date-picker>
      <FilterByLaAccount
        @change="
          (user) => {
            params.userId = user.id;
          }
        "
      />
      <el-button
        type="primary"
        @click="
          () => {
            reqList();
          }
        "
        >{{ $t("查询") }}</el-button
      >
    </div>
    <div class="list" v-if="tableState.list && tableState.list.length">
      <div></div>
      <el-card
        class="mb10"
        v-for="item in tableState.list"
        :key="item.id"
        shadow="hover"
      >
        <el-form ref="form" :model="item" label-width="80px">
          <el-form-item label="跟进人">
            {{ item.fromUser }}
          </el-form-item>
          <el-form-item label="外呼状态">
            {{ item.callStatus }}
          </el-form-item>
          <el-form-item label="通话内容">
            <Message :msg="item" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <Empty v-else />
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
import CompletedTaskResult from "@/views/taskManagement/components/CompletedTaskResult.vue";
import Empty from "@/components/Empty.vue";
import FilterByLaAccount from "@/components/FilterItem/UserDimensionFilter/FilterByLaAccount";
import moment from "moment";
import Message from "./record/msgType/Message.vue";

export default {
  components: {
    CompletedTaskResult,
    Empty,
    FilterByLaAccount,
    Message,
  },
  setup(props, { root, emit }) {
    const params = reactive({
      endTimeStamp: "",
      startTimeStamp: "",
      userId: "",
      parentUserId: root.$route.query.parentUserId,
    });
    const paramsDate = ref([]);
    const tableState = reactive({
      loading: false,
      list: [],
    });
    const reqList = async () => {
      try {
        tableState.loading = true;
        const res = await root.$Api.taskManagement.reqUserCallResult(params);
        tableState.list = res;
      } finally {
        tableState.loading = false;
      }
    };
    const pickerOptions = {
      shortcuts: [
        {
          text: root.$t("最近一周"),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
          },
        },
      ],
    };

    watch(
      () => paramsDate.value,
      (val) => {
        const diffNum = Math.abs(moment(val[0]).diff(moment(val[1]), "days"));
        if (diffNum > 7) {
          root.$notify.warning(root.$t("最多筛选7天数据"));
          return;
        }
        params.startTimeStamp = val[0].getTime();
        params.endTimeStamp = val[1].getTime();
        reqList();
      }
    );
    onMounted(async () => {
      paramsDate.value = [
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date(),
      ];
    });
    return {
      tableState,
      params,
      paramsDate,
      pickerOptions,
      reqList,
    };
  },
};
</script>

<style scoped lang="scss">
.call-record-warp {
  width: 800px;
  height: 100%;
  padding: 0 20px;
  position: relative;
  .search-warp {
    margin-bottom: 10px;
  }
  .list {
    overflow-y: scroll;
    height: calc(100% - 160px);
    .el-form-item {
      margin-bottom: 0px;
    }
  }
}
</style>
