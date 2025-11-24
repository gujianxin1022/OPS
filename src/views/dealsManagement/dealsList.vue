<template>
  <div class="deasl-list-wrap">
    <screen-wrapper screenTitle="" @search="search">
      <screen-item :label="$t('家长id')">
        <el-input
          clearable
          v-model.trim="screenData.parentId"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '...' : '家长ID')
          "
        />
      </screen-item>
      <!-- 学生用户名 -->
      <screen-item :label="$t('glb-student')">
        <el-input
          clearable
          v-model.trim="screenData.studentName"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '...' : '学生用户名')
          "
        />
      </screen-item>
      <!-- 顾问 -->
      <screen-item :label="$t('顾问')">
        <el-select
          clearable
          filterable
          v-model="screenData.adviserId"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="(item, index) in gwList"
            :key="index"
            :label="
              item.nameEn +
              `${item.nameEn && item.nameZh ? '-' : ''}` +
              item.nameZh
            "
            :value="item.id"
          />
        </el-select>
      </screen-item>
      <!-- 商机阶段 -->
      <screen-item :label="$t('是否成单')">
        <el-select
          clearable
          v-model="screenData.orderClosed"
          :placeholder="$t('请选择')"
        >
          <el-option :label="$t('是')" value="1"></el-option>
          <el-option :label="$t('否')" value="0"></el-option>
        </el-select>
      </screen-item>
      <!-- 学科 -->
      <screen-item :label="$t('学科')">
        <el-select
          clearable
          v-model="screenData.leaningScope"
          :placeholder="$t('请选择')"
        >
          <el-option :label="$t('中文')" :value="SUBJECT_FROM_ZOHO.ZH">
          </el-option>
          <el-option :label="$t('英文')" :value="SUBJECT_FROM_ZOHO.EN">
          </el-option>
          <el-option :label="$t('数学')" :value="SUBJECT_FROM_ZOHO.MA">
          </el-option>
          <el-option
            v-if="Per.handleButtonPer('teach.dealsMT.filterByMusic')"
            :label="$t('音乐')"
            :value="SUBJECT_FROM_ZOHO.MU"
          >
          </el-option>
           <el-option :label="$t('单词通')" :value="SUBJECT_FROM_ZOHO.VOCAB">
          </el-option>
        </el-select>
      </screen-item>
      <!-- 商机类型-->
      <screen-item :label="$t('商机类型')">
        <el-select
          clearable
          v-model="screenData.dealType"
          :placeholder="$t('请选择')"
        >
          <el-option :label="$t('ZOHO商机')" value="zoho"></el-option>
          <el-option :label="$t('OPS商机')" value="ops"></el-option>
        </el-select>
      </screen-item>
      <!-- 用户类型 -->
      <screen-item :label="$t('用户类型')">
        <FilterByUserSourceType
          @change="
            (val) => {
              screenData.touchType = val;
            }
          "
        />
      </screen-item>
      <!-- 商机创建时间 -->
      <screen-item :label="$t('商机创建时间')">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="screenData.dealsTime"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </screen-item>
    </screen-wrapper>
    <custom-card :title="$t('数据列表')" class="table-wrapper">
      <div slot="header-right">
        <el-button type="primary" @click="batchAssign()">
          {{ $t("批量分配") }}
        </el-button>
      </div>
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
        @selection-change="handleSelectionChange"
        ref="multipleTableRef"
      >
        <el-table-column
          type="selection"
          :selectable="selectable"
          min-width="50"
          fixed
        />
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          min-width="50"
        >
          <template slot-scope="scope">
            {{
              (pageState.pageNum - 1) * pageState.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <!-- 商机ID -->
        <el-table-column
          fixed
          align="center"
          :label="$t('商机id')"
          :width="120"
          prop="zohoDealId"
        >
        </el-table-column>
        <!-- 线索ID -->
        <el-table-column
          align="center"
          :label="$t('线索id')"
          :width="120"
          prop="zohoLeadId"
        >
        </el-table-column>
        <!-- 学生 -->
        <el-table-column
          align="center"
          prop="studentName"
          :label="$t('my-home-Student')"
          width="150"
        >
          <template slot-scope="{ row }">
            <el-button
              @click="goStudentDetail(row.studentId, row.studentName)"
              type="text"
              >{{ row.studentName }}
            </el-button>
          </template>
        </el-table-column>
        <!-- 家长ID  -->
        <el-table-column
          width="150"
          align="center"
          :label="$t('家长id')"
          prop="parentId"
        >
          <template slot-scope="{ row }">
            <el-button type="text" @click="goParentDetail(row.parentId)">{{
              row.parentId
            }}</el-button>
          </template>
        </el-table-column>
        <!-- 课程顾问 -->
        <el-table-column
          align="center"
          :label="$t('课程顾问')"
          :width="currentLang == 'en' ? 150 : 120"
          prop="adviserName"
        ></el-table-column>
        <!-- 学科 -->
        <el-table-column
          align="center"
          :label="$t('学科')"
          width="120"
          prop="subject"
        >
          <template slot-scope="{ row }">
            <span v-if="row.subjectVal || row.subjectVal === 0">
              <span v-if="row.subjectVal === 0">{{ $t("中文") }}</span>
              <span v-if="row.subjectVal === 1">{{ $t("英文") }}</span>
              <span v-if="row.subjectVal === 2">{{ $t("数学") }}</span>
              <span v-if="row.subjectVal === 3">{{ $t("音乐") }}</span>
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('上课形态')"
          width="120"
          prop="classType"
        >
          <template slot-scope="{ row }">
            {{ $t(CLASS_TYPE_CODE_NAME[row.classType]) || "-" }}
          </template>
        </el-table-column>
        <!-- 渠道 -->
        <el-table-column
          align="center"
          :label="$t('渠道')"
          :width="currentLang == 'en' ? 150 : 120"
          prop="channel"
        ></el-table-column>
        <!-- 渠道 -->
        <el-table-column
          align="center"
          :label="$t('用户类型')"
          :width="currentLang == 'en' ? 150 : 120"
          prop="touchType"
        ></el-table-column>
        <!-- 推荐人 -->
        <el-table-column
          align="center"
          :label="$t('my-home-Referrer Id')"
          prop="name"
          width="160px"
        >
          <template slot-scope="{ row }">
            <el-button type="text" @click="goParentDetail(row.referrerId)"
              >{{row.referrerId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('商机阶段')"
          prop="rawStage"
          width="160px"
        >
        </el-table-column>
        <!-- 商机阶段 -->
        <el-table-column
          align="center"
          :label="$t('是否成单')"
          :width="currentLang == 'en' ? 150 : 120"
          prop="stage"
        >
          <template slot-scope="{ row }">
            <span v-if="row.stageVal || row.stageVal === 0">
              {{ row.stageVal === 1 ? $t("是") : $t("否") }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!-- 商机创建时间 -->
        <el-table-column
          align="center"
          :label="$t('商机创建时间')"
          width="150"
          prop="createTime"
        >
          <template slot-scope="{ row }">
            <span>{{ DateTimeUtils.dateClockTime(row.createTime) }}</span>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column
          align="center"
          fixed="right"
          :label="$t('操作')"
          :width="150"
        >
          <template slot-scope="{ row }">
            <!-- 重新分配 -->
            <template>
              <el-button
                v-if="row.editable"
                slot="reference"
                type="text"
                @click="singleAssign(row)"
                >{{ $t("重新分配") }}</el-button
              >
              <el-popover
                v-else
                placement="left-start"
                width="200"
                trigger="hover"
                :content="$t('请在ZOHO中进行分配')"
              >
                <div slot="reference">
                  <el-button disabled type="text"
                    >{{ $t("重新分配") }}
                  </el-button>
                </div>
              </el-popover>
            </template>
            <el-button
              class="mr5"
              v-if="
                Per.handleButtonPer('teach.studentMT.parentInfo.dealFollow')
              "
              type="text"
              @click="dealsFollow(row)"
              >{{ $t("商机跟进") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="pageState.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </custom-card>
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('student-management-Assign Course Consultant')"
      v-if="isShowAdviserModal"
      visible="true"
      width="30%"
      @close="isShowAdviserModal = false"
    >
      <el-form>
        <el-form-item :label="$t('课程顾问')">
          <el-select filterable :placeholder="$t('请选择')" v-model="adviserId">
            <el-option
              v-for="(item, index) in gwList"
              :key="index"
              :label="
                item.nameEn +
                `${item.nameEn && item.nameZh ? '-' : ''}` +
                item.nameZh
              "
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="btn-wrapper text-center">
          <el-button @click="isShowAdviserModal = false"
            >{{ $t("取消") }}
          </el-button>
          <el-button type="primary" @click="submitAssign">
            {{ $t("my-home-Confirm") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 商机Follow 抽屉 -->
    <DealsFollowDrawer
      :currentItem="currentItem"
      v-if="showDealsFollowDrawer"
      :visible.sync="showDealsFollowDrawer"
      @followSuccess="handleFollowSucess"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  ref,
  computed,
  toRefs,
  watch,
} from "@vue/composition-api";
const SUBJECT_FROM_ZOHO = {
  ZH: "ZH_1001",
  EN: "EN_1002",
  MA: "MA_1003",
  MU: "MU_1004",
  VOCAB:"VOCAB_1007"
};
import FilterByUserSourceType from "@/components/FilterItem/UserDimensionFilter/FilterByUserSourceType";
import DealsFollowDrawer from "@/views/studentManagement/components/dealsFollowDrawer";
import {
  CLASS_TYPE_CODE_NAME,
} from "@/utils/constants";
export default defineComponent({
  name: "dealsList",
  components: { FilterByUserSourceType, DealsFollowDrawer },
  setup(_, { root }) {
    let multipleTableRef = ref(null);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const gwList = computed(() => root.$store.getters.gwList);
    const total = ref(0);
    const tableData = ref([]);
    const loading = ref(false);
    let selectIds;
    const showDealsFollowDrawer = ref(false);

    const screenData = reactive({
      parentId: "",
      studentName: "",
      adviserId: "",
      orderClosed: "",
      dealsTime: "",
      leaningScope: "",
      timeBegin: "",
      timeEnd: "",
      dealType: "",
    });

    const pageState = reactive({
      pageSize: 50,
      pageNum: 1,
    });

    const flagState = reactive({
      loading: false,
      isShowAdviserModal: false,
    });

    const submitAdviser = reactive({
      adviserId: "",
      dealIds: [],
    });

    watch(
      () => screenData.dealsTime,
      (time) => {
        screenData.timeBegin = (time && time[0]) || "";
        screenData.timeEnd = (time && time[1]) || "";
      },
      { deep: true }
    );

    const goParentDetail = (pid) => {
      root.$router.push(`/studentManagement/parentInfo?parentUserId=${pid}`);
    };

    const goStudentDetail = (sid, name) => {
      root.$router.push(
        `/studentManagement/studentInfo?studentId=${sid}&studentName=${name}`
      );
    };

    const search = () => {
      pageState.pageNum = 1;
      getData();
    };

    const getData = () => {
      loading.value = true;
      const submitParam = Object.assign({}, screenData, pageState);
      delete submitParam.dealsTime;
      root.$Api.dealsManagement
        .getDealList(submitParam)
        .then(({ data, status }) => {
          if (data.code !== 200 || status !== 200) {
            return Promise.reject();
          }
          tableData.value = data.data.records;
          loading.value = false;
          total.value = data.data.total;
        })
        .catch(() => {
          tableData.value = [];
          loading.value = false;
          total.value = 0;
        });
    };

    const singleAssign = (row) => {
      flagState.isShowAdviserModal = true;
      submitAdviser.dealIds = [+row.id];
    };

    const batchAssign = () => {
      if (!submitAdviser.dealIds.length) {
        root.$notify({
          type: "warning",
          message: "请选择学生",
        });
        return;
      }
      submitAdviser.dealIds = selectIds;
      flagState.isShowAdviserModal = true;
    };

    const submitAssign = () => {
      if (!submitAdviser.adviserId) {
        return root.$message.warning(root.$t("请选择分配顾问"));
      }
      root.$Api.dealsManagement
        .changeAdviser(submitAdviser)
        .then(({ data, status }) => {
          if (data.code !== 200 || status !== 200) {
            return Promise.reject();
          }
          root.$message.success(root.$t("分配成功"));
          handleCloseModal();
          search();
        })
        .catch(() => {
          root.$message.error(root.$t("分配失败"));
        });
    };

    const getCurrentPage = (page) => {
      pageState.pageNum = page;
      getData();
    };

    const getPerPage = (perPage) => {
      pageState.pageSize = perPage;
      getData();
    };

    const handleSelectionChange = (list) => {
      selectIds = list.map((item) => +item.id);
      submitAdviser.dealIds = selectIds;
    };

    const selectable = (row) => row.editable;

    const handleCloseModal = () => {
      submitAdviser.adviserId = "";
      flagState.isShowAdviserModal = false;
      multipleTableRef.value.clearSelection();
      submitAdviser.dealIds = [];
    };

    const currentItem = ref({});

    const dealsFollow = async (row) => {
      currentItem.value = row;
      showDealsFollowDrawer.value = true;
    };

    return {
      SUBJECT_FROM_ZOHO,
      multipleTableRef,
      total,
      ...toRefs(submitAdviser),
      ...toRefs(flagState),
      screenData,
      pageState,
      gwList,
      loading,
      tableData,
      currentLang,
      showDealsFollowDrawer,
      currentItem,
      handleSelectionChange,
      selectable,
      singleAssign,
      search,
      submitAssign,
      batchAssign,
      getPerPage,
      getCurrentPage,
      handleCloseModal,
      goParentDetail,
      goStudentDetail,
      getData,
      dealsFollow,
      CLASS_TYPE_CODE_NAME
    };
  },
});
</script>
