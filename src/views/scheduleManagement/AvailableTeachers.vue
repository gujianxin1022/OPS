<template>
  <div class="available-teacher-list">
    <el-tabs tabPosition="top" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-if="params.packageType === '0'"
        :label="$t('推荐老师')"
        name="recommend"
      ></el-tab-pane>
      <el-tab-pane
        v-if="params.packageType === '1'"
        :label="$t('历史约过')"
        name="history"
      ></el-tab-pane>
      <el-tab-pane
        v-if="params.packageType === '1'"
        :label="$t('用户收藏')"
        name="collect"
      ></el-tab-pane>
      <el-tab-pane :label="$t('全部老师')" name="allTeacher">
        <span v-if="bookCoursePackageInfo">
          <FilterPanel
            v-if="
              bookCoursePackageInfo.subjectType == '1' &&
              params.packageType == '1'
            "
            ref="FilterPanel"
            :collapseProps="collapseProps"
            :filterProps="enFormalFilterProps"
            @handleSearch="handleFilterPanelSearch"
            subjectType="1"
            :showExamineStatus="false"
          ></FilterPanel>
          <FilterPanel
            v-if="
              bookCoursePackageInfo.subjectType == '1' &&
              params.packageType == '0'
            "
            ref="FilterPanel"
            :collapseProps="collapseProps"
            :filterProps="enTrialFilterProps"
            @handleSearch="handleFilterPanelSearch"
            :showExamineStatus="false"
            subjectType="1"
          ></FilterPanel>
        </span>
        <screen-wrapper
          v-if="
            bookCoursePackageInfo && bookCoursePackageInfo.subjectType != '1'
          "
          @search="search"
          :showReset="true"
          @reset="reset"
          :screenTitle="$t('filter queries')"
        >
          <screen-item
            class="screen-item"
            :label="$t('教师')"
            :label-width="labelWidth"
            v-if="!isFormalChineseClass"
          >
            <FilterByBookTeacherKey
              ref="FilterByBookTeacherKey"
              @changeSearchType="
                (type) => {
                  otherParams.searchType = type;
                }
              "
              @changeSearchValue="
                (val) => {
                  otherParams.teacherName = val;
                }
              "
            />
          </screen-item>
          <screen-item
            class="screen-item"
            :label="$t('语言标签')"
            :label-width="labelWidth"
          >
            <FilterByTeachingLanguage
              ref="FilterByTeachingLanguage"
              @changeLangSelect="
                (langIds) => {
                  FilterByNationality;
                  otherParams.languageIds = langIds;
                }
              "
            />
          </screen-item>
          <screen-item
            class="screen-item"
            :label="$t('国籍')"
            :label-width="labelWidth"
            v-if="!isFormalChineseClass"
          >
            <FilterByNationality
              ref="FilterByNationality"
              :multiple="true"
              @changeSelect="
                (val) => {
                  otherParams.nationalityList = val;
                }
              "
            />
          </screen-item>
          <screen-item
            v-if="
              bookCoursePackageInfo && bookCoursePackageInfo.subjectType == '0'
            "
            :label="$t('教师风格')"
            :label-width="labelWidth"
          >
            <FilterByTeachingStyleNew
              ref="FilterByTeachingStyle"
              @changeStyleSelect="
                (styleIds) => {
                  otherParams.teachingStyleIds = styleIds;
                }
              "
              :subjectType="bookCoursePackageInfo.subjectType"
            />
          </screen-item>
          <screen-item
            v-if="
              bookCoursePackageInfo && bookCoursePackageInfo.subjectType == '2'
            "
            :label="$t('教师风格')"
            :label-width="labelWidth"
          >
            <FilterByTeachingStyleNew
              ref="FilterByTeachingStyle"
              @changeStyleSelect="
                (styleIds) => {
                  otherParams.teachingStyleIds = styleIds;
                }
              "
              :subjectType="bookCoursePackageInfo.subjectType"
            />
          </screen-item>
          <screen-item
            class="screen-item"
            :label="$t('转化率标签')"
            v-if="
              params.packageType == '0' &&
              activeName === 'allTeacher' &&
              !isFormalChineseClass
            "
            :label-width="labelWidth"
          >
            <!-- :isDisabled="
                Per.handleButtonPer(
                  'teach.studentMT.studentInfo.sistStudentTimetable.onlyInformalTrialClass'
                )
              " -->
            <FilterByConversionRateLabel
              ref="FilterByConversionRateLabel"
              :initVal="otherParams.conversionRateId"
              @changeSelect="
                (val) => {
                  otherParams.conversionRateId = val;
                }
              "
              :subjectType="bookCoursePackageInfo.subjectType"
            />
          </screen-item>
          <screen-item
            class="screen-item"
            v-if="
              params.packageType === '0' &&
              activeName === 'allTeacher' &&
              !isFormalChineseClass
            "
            :label="$t('开放状态')"
            :label-width="labelWidth"
          >
            <el-select
              v-model="otherParams.hide"
              filterable
              clearable
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item of Constants.openForTeacherList"
                :key="item.value"
                :value="item.value"
                :label="$t(item.label)"
              />
            </el-select>
          </screen-item>
          <screen-item
            class="screen-item"
            :label="$t('性别')"
            :label-width="labelWidth"
          >
            <el-select
              v-model="otherParams.gender"
              filterable
              clearable
              :placeholder="$t('请选择')"
              @change="search"
            >
              <el-option :label="$t('male')" :value="1" />
              <el-option :label="$t('female')" :value="2" />
            </el-select>
          </screen-item>
          <screen-item
            class="screen-item-checkbox"
            :label="$t('教学年限')"
            :label-width="labelWidth"
          >
            <el-checkbox-group
              @change="search"
              :label-width="labelWidth"
              v-model="otherParams.teachingYearList"
            >
              <el-checkbox
                v-for="item in Constants.teacherBookTeachAgoList(isEn)"
                :label="item.value"
                :key="item.value"
                >{{ item.label }}</el-checkbox
              >
            </el-checkbox-group>
          </screen-item>
          <screen-item
            class="screen-item-checkbox"
            :label="$t('现有学生')"
            :label-width="labelWidth"
            v-if="!isFormalChineseClass"
          >
            <el-checkbox-group
              @change="search"
              v-model="otherParams.studentCountList"
            >
              <el-checkbox
                v-for="item in Constants.teacherNumOfStu(isEn)"
                :label="item.value"
                :key="item.value"
                >{{ item.label }}</el-checkbox
              >
            </el-checkbox-group>
          </screen-item>
          <screen-item
            class="screen-item-checkbox"
            :label="$t('完课数量')"
            :label-width="labelWidth"
            v-if="!isFormalChineseClass"
          >
            <el-checkbox-group
              @change="search"
              v-model="otherParams.doneCountList"
            >
              <el-checkbox
                v-for="item in Constants.teacherNumOfLessons(isEn)"
                :label="item.value"
                :key="item.value"
                >{{ item.label }}</el-checkbox
              >
            </el-checkbox-group>
          </screen-item>
        </screen-wrapper>
      </el-tab-pane>
      <el-tab-pane :label="$t('我的收藏')" name="opsCollect"></el-tab-pane>
      <el-tab-pane
        v-if="bookCoursePackageInfo && bookCoursePackageInfo.subjectType === 1"
        :label="$t('我的黑名单')"
        name="opsBlackList"
      ></el-tab-pane>
    </el-tabs>
    <p v-show="activeName === 'allTeacher'">
      <span style="color: #f56c6c">*</span>
      <span style="font-size: 13px"> {{ $t("根据课程类型和进度筛选") }}</span>
    </p>
    <BasicTable
      v-loading="tableState.loading"
      header-cell-class-name="my-theme-color-header"
      border
      ref="BasicTable"
      style="width: 100%"
      :height="550"
      :data="tableState.data"
      :column="tableState.columns"
      :pagination="activeName !== 'recommend'"
      :page="tableState.page"
      :total="tableState.total"
      :limit="tableState.limit"
      @pagination="handlePaginationChange"
      :pageSizes="[10, 20, 30, 50, 100, 200]"
    />
    <TeacherCard
      :showTeacherCard="showTeacherCard"
      @closeTeacherCardDialog="showTeacherCard = false"
      :showCollect="true"
      :showOPSCollect="true"
      :showBlacklist="
        bookCoursePackageInfo && bookCoursePackageInfo.subjectType === 1
      "
      :tutorId="tutorId"
      :realName="realName"
    ></TeacherCard>
  </div>
</template>

<script>
import { ref, computed, reactive, watch, toRefs } from "@vue/composition-api";
import debounce from "lodash.debounce";
import BasicTable from "@/components/table/basic-table";
import TeacherCard from "@/views/groupManagement/components/teacherCard.vue";
import FilterByBookTeacherKey from "@/components/FilterItem/TeacherFilter/FilterByBookTeacherKey";
import FilterByTeachingLanguage from "@/components/FilterItem/TeacherFilter/FilterByTeachingLanguage";
import FilterByConversionRateLabel from "@/components/FilterItem/TeacherFilter/FilterByConversionRateLabel";
import FilterByNationality from "@/components/FilterItem/CommodityFilter/FilterByNationality";
import FilterPanel from "@/components/NewFilter/FilterPanel";
import { logEvent } from "@/utils/analyticsNew";
import { deepClone } from "@/utils/handleData";
import FilterByTeachingStyleNew from "@/components/FilterItem/TeacherFilter/FilterByTeachingStyleNew";

import {
  bookParamsTimes,
  operationScheduleType,
  bookCourseTeacherInfo,
  isHasOverlap,
  bookCoursePackageInfo,
  bookPackageType,
  bookMinStartTime,
} from "./teacherTime/bookCurriculum";
import moment from "moment";
import { filterParams } from "@/components/NewFilter/filterFiledNameMap";

export default {
  props: {
    studentInfo: {
      type: Object,
      default: () => {},
    },
    params: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    BasicTable,
    TeacherCard,
    FilterByBookTeacherKey,
    FilterByTeachingLanguage,
    FilterByNationality,
    FilterByConversionRateLabel,
    FilterPanel,
    FilterByTeachingStyleNew,
  },
  setup(props, { root, emit, refs }) {
    const collapseProps = ref(["Basic", "Business"]);
    const enFormalFilterProps = ref([
      "bookTeacherKey",
      "teachingStyleIds",
      "gender",
      "teachingYearList",
      "nationalityList",
      "ageGroupList",
      "preferredTeachingAgeGroupIds",
      "educationLevelList",
      "credentialList",
      "ethnicityList",
      "accentList",
      "studentCountList",
      "doneCountList",
      "ticketRateList",
      "absenceRateV2List",
      "slotCountList",
      "complaintRateList",
    ]);
    const enTrialFilterProps = ref([
      "bookTeacherKey",
      "teachingStyleIds",
      "gender",
      "teachingYearList",
      "nationalityList",
      "ageGroupList",
      "preferredTeachingAgeGroupIds",
      "educationLevelList",
      "credentialList",
      "ethnicityList",
      "accentList",
      "studentCountList",
      "doneCountList",
      "ticketRateList",
      "absenceRateV2List",
      "slotCountList",
      "complaintRateList",
      "hide",
      "conversionRateId",
    ]);
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const isFormalChineseClass = computed(
      () =>
        bookCoursePackageInfo?.value?.subjectType == 0 &&
        bookPackageType.value == 1
    );

    const currentLang = computed(() => root.$store.getters.currentLang);
    const activeName = ref("history");
    const otherParams = ref({
      searchType: "1",
      teacherName: "",
      gender: null,
      hide: "",
      conversionRateId: "",
      teachingStyleIds: [],
      nationalityList: [],
      teachingYearList: [],
      studentCountList: [],
      doneCountList: [],
      languageIds: [],
    });

    watch(
      () => bookCoursePackageInfo.value?.subjectType,
      (val) => {
        if(val!==1){
          panelParams.value = null;
        }
        if (!val && val !== 0) return;
        if (val != 1 && activeName.value === "opsBlackList") {
          if (props.params.packageType === 0) {
            activeName.value = "recommend";
          } else {
            activeName.value = "history";
          }
        }
      }
    );
    watch(
      () => props.params,
      (val) => {
        if (
          val.packageType === "0" &&
          ["history", "collect"].includes(activeName.value)
        ) {
          activeName.value = "recommend";
        }
        if (val.packageType === "1" && activeName.value === "recommend") {
          activeName.value = "history";
        }
        const { bookTimes, coursePackageId, packageType } = val;
        bookParamsTimes.value = bookTimes;
        if (activeName.value === "allTeacher") {
          reset();
        } else {
          debouncedFunction();
        }
      },
      { deep: true }
    );
    watch(
      () => activeName.value,
      (val) => {
        refs.FilterPanel && refs.FilterPanel.handleReset();
        panelParams.value = null;
        // if (
        //   val === "allTeacher" &&
        //   root.Per.handleButtonPer(
        //     "teach.studentMT.studentInfo.sistStudentTimetable.onlyInformalTrialClass"
        //   ) &&
        //   props.params.packageType === "0"
        // ) {
        //   refs.FilterPanel &&
        //     refs.FilterPanel.$refs.FilterByConversionRateLabel.clear(411);
        //   otherParams.value.conversionRateId = 411;
        // }
      },
      { deep: true }
    );
    const debouncedFunction = debounce(() => {
      tableState.page = 1;
      reqList();
    }, 500);
    const handleClick = () => {
      tableState.page = 1;
      refs.FilterByTeachingStyle.clear();
      reset();
    };
    const reqList = async () => {
      tableState.data = [];
      if (!props.params.coursePackageId) {
        return;
      }
      let reqFn = null;
      let preferTimeList = [];
      if (props.params.bookTimes.length) {
        let arr = deepClone(props.params.bookTimes);
        arr.forEach((e) => {
          if (e.value !== "") {
            if (e.value.maxStartTime !== e.value.minStartTime) {
              e.value.maxStartTime = moment
                .utc(e.value.maxStartTime)
                .subtract(1, "second")
                .toISOString();
            }
            preferTimeList.push(e.value);
          }
        });
      } else {
        preferTimeList = null;
      }
      let reqParams = {
        pageNum: tableState.page,
        pageSize: tableState.limit,
        coursePackageId: props.params.coursePackageId,
        studentUserId: root.$route.query.studentId,
        preferTimeRangeList: preferTimeList,
        preferTimeList: preferTimeList,
        dateType: props.params.dateType,
      };
      props.params.dateFormatType && delete reqParams.preferTimeRangeList;
      props.params.dateFormatType && delete reqParams.dateType;
      !props.params.dateFormatType && delete reqParams.preferTimeList;
      switch (activeName.value) {
        case "history":
          reqFn = root.$Api.classManagement.reqOtoHistoryTutorList;
          break;
        case "collect":
          reqFn = root.$Api.classManagement.reqOtoFavoriteTutorList;
          break;
        case "recommend":
          reqFn = root.$Api.classManagement.reqOtoRecommendTutorList;
          break;
        case "opsCollect":
          reqFn = root.$Api.classManagement.reqOPSFavoriteTeacherList;
          break;
        case "opsBlackList":
          reqFn = root.$Api.classManagement.reqOPSBlackTeacherList;
          break;
        case "allTeacher":
          if (panelParams.value) {
            reqParams = { ...reqParams, ...panelParams.value };
          } else {
            reqParams = { ...reqParams, ...otherParams.value };
          }
          if (!reqParams.teacherName || reqParams.teacherName === "") {
            reqParams.searchType = "";
          }
          if (
            reqParams.teacherName &&
            reqParams.teacherName !== "" &&
            (!reqParams.searchType || reqParams.searchType === "")
          ) {
            reqParams.searchType = "1";
          }
          if (props.params.packageType === "1") {
            reqParams.conversionRateId = null;
            reqParams.hide = null;
          }
          reqFn = root.$Api.classManagement.reqOtoAllTutorList;
          break;
      }
      reqMyListData(filterParams(reqParams), reqFn);
    };
    const reqMyListData = async (params, reqFn) => {
      try {
        tableState.loading = true;
        const res = await reqFn(params);
        if (activeName.value === "recommend") {
          tableState.data = res;
        } else {
          tableState.data = res.list;
          tableState.total = res.total;
        }
        if (activeName.value === "allTeacher") {
          logEvent("submit_do_search_teacher_list", "查找老师", {
            businessLine: bookCoursePackageInfo.value.subjectType + 1,
            searchTeacherData: JSON.stringify(params),
            total: res.total,
          });
        }
        activeName.value;
        root.$nextTick(() => {
          refs.BasicTable.$children[0].doLayout();
        });
      } finally {
        tableState.loading = false;
      }
    };
    const tableState = reactive({
      total: 0,
      page: 1,
      limit: 10,
      data: [],
      loading: false,
      columns: computed(() => {
        const { page, limit } = tableState;
        return [
          {
            label: root.$t("头像"),
            minWidth: 70,
            fixed: "left",
            prop: "avatar",
            render: (_, { row }) => {
              return (
                <div
                  style={"cursor: pointer"}
                  onClick={() => {
                    showTeacherCardDialog(row);
                  }}
                >
                  {row.avatar && row.avatar.length ? (
                    <el-avatar src={row.avatar} size="40" key={row.avatar} />
                  ) : (
                    <span>-</span>
                  )}
                </div>
              );
            },
          },
          {
            label: root.$t("教师ID"),
            prop: "id",
            fixed: "left",
            minWidth: 130,
            render: (h, { row }) => (
              <a
                style={"color: #7580e5"}
                onClick={() => {
                  showTeacherCardDialog(row);
                }}
              >
                {row.id}
              </a>
            ),
          },
          {
            label: root.$t("教师昵称"),
            prop: "realName",
            minWidth: 105,
          },
          bookCoursePackageInfo.value &&
          bookCoursePackageInfo.value.subjectType != 1
            ? {
                label: root.$t("真实姓名"),
                prop: "identityName",
                minWidth: 100,
              }
            : {},
          {
            label: root.$t("my-home-Gender"),
            prop: "gender",
            minWidth: 65,
            render: (h, { row }) =>
              root.Filters.mapGender(row.gender, currentLang),
          },
          {
            label: root.$t("my-home-Teaching Experience"),
            prop: "teachingStartTime",
            minWidth: isEn.value ? 140 : 80,
            render: (h, { row }) =>
              root.Constants.teachAgoComputed(row.teachingStartTime),
          },
          {
            label: root.$t("开放状态"),
            prop: "working",
            minWidth: 150,
            render: (h, { row }) => root.$t(root.Filters.getOpenTxt(row.hide)),
          },
          {
            label: root.$t("国家"),
            prop: "nationality",
            minWidth: 100,
          },
          {
            label: root.$t("学生数量"),
            prop: "studentCount",
            minWidth: isEn.value ? 140 : 100,
          },
          {
            label: root.$t("累计完成课节"),
            prop: "doneCount",
            minWidth: isEn.value ? 230 : 100,
          },
          {
            label: root.$t("教师电话"),
            prop: "phone",
            minWidth: isEn.value ? 140 : 100,
          },
          {
            label: root.$t("操作"),
            fixed: "right",
            width: isEn.value ? 220 : 150,
            render: (h, { row }) =>
              ["opsBlackList", "opsCollect"].includes(activeName.value) ? (
                <div>
                  <span>
                    {activeName.value === "opsCollect" ? (
                      <span>
                        <el-button
                          onClick={() =>
                            handelOpenTeacherTimeTable(row, "bookOneClass")
                          }
                          class="ml10"
                          type="text"
                        >
                          {root.$t("单次约课")}
                        </el-button>
                        <el-button
                          onClick={() =>
                            handelOpenTeacherTimeTable(row, "bookMoreClass")
                          }
                          class="ml10"
                          type="text"
                        >
                          {root.$t("周期约课")}
                        </el-button>
                        <span>
                          {bookCoursePackageInfo.value.subjectType == "1" ? (
                            <el-button
                              onClick={() =>
                                handelOpenTeacherTimeTable(row, "requestClass")
                              }
                              class="ml10"
                              type="text"
                            >
                              {root.$t("单次求课")}
                            </el-button>
                          ) : (
                            ""
                          )}
                        </span>
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                  <el-button
                    onClick={() =>
                      handelOPSSwitchStatus(
                        row,
                        activeName.value === "opsBlackList"
                          ? "black"
                          : "collect"
                      )
                    }
                    class="ml10"
                    type="text"
                  >
                    {activeName.value === "opsBlackList"
                      ? root.$t("移出我的黑名单")
                      : root.$t("取消我的收藏")}
                  </el-button>
                </div>
              ) : (
                <div>
                  <el-button
                    onClick={() =>
                      handelOpenTeacherTimeTable(row, "bookOneClass")
                    }
                    class="ml10"
                    type="text"
                  >
                    {root.$t("单次约课")}
                  </el-button>
                  <el-button
                    onClick={() =>
                      handelOpenTeacherTimeTable(row, "bookMoreClass")
                    }
                    class="ml10"
                    type="text"
                  >
                    {root.$t("周期约课")}
                  </el-button>
                  <span>
                    {bookCoursePackageInfo.value.subjectType == "1" ? (
                      <el-button
                        onClick={() =>
                          handelOpenTeacherTimeTable(row, "requestClass")
                        }
                        class="ml10"
                        type="text"
                      >
                        {root.$t("单次求课")}
                      </el-button>
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              ),
          },
        ];
      }),
    });
    const handlePaginationChange = async (info) => {
      Object.assign(tableState, info);
      if (info.changeSize) {
        tableState.page = 1;
      }
      await reqList();
    };
    const teacherCardState = reactive({
      showTeacherCard: false,
      tutorId: "",
      realName: "",
    });

    const showTeacherCardDialog = (row) => {
      teacherCardState.tutorId = row.id;
      teacherCardState.realName = row.realName;
      teacherCardState.showTeacherCard = true;
    };
    const checkLimitTime = () => {
      let limitTime = moment
        .utc(bookMinStartTime.value)
        .add(30, "minutes")
        .toISOString();
      let flag = true;
      if (!bookParamsTimes.value || !bookParamsTimes.value.length) return flag;
      flag = bookParamsTimes.value.some((e) => {
        if (typeof e.value !== "string") return true;
        return !moment.utc(limitTime).isAfter(moment.utc(e.value));
      });
      if (!flag) {
        root.$notify({
          message:
            bookPackageType.value === "1"
              ? root.$t("正式课只能预约12小时外的时间")
              : root.$t("试听课只能预约8小时外的时间"),
          type: "warning",
        });
      }
      return flag;
    };
    const handelOpenTeacherTimeTable = async (row, type) => {
      if (!checkLimitTime()) {
        return;
      }
      if (isHasOverlap.value) {
        bookCoursePackageInfo.value.duration;
        return root.$notify({
          message: root
            .$t(
              "当前课包时长为$duration分钟，您选择的多个开始时间存在交集冲突，请调整您的时间筛选"
            )
            .replace("$duration", `${bookCoursePackageInfo.value.duration}`),
          type: "warning",
        });
      }

      if (type === "bookOneClass") {
        await root.$Api.classManagement.reqFirstCheckSingle({
          coursePackageId: bookCoursePackageInfo.value.coursePackageId,
          studentUserId: root.$route.query.studentId,
          tutorUserId: row.id,
        });
      }
      if (type === "bookMoreClass") {
        await root.$Api.classManagement.reqFirstCheckCycle({
          coursePackageId: bookCoursePackageInfo.value.coursePackageId,
          studentUserId: root.$route.query.studentId,
          tutorUserId: row.id,
        });
      }
      if (type === "requestClass") {
        await root.$Api.classManagement.reqFirstCheckRequest({
          coursePackageId: bookCoursePackageInfo.value.coursePackageId,
          studentUserId: root.$route.query.studentId,
          tutorUserId: row.id,
        });
      }
      bookParamsTimes.value = bookParamsTimes.value.filter((e) => {
        return e.value !== "";
      });
      bookCourseTeacherInfo.value = row;
      operationScheduleType.value = type;
      emit("openTeacherTimeTable", row);
    };
    const search = async () => {
      tableState.page = 1;
      reqList();
    };
    const reset = () => {
      otherParams.value = {
        gender: null,
        languageIds: [],
        teachingStyleIds: [],
        conversionRateId: "",
        // conversionRateId: root.Per.handleButtonPer(
        //   "teach.studentMT.studentInfo.sistStudentTimetable.onlyInformalTrialClass"
        // )
        //   ? 411
        //   : "",
        nationalityList: [],
        teachingYearList: [],
        studentCountList: [],
        doneCountList: [],
        hide: "",
      };
      if (!isFormalChineseClass.value) {
        setTimeout(() => {
          refs.FilterByBookTeacherKey &&
            (refs.FilterByBookTeacherKey.value = "");
          refs.FilterByBookTeacherKey &&
            (refs.FilterByBookTeacherKey.type = "1");
          refs.FilterByTeachingLanguage &&
            (refs.FilterByTeachingLanguage.langIds = []);
          refs.FilterByNationality && (refs.FilterByNationality.selectId = "");
          refs.FilterByTeachingStyle &&
            (refs.FilterByTeachingStyle.styleIds = "");
        }, 500);
      } else {
        refs.FilterByTeachingStyle && refs.FilterByTeachingStyle.clear("");
      }
      bookCoursePackageInfo.value.subjectType != "1" && debouncedFunction();
    };
    const panelParams = ref(null);
    const handleFilterPanelSearch = (params) => {
      tableState.page = 1;
      panelParams.value = params;
      reqList(params);
    };
    const handelOPSSwitchStatus = async (row, type) => {
      const reqFn =
        type === "black"
          ? root.$Api.tutorManagement.reqCancelOPSBlackListTeacher
          : root.$Api.tutorManagement.reqCancelOPSFavoriteTeacher;
      try {
        await reqFn({
          tutorUserId: row.id,
        });
        root.$notify({
          message: root.$t("操作成功"),
          type: "success",
        });
        reqList();
      } catch {
        root.$notify({
          message: this.$t("操作失败"),
          type: "error",
        });
      }
    };
    return {
      isEn,
      activeName,
      handleClick,
      tableState,
      ...toRefs(teacherCardState),
      labelWidth: isEn.value ? "180" : "100",
      otherParams,
      currentLang,
      reset,
      handlePaginationChange,
      search,
      isFormalChineseClass,
      bookCoursePackageInfo,
      collapseProps,
      enTrialFilterProps,
      enFormalFilterProps,
      reqList,
      handleFilterPanelSearch,
    };
  },
};
</script>
<style lang="scss">
.available-teacher-list {
  width: 100%;
  padding-bottom: 20px;
  .screen-item {
    margin: 0px 0px 5px 0px;
  }
  .screen-item-checkbox {
    margin: 0px;
  }
}
</style>
