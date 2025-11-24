<template>
  <el-dialog
    :close-on-click-modal="false"
    width="1000px"
    :title="$t('Substitute')"
    :before-close="handleClose"
    :visible.sync="substituteFlag"
  >
    <div>
      <div class="pt10 pb10">
        <!-- 教师名筛选 -->
        <span style="display: inline-block; width: 313px; margin-bottom: 15px">
          <FilterByTeacherKey
            v-if="substituteFlag"
            @changeSearchType="changeSearchType"
            @changeSearchValue="changeSearchValue"
          />
        </span>
        <!-- 教师状态筛选 -->
        <el-select
          clearable
          v-model="ableScreenData.hide"
          :placeholder="$t('开放状态')"
        >
          <el-option
            v-for="item in openList"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
        <!-- 教学风格筛选 -->
        <!-- <span style="display: inline-block">
          <FilterByTeachingStyle
            v-if="substituteFlag"
            @changeStyleSelect="changeStyleSelect"
          />
        </span> -->
        <span style="display: inline-block">
          <FilterByTeachingStyleNew
            :subjectType="currentClassInfo.subjectType"
            v-if="substituteFlag"
            :placeholder="$t('教学风格')"
            @changeStyleSelect="changeStyleSelect"
          />
        </span>
        <!-- 教师语言标签 -->
        <span style="display: inline-block">
          <FilterByTeachingLanguage
            v-if="substituteFlag"
            @changeLangSelect="changeLangSelect"
          />
        </span>
        <!-- 是否全职 -->
        <el-select
          clearable
          style="width: 210px"
          v-model="ableScreenData.fullWork"
          :placeholder="$t('是否全职')"
        >
          <el-option :label="$t('是')" value="1" />
          <el-option :label="$t('否')" value="0" />
        </el-select>
        <el-button type="primary" @click="searchAble">{{
          $t("my-home-Search")
        }}</el-button>
      </div>
      <el-table
        v-loading="ableTeacherLoading"
        :border="false"
        height="310"
        style="width: 100%"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :data="ableTeacherList"
        class="mt10"
      >
        <el-table-column
          width="120"
          prop="identityName"
          fixed
          align="center"
          :label="$t('教师ID')"
        >
          <template slot-scope="scope">
            <router-link
              v-if="
                Per.handleButtonPer(
                  'teach.tutorMT.teacherFile.tfViewTeacherFile'
                )
              "
              target="_blank"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${
                  scope.row.id
                }&teacherName=${scope.row.realName ? scope.row.realName : ''}`,
              }"
            >
              <el-button type="text">{{ scope.row.id }}</el-button>
            </router-link>
            <span v-else>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :width="currentLang == 'en' ? 160 : 120"
          prop="realName"
          align="center"
          :label="$t('my-home-Teacher\'s Nickname')"
        ></el-table-column>
        <el-table-column
          width="120"
          prop="identityName"
          align="center"
          :label="$t('my-home-Teacher\'s Name')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.identityName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="130"
          prop="tmUserName"
          align="center"
          :label="$t('教管姓名')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.tmUserName || "--" }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="120"
          prop="localArea"
          align="center"
          :label="$t('教师类型')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.localArea | teacherType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :width="currentLang == 'en' ? 150 : 120"
          prop="teachAge"
          align="center"
          :label="$t('my-home-Teaching Experience')"
        ></el-table-column>
        <el-table-column
          width="110"
          prop="fullWork"
          align="center"
          :label="$t('是否全职')"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.fullWork == '1'">{{ $t("是") }}</span>
            <span v-else-if="scope.row.fullWork == '0'">{{ $t("否") }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          prop="tutorLanguageLabelList"
          align="center"
          :label="$t('语言标签')"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.tutorStyleLabelList">{{
              scope.row.tutorLanguageLabelList.join(",")
            }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          prop="tutorStyleLabelList"
          align="center"
          :label="$t('教学风格')"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.tutorStyleLabelList">{{
              scope.row.tutorStyleLabelList.join(",")
            }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="hide"
          width="135"
          align="center"
          :label="$t('开放状态')"
        >
          <template slot-scope="scope">
            <span>{{ $t(Filters.getOpenTxt(scope.row.hide)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          fixed="right"
          align="center"
          :label="$t('操作')"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="substituteFn(scope.row)"
              >{{ $t("Substitute") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="showTeacherTimeTables(scope.row)"
              >{{ $t("老师课表") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="ableTotal"
        :current-page="ableScreenData.page"
        @getCurrentPage="AbleChangeCurrent"
        @getPerPage="getAblePerPage"
      />
    </div>
    <!-- 老师课表 -->
    <el-dialog
      :title="$t('老师课表')"
      :show-close="true"
      :close-on-click-modal="false"
      :visible.sync="showTeacherTimetable"
      :before-close="closeTeacherTimetable"
      width="1200px"
      append-to-body
    >
      <div class="teacher-timetable-wrap">
        <TeacherTimetable
          :teacherName="teacherName"
          :teacherId="teacherId"
          :startTimes="startTimes"
          :isFromSmallClass="isFromSmallClass"
          :isUserTimes="isUserTimes"
          :showTeacherTimetable="showTeacherTimetable"
        ></TeacherTimetable>
      </div>
    </el-dialog>
    <!-- 老师课表 -->
  </el-dialog>
</template>
<script>
import TeacherTimetable from "../../tutorManagement/teacherInfoSub/TeacherTimetable";
import { mapGetters } from "vuex";
import { ABNORMAL_CODE } from "@/utils/constants";
import FilterByTeacherKey from "@/components/FilterItem/TeacherFilter/FilterByTeacherKey";
// import FilterByTeachingStyle from "@/components/FilterItem/TeacherFilter/FilterByTeachingStyle";
import FilterByTeachingStyleNew from "@/components/FilterItem/TeacherFilter/FilterByTeachingStyleNew";

import FilterByTeachingLanguage from "@/components/FilterItem/TeacherFilter/FilterByTeachingLanguage";

export default {
  components: {
    TeacherTimetable,
    FilterByTeacherKey,
    // FilterByTeachingStyle,
    FilterByTeachingStyleNew,
    FilterByTeachingLanguage,
  },
  props: {
    substituteFlag: {
      type: Boolean,
      default: false,
    },
    currentClassInfo: {
      type: Object,
      default: () => {},
    },
    currentType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      openList: this.Constants.openForTeacherList,
      showTeacherTimetable: false,
      teacherId: -1,
      teacherName: "",
      startTimes: "",
      ableTeacherList: [],
      isFromSmallClass: true,
      isUserTimes: false,
      ableScreenData: {
        student_user_id: "",
        teacher_name: "",
        hide: "",
        page: 1,
        page_size: 50,
        searchType: "1",
        tutorStyleLabelList: "",
        tutorLanguageLabelList: "",
        fullWork: "",
      },
      ableTotal: 0,
      ableTeacherLoading: false,
    };
  },
  watch: {
    substituteFlag(newData) {
      if (newData) {
        this.getAbleTeacherData();
      }
    },
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {
    changeLangSelect(langIds) {
      this.ableScreenData.tutorLanguageLabelList = langIds.join(",");
    },
    changeStyleSelect(styleIds) {
      this.ableScreenData.tutorStyleLabelList = styleIds.join(",");
    },
    changeSearchType(type) {
      this.ableScreenData.searchType = type;
    },
    changeSearchValue(val) {
      this.ableScreenData.teacher_name = val;
    },
    showTeacherTimeTables(tutorInfo) {
      this.teacherId = tutorInfo.id;
      this.teacherName = tutorInfo.realName;
      this.showTeacherTimetable = true;
    },
    closeTeacherTimetable() {
      this.showTeacherTimetable = false;
    },
    handleClose() {
      this.ableScreenData.teacher_name = "";
      this.ableScreenData.hide = "";
      this.ableScreenData.searchType = "1";
      this.ableScreenData.tutorStyleLabelList = "";
      this.ableScreenData.tutorLanguageLabelList = "";
      this.ableScreenData.fullWork = "";
      this.$emit("closeSubstituteFlag");
    },
    AbleChangeCurrent(currentPage) {
      this.ableScreenData.page = currentPage;
      this.getAbleTeacherData();
    },
    searchAble() {
    console.log(this.currentClassInfo)
      this.getAbleTeacherData();
    },
    getAblePerPage(perPage) {
      this.ableScreenData.page_size = perPage;
      this.getAbleTeacherData();
    },
    getAbleTeacherData() {
      this.ableTeacherList = [];
      this.ableTeacherLoading = true;
      let {
        page,
        page_size,
        teacher_name,
        hide,
        searchType,
        tutorStyleLabelList,
        tutorLanguageLabelList,
        fullWork,
      } = this.ableScreenData;
      let studentIds = [];
      if (this.currentClassInfo.memberVOList) {
        this.currentClassInfo.memberVOList.forEach((item) => {
          studentIds.push(item.studentUserId);
        });
      } else if (this.currentClassInfo.classroomClassMemberInfoList) {
        this.currentClassInfo.classroomClassMemberInfoList.forEach((item) => {
          studentIds.push(item.studentUserId);
        });
      } else {
        studentIds = [this.currentClassInfo.studentUserId];
      }
      let params = {
          name: teacher_name,
          pageNum: page,
          pageSize: page_size,
          hide,
          virtualClassId: this.currentClassInfo.id
            ? this.currentClassInfo.id
            : this.currentClassInfo.virtualClassId,
          searchType: searchType,
          tutorStyleLabelList: tutorStyleLabelList,
          tutorLanguageLabelList: tutorLanguageLabelList,
          fullWork: fullWork,
        },
        apiKey = "";
      switch (this.currentType) {
        case "oneByOne":
          apiKey = "classArrangementSubstitute";
          break;
        case "smallClass":
          apiKey = "classArrangementSubstituteSmallClass";
          break;
        case "bigClass":
          apiKey = "classArrangementSubstituteBigClass";
          break;
        default:
          break;
      }
      this.$Api.classManagement[apiKey](params).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.ableTeacherList = data.data.list;
          this.ableTotal = data.data.total;
        }
        this.ableTeacherLoading = false;
      });
    },
    substituteFn(obj) {
      this.ableTeacherLoading = true;
      let absentTutorUserId = -1;
      if (this.currentClassInfo.tutorUserId) {
        absentTutorUserId = this.currentClassInfo.tutorUserId;
      } else {
        absentTutorUserId = this.currentClassInfo.tutorId;
      }
      let apiKey = "",
        virtualClassId = this.currentClassInfo.id
          ? this.currentClassInfo.id
          : this.currentClassInfo.virtualClassId;

      switch (this.currentType) {
        case "oneByOne":
          apiKey = "substituteTeacher";
          break;
        case "smallClass":
          apiKey = "substituteTeacherSmallClass";
          break;
        case "bigClass":
          apiKey = "substituteTeacherBigClass";
          break;
        default:
          break;
      }
      this.$Api.studentManagement[apiKey](obj.id, virtualClassId).then(
        (res) => {
          if (
            res.data.code === ABNORMAL_CODE.releaseOrAppointmentTimeConflict
          ) {
            this.$notify({
              message: this.$t("发布或者约课时间有冲突"),
              type: "error",
            });
          } else if ((res.status = 200 && res.data.code == 200)) {
            this.$notify({
              message: this.$t("Teachers Succeed in Teaching") + "！",
              type: "success",
            });
            this.$emit("getTableData");
            this.handleClose();
          }
          this.ableTeacherLoading = false;
        }
      );
    },
  }
};
</script>
