<template>
  <!-- 学员Follow -->
  <div class="sty-follow-log-warp">
    <el-card :style="tableList.length > 0?'height: 400px':'height: 180px'">
      <div class="common-title">
        {{ $t("学员Follow up") }}
        <i
          title="Follow"
          @click="showFollowDrawer = true"
          class="el-icon-edit-outline"
        ></i>
      </div>
      <div class="filter-contain">
        <el-select
          clearable
          filterable
          v-model="params.followType"
          :placeholder="$t('跟进类型')"
        >
          <el-option
            v-for="item in followUpTypeOptions"
            :key="item.id"
            :label="isEn ? item.nameEn : item.nameZh"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-date-picker
          v-model="times"
          style="width: 230px"
          type="daterange"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
        <el-button
          type="primary"
          :loading="loading"
          @click="pageState.pageNum = '1',reqLogList()"
        >{{
          $t("查询")
        }}</el-button>
      </div>
      <div
        class="list"
        v-loading="loading"
      >
        <template>
          <div v-if="tableList.length > 0">
            <div
              class="item"
              v-for="item in tableList"
              :key="item.id"
            >
              <div class="top-info">
                <el-tag
                  class="mr10"
                  type="success"
                  effect="plain"
                >
                  {{ isEn ? item.typeNameEn : item.typeNameZh }}
                </el-tag>
                <span class="mr20">{{ item.createUsername }}</span>
                <span class="ml10">{{
                  DateTimeUtils.dateClockTime(item.createTime)
                }}</span>
              </div>
              <div
                class="content"
                style="white-space: pre-wrap"
              >{{ item.content }}</div>
            </div>
          </div>
          <div
            v-else
            class="no-data"
          >
            {{ $t("暂无数据") }}
          </div>
        </template>

        <custom-pagination
          v-if="pageState.total > 0"
          :total="pageState.total"
          :page-ize="pageState.pageSize"
          :current-page="pageState.pageNum"
          @getCurrentPage="handleCurrentChange"
          @getPerPage="handleSizeChange"
        />
      </div>
    </el-card>
    <!-- 跟进学员抽屉 -->
    <el-drawer
      :title="$t('学员Follow up')"
      :visible.sync="showFollowDrawer"
    >
      <div style="width: 600px; height: 100%">
        <FollowDrawer
          @refresh="
            (showFollowDrawer = false), (pageState.pageNum = '1'), reqLogList()
          "
          :isShow="showFollowDrawer"
          :studentId="studentId"
          :courseType="courseType"
          @close="showFollowDrawer = false"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  onMounted,
  reactive,
  computed,
  ref,
  watch,
} from "@vue/composition-api";
import FollowDrawer from "@/views/myWorkbench/components/followDrawer";

export default {
  name: "studentData",
  props: {
    courseType: {
      type: String,
      default: -1, // 0：中文 1：英文
    },
    studentId: {
      type: String,
      default: -1,
    },
  },
  components: { FollowDrawer },
  setup (props, { root }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const loading = ref(false);
    const showFollowDrawer = ref(false);
    const followUpTypeOptions = [
      { id: 1, nameZh: "日常沟通", nameEn: "Daily Communication" },
      { id: 2, nameZh: "课消沟通", nameEn: "Class Communication" },
      { id: 3, nameZh: "续费沟通", nameEn: "Renewals Communication" },
      { id: 4, nameZh: "转介绍沟通", nameEn: "Referral Communication" },
      { id: 5, nameZh: "学情沟通", nameEn: "Learning Communication" },
      { id: 6, nameZh: "家长反馈", nameEn: "Parent Feedback" },
    ];
    const times = ref([]);
    const pageState = reactive({
      pageNum: "1",
      pageSize: "50",
      total: "",
    });
    const params = reactive({
      studentUserId: props.studentId,
      subjectTypeId: props.courseType,
      followType: "",
      startTime: "",
      endTime: "",
    });
    const tableList = ref([]);
    const reqLogList = async () => {
      if (times.value && times.value.length >= 2) {
        params.startTime = new Date(`${times.value[0]}`).toISOString();
        params.endTime = new Date(`${times.value[1]}`).toISOString();
      } else {
        params.startTime = "";
        params.endTime = "";
      }
      loading.value = true;
      try {
        const {
          status,
          data: { code, data },
        } = await root.$Api.studentManagement.reqStudentFollowList(
          pageState.pageNum,
          pageState.pageSize,
          params
        );
        if (status !== 200 || code !== 200) return Promise.reject();
        data.list.forEach((e) => {
          const curr = followUpTypeOptions.filter((i) => {
            return i.id === e.followType;
          })[0];
          e.typeNameZh = curr.nameZh;
          e.typeNameEn = curr.nameEn;
        });
        tableList.value = data.list || [];
        pageState.total = data.total;
      } finally {
        loading.value = false;
      }
    };
    const handleCurrentChange = (val) => {
      pageState.pageNum = val;
      reqLogList();
    };
    const handleSizeChange = (val) => {
      pageState.pageSize = val;
      reqLogList();
    };

    onMounted(() => {
      reqLogList();
    });
    watch(
      () => props.courseType,
      (val) => {
        pageState.pageNum = 1;
        params.subjectTypeId = val;
        reqLogList();
      }
    );

    return {
      isEn,
      params,
      times,
      followUpTypeOptions,
      loading,
      showFollowDrawer,
      reqLogList,
      tableList,
      pageState,
      handleCurrentChange,
      handleSizeChange,
    };
  },
};
</script>

<style lang='scss' scoped>
.sty-follow-log-warp {
  margin-bottom: 20px;
  font-size: 14px;
  .common-title {
    width: 100%;
    position: relative;
    font-size: 20px;
    height: 40px;
    .el-icon-edit-outline {
      cursor: pointer;
      color: #7580e5;
    }
  }
  .list {
    height: 280px;
    overflow: scroll;
    .item {
      margin-top: 20px;
      .top-info {
        color: #303133;
        font-weight: 500;
      }
      .content {
        margin-top: 20px;
        padding-left: 10px;
        color: #777777;
      }
    }
  }
  .no-data {
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: #ccc;
  }
}
</style>