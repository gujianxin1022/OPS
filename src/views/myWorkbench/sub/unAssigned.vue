<template>
  <div class="course-detail">
    <screen-wrapper
      @search="search"
      :screenTitle="$t('filter queries')"
      showReset
      @reset="handleReset"
    >
      <div style="padding-top: 10px;">
        <el-radio-group
          @change="changeDateType"
          v-model="screenData.dateType"
        >
          <el-radio-button :label="1">{{ $t('本月') }}</el-radio-button>
          <el-radio-button :label="2">{{ $t('全部') }}</el-radio-button>
        </el-radio-group>
      </div>
      <screen-item
        label
        :part="4"
        label-width="0"
      >
        <el-date-picker
          v-model="screenData.time"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
          @change="changeDatePicker"
        ></el-date-picker>
      </screen-item>
      <screen-item :label="$t('学科')">
        <FilterBySpuSubject
          @changeSelect="
            (val) => {
              screenData.subjectType = val;
            }
          "
        />
      </screen-item>
      <screen-item :label="$t('进度类型')">
        <el-select
          clearable
          v-model="screenData.courseType"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in Constants.progressTypes(currentLang === 'en')"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('进度创建方式')">
        <el-select
          clearable
          v-model="screenData.createType"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in Constants.progressCreateMethods(currentLang === 'en')"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('glb-student')"
        :part="2"
        :label-width="currentLang == 'en' ? 150 : 80"
      >
        <el-input
          v-model.trim="screenData.studentName"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '...' : '学生昵称')
          "
        />
      </screen-item>
      <screen-item
        :label="$t('家长id')"
        :part="2"
        :label-width="currentLang == 'en' ? 150 : 80"
      >
        <el-input
          v-model.trim="screenData.parentUserId"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? ' ' : '') + $t('家长id')
          "
        />
      </screen-item>
    </screen-wrapper>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
    >
      <el-table
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          width="100"
        >
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          :label="$t('my-home-Students')"
          :width="120"
          prop="realName"
        >
          <template slot-scope="{row}">
            <el-button
              @click="
                goStudentDetail(row.studentId, row.studentName)
              "
              type="text"
            >{{ row.studentName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          prop="parentUserId"
          :label="$t('家长id')"
          width="150"
        >
          <template slot-scope="{row}">
            <span>
              <router-link :to="{
                  path: `/studentManagement/parentInfo`,
                  query: { parentUserId: row.parentUserId },
                }">
                <el-button type="text">
                  {{ row.parentUserId }}
                </el-button>
              </router-link>
            </span>
          </template>
        </el-table-column>
        <!-- 进度创建时间 -->
        <el-table-column
          align="center"
          :label="$t('进度创建时间')"
          :width="150"
          prop="createTime"
        >
          <template slot-scope="{row}">
            <span>
              {{ DateTimeUtils.dateClockTime(row.createTime) }}
            </span>
          </template>
        </el-table-column>
        <!-- 学科 -->
        <el-table-column
          align="center"
          :label="$t('学科')"
          width="120"
          prop="subjectType"
        >
          <template slot-scope="{row}">
            <div
              v-for="(item, index) in row.courseList"
              :key="index"
            >
              <span>{{Filters.getSubjectLabel(item.subjectType,
                  currentLang)}}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 进度类型 -->
        <el-table-column
          align="center"
          :label="$t('进度类型')"
          :width="100"
          prop="age"
        >

          <template slot-scope="{row}">
            <div
              v-for="(item, index) in row.courseList"
              :key="index"
            >
              {{Filters.getCourseType(item.courseType, currentLang === 'en')}}
            </div>
          </template>
        </el-table-column>
        <!-- 课程进度 -->
        <el-table-column
          align="center"
          :label="$t('课程进度')"
          :width="100"
          prop="courseList"
        >
          <template slot-scope="{row}">
            <div
              v-for="item in row.courseList"
              :key="item.lessonsId"
            >
              <span v-if="item.normalLessonsInfo">
                {{
                currentLang === "en"
                  ? item.normalLessonsInfo.courseProgressEn
                  : item.normalLessonsInfo.courseProgressZh
              }}
              </span>
              <span v-else>---</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('进度创建方式')"
          :width="100"
          prop="gender"
        >
          <template slot-scope="{row}">
            {{Filters.createTypeFilter(row.createType, currentLang === 'en')}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('进度创建人')"
          :width="100"
          prop="createUser"
        >
        </el-table-column>
        <!-- 顾问 -->
        <el-table-column
          align="center"
          :label="$t('课程顾问')"
          :width="currentLang == 'en' ? 130 : 120"
          prop="courseList"
        >
          <template slot-scope="{row}">
            <div
              v-for="item in row.courseList"
              :key="item.lessonsId"
            >
              {{item.adviserUserName || '-'}}
            </div>
          </template>
        </el-table-column>
        <!-- 学管 -->
        <el-table-column
          align="center"
          :label="$t('学管老师')"
          :width="120"
          prop="xgUserName"
        >
          <template slot-scope="{row}">
            <div
              v-for="item in row.courseList"
              :key="item.lessonsId"
            >
              {{item.xgUserName || '-'}}
            </div>
          </template>
        </el-table-column>
        <!-- 剩余课时 -->
        <el-table-column
          align="center"
          prop="residueHour"
          :label="$t('剩余课时')"
          :width="400"
        >
          <template slot-scope="{row}">
            <div
              style="height: 32px; line-height: 32px"
              v-for="item in row.courseList"
              :key="item.lessonsId"
            >
              <span
                v-if="item.residueHour && (item.residueHour.courseEn || item.residueHour.courseZh)"
              >
                {{
                currentLang === "en"
                  ? item.residueHour.courseEn
                  : item.residueHour.courseZh
              }}:{{ item.residueHour.surplusHours || 0}}
              </span>
              <span v-else>--</span>
            </div>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column
          align="center"
          :label="$t('操作')"
          fixed="right"
          width="140"
        >
          <template slot-scope="{row}">
            <div
              v-for="item in row.courseList"
              :key="item.lessonsId"
            >
              <el-button
                v-if="item.isCanAllocationXg === 1"
                type="text"
                @click="onHandover(row, item)"
              >
                {{ $t("分配学管") }}</el-button>
              <el-popover
                placement="top-start"
                width="200"
                trigger="click"
                v-if="item.isCanAllocationXg === 0"
                :content="$t('无付费课时，无法分配')"
              >
                <div
                  style="color:#c0c4cc;height:32px;line-height:32px;cursor:pointer"
                  slot="reference"
                >{{$t("分配学管")}}</div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </custom-card>
    <custom-pagination
      :total="total"
      :current-page="pageNum"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
    />

    <AssignLA
      v-if="isShowDialog"
      :visible.sync="isShowDialog"
      :current-info="currentTransfer"
      @refreshPage="refreshPage"
    />
  </div>
</template>

<script>
import {
  computed,
  onMounted,
  reactive,
  toRefs,
  ref,
  watch,
} from "@vue/composition-api";
import AssignLA from "../../Task/assignLA/index.vue";
import FilterBySpuSubject from "@/components/FilterItem/CommodityFilter/FilterBySpuSubject";


export default {
  props: {},
  components: {
    AssignLA,
    FilterBySpuSubject
  },
  setup (props, { root, emit }) {
    let tableData = ref([]);
    const isShowDialog = ref(false);
    const loading = ref(false);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const currentTransfer = ref({});
    const pageData = reactive({
      total: 0,
      pageNum: 1,
      pageSize: 50,
    });
    const screenData = reactive({
      dateType: 2,
      time: '',
      subjectType: '',
      courseType: '',
      parentUserId: "",
      studentName: "",
      createType: '',
    });

    const onHandover = (row, course) => {
      currentTransfer.value = row;
      currentTransfer.value.course = course;
      isShowDialog.value = true;
    };

    const handleReset = () => {
      Object.keys(screenData).map(key => screenData[key] = '')
    }

    const getCurrentPage = (num) => {
      pageData.pageNum = num;
      getTableData();
    };

    const getPerPage = (size) => {
      pageData.pageSize = size;
      getTableData();
    };

    const changeDateType = (type) => {
      if (type === 1) {
        screenData.startDate = root.DateTimeUtils.getMonthStartDate()
        screenData.endDate = root.DateTimeUtils.getMonthEndDate()
      } else {
        screenData.startDate = ''
        screenData.endDate = ''
      }
      screenData.time = [];
    }

    const changeDatePicker = () => {
      screenData.dateType = "";
    }

    const goStudentDetail = (id, name) => {
      root.$router.push(`/studentManagement/studentInfo?studentId=${id}&studentName=${name}`)
    };

    const search = () => {
      pageData.pageNum = 1
      getTableData()
    }

    const refreshPage = () => {
      getTableData()
    }

    const getTableData = async () => {
      loading.value = true;
      tableData.value = [];
      const params = { ...screenData }
      params.startDate = params.time[0] ? params.time[0] : (params.startDate || '');
      params.endDate = params.time[1] ? params.time[1] : (params.endDate || '');
      delete params.dateType
      delete params.time
      try {
        const {
          status,
          data: { code, data },
        } = await root.$Api.workBench.getUnAssignedList(
          pageData.pageNum,
          pageData.pageSize,
          params
        );
        if (status !== 200 || code !== 200 || !data) return Promise.reject();
        pageData.total = data.total;
        tableData.value = data.list
      } finally {
        loading.value = false;
      }
    };

    return {
      tableData,
      currentLang,
      loading,
      screenData,
      currentTransfer,
      isShowDialog,
      ...toRefs(pageData),
      search,
      onHandover,
      getPerPage,
      getCurrentPage,
      goStudentDetail,
      changeDateType,
      changeDatePicker,
      handleReset,
      refreshPage
    };
  },
};
</script>
<style scoped lang="scss">
.course-detail {
  padding: 0px 20px;
  .tab-wrap {
    display: flex;
    justify-content: space-between;
    padding: 20px 15px;
  }
}
::v-deep .el-tabs {
  width: 100%;
}
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
}
</style>