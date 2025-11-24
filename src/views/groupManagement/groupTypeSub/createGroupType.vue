<template>
  <div class="create-gt-wrap">
    <div class="create-gt-in">
      <el-form
        ref="form"
        class="form"
        :model="form"
        :rules="rules"
        :label-width="currentLang === 'en' ? '270px' : '120px'"
      >
        <el-form-item prop="classtypeNameZh" :label="$t('班型中文名称')">
          <el-input
            maxlength="50"
            show-word-limit
            style="width: 430px"
            v-model="form.classtypeNameZh"
            :placeholder="$t('请输入班型中文名称')"
          />
        </el-form-item>
        <el-form-item prop="classtypeNameEn" :label="$t('班型英文名称')">
          <el-input
            maxlength="50"
            show-word-limit
            style="width: 430px"
            v-model="form.classtypeNameEn"
            :placeholder="$t('请输入班型英文名称')"
          />
        </el-form-item>
        <el-form-item prop="team" :label="$t('负责团队')">
          <el-select
            style="width: 430px"
            clearable
            v-model="form.team"
            :placeholder="$t('请选择负责团队')"
          >
            <el-option
              v-for="item in Constants.responsiblieTeam(currentLang)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('班型类型')" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="AUDITION_COURSE">{{ $t("试听课程") }}</el-radio>
            <el-radio :label="FORMAL_COURSE">{{ $t("正式") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('课程包')" prop="coursePackageId">
          <el-select
            filterable
            style="width: 210px"
            v-model="form.coursePackageId"
            :placeholder="$t('请选择课程包')"
            :loading="coursePackageLoading"
            @change="handleCoursePackageChange"
          >
            <el-option
              v-for="item of coursePackageList"
              :key="item.packageId"
              :label="currentLang === 'en' ? item.nameEn : item.nameZh"
              :value="item.packageId"
            />
          </el-select>
        </el-form-item>
        <div class="flex-wrapper">
          <el-form-item :label="$t('班型首课')" prop="packageTreeId">
            <el-select
              style="width: 210px"
              v-model="form.packageTreeId"
              :placeholder="$t('版本')"
              :loading="packageTreeLoading"
              @change="handlePackageTreeChange"
            >
              <el-option
                v-for="item of packageTreeList"
                :key="item.packageTreeId"
                :label="
                  currentLang === 'en'
                    ? item.editionNameOpsEn
                    : item.editionNameOpsZh
                "
                :value="item.packageTreeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="courseHierarchyIds"
            :style="{ marginLeft: currentLang === 'en' ? '-260px' : '-110px' }"
          >
            <el-cascader
              style="width: 210px"
              v-model="form.courseHierarchyIds"
              :options="courseHierarchyList"
              :props="{ value: 'id', label: 'name' }"
              :placeholder="$t('级别、单元、lesson')"
            >
              <template slot-scope="{ data }">
                <span>{{ data.name }}</span>
                <span v-if="data.trialLesson === 1 /* 是试听课 */" class="ml10">
                  <el-tag type="success">{{ $t("试听") }}</el-tag>
                </span>
              </template>
            </el-cascader>
          </el-form-item>
        </div>
        <el-form-item
          v-if="form.type == AUDITION_COURSE"
          prop="weekList"
          :label="$t('开课周期')"
        >
          <el-checkbox-group v-model="form.weekList">
            <el-checkbox
              v-for="item in Constants.weekList(currentLang)"
              :label="item.value"
              :key="item.label"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          v-if="form.type == FORMAL_COURSE"
          prop="classStartTime"
          :label="$t('发车日期')"
        >
          <el-date-picker
            style="width: 210px"
            v-model="form.classStartTime"
            type="datetime"
            :placeholder="$t('选择日期')"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type == FORMAL_COURSE"
          prop="week"
          :label="$t('上课周期')"
        >
          <span style="color: #777; margin-left: 10px">{{
            $t("此处均为北京时间")
          }}</span>
          <div
            class="mb10"
            v-for="(item, index) in weekStartClassTime"
            :key="index"
          >
            <el-select
              style="width: 210px"
              v-model="item.week"
              :placeholder="$t('请选择周几')"
            >
              <el-option :label="$t('周一')" :value="1" />
              <el-option :label="$t('周二')" :value="2" />
              <el-option :label="$t('周三')" :value="3" />
              <el-option :label="$t('周四')" :value="4" />
              <el-option :label="$t('周五')" :value="5" />
              <el-option :label="$t('周六')" :value="6" />
              <el-option :label="$t('周日')" :value="7" />
            </el-select>
            <el-select
              style="width: 210px"
              v-model="item.timeInd"
              :placeholder="$t('选择时间段')"
            >
              <el-option
                v-for="(ite, i) in Constants.startClassTimeData"
                :key="i"
                :label="ite.label"
                :value="ite.value"
              />
            </el-select>
            <el-time-select
              style="width: 210px"
              v-model="item.time"
              :picker-options="Constants.startClassTimeOfData[item.timeInd]"
              :placeholder="$t('选择时间')"
            />
            <div
              class="add"
              v-show="index == weekStartClassTime.length - 1"
              @click="addWeekTime(item, index)"
            >
              <i class="el-icon-circle-plus-outline" style="font-size: 20px" />
            </div>
            <div
              class="add"
              v-show="index == weekStartClassTime.length - 1"
              @click="reduceWeekTime(item, index)"
            >
              <i class="el-icon-remove-outline" style="font-size: 20px" />
            </div>
          </div>
        </el-form-item>
        <el-form-item
          v-if="form.type == FORMAL_COURSE"
          :label="$t('首次排课数量')"
          prop="lessonNum"
        >
          <el-input-number
            :min="0"
            :precision="0"
            style="width: 430px"
            v-model="form.lessonNum"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type == FORMAL_COURSE"
          :label="$t('是否自动续排')"
          prop="isRenew"
        >
          <el-radio-group v-model="form.isRenew">
            <el-radio label="1">{{ $t("是") }}</el-radio>
            <el-radio label="2">{{ $t("否") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.type == AUDITION_COURSE"
          :label="$t('上课时间')"
          prop="time"
        >
          <el-time-select
            style="width: 430px"
            v-model="form.time"
            :picker-options="{ start: '00:00', step: '00:30', end: '23:30' }"
            :placeholder="$t('选择时间')"
          >
          </el-time-select>
          <span style="color: #777; margin-left: 10px">{{
            $t("此处均为北京时间")
          }}</span>
        </el-form-item>
        <el-form-item
          v-if="form.type == AUDITION_COURSE"
          prop="dateTime"
          :label="$t('有效日期')"
        >
          <el-date-picker
            style="width: 430px"
            v-model="form.dateTime"
            :picker-options="pickerOptions"
            type="datetimerange"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="-"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
          />
          <span style="color: #777; margin-left: 10px">{{
            $t("自动创建班型的时间范围")
          }}</span>
        </el-form-item>
        <el-form-item :label="$t('班级容量')" prop="userMax">
          <el-radio v-model="form.userMax" label="4">4人</el-radio>
          <el-radio v-model="form.userMax" label="6">6人</el-radio>
          <el-input
            :placeholder="$t('请输入大于4小于12的数字')"
            style="width: 270px"
            size="medium"
            v-model="form.userMax"
          />
        </el-form-item>
        <el-form-item :label="$t('成班人数')" prop="userMin">
          <el-input
            :placeholder="$t('请输入该班型组成班级的最少学生数量')"
            style="width: 430px"
            size="medium"
            v-model="form.userMin"
          />
        </el-form-item>
        <el-form-item :label="$t('语言标签')" prop="languageLabel">
          <el-select
            style="width: 430px"
            clearable
            v-model="form.languageLabel"
            :placeholder="$t('请选择语言标签')"
          >
            <el-option
              v-for="item in Constants.langList(currentLang)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('年龄标签')">
          <el-select
            style="width: 430px"
            clearable
            v-model="form.ageLabel"
            :placeholder="$t('请选择年龄标签')"
          >
            <el-option
              v-for="item in Constants.ageList(currentLang)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="submitLoading">
            {{ $t("立即创建") }}
          </el-button>
          <el-button @click="cancel">{{ $t("取消") }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  AUDITION_COURSE /* 试听课 */,
  FORMAL_COURSE /* 正式课 */,
  ABNORMAL_CODE,
} from "@/utils/constants";
export default {
  name: "createGroupType",
  data() {
    return {
      AUDITION_COURSE,
      FORMAL_COURSE,
      submitLoading: false,
      form: {
        classtypeNameZh: "",
        classtypeNameEn: "",
        team: "",
        type: AUDITION_COURSE,
        coursePackageId: "",
        packageTreeId: "",
        courseHierarchyIds: [],
        time: "",
        weekList: [],
        dateTime: [],
        userMax: "4",
        userMin: "",
        languageLabel: "",
        classStartTime: "",
        lessonNum: "",
        isRenew: "1",
      },
      pickerOptions: {
        // 判断是否日历上的日期是否小于当前日期
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      rules: {},
      coursePackageList: [],
      coursePackageLoading: false,
      packageTreeList: [],
      packageTreeLoading: false,
      courseHierarchyList: [],
      weekStartClassTime: [
        {
          week: "",
          timeInd: "",
          time: "",
        },
        {
          week: "",
          timeInd: "",
          time: "",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
    subjectType({ form, coursePackageList }) {
      if (form.coursePackageId === "") return null;
      return coursePackageList.find((v) => v.packageId === form.coursePackageId)
        .subjectType;
    },
  },
  watch: {
    currentLang() {
      this.initData();
    },
    "form.type"(newData) {
      const { classtypeNameZh, classtypeNameEn, team } = this.form;
      this.form = this.$options.data().form;
      this.form.classtypeNameZh = classtypeNameZh;
      this.form.classtypeNameEn = classtypeNameEn;
      this.form.team = team;
      this.form.type = newData;
      this.coursePackageList = [];
      this.courseHierarchyList = [];
      this.packageTreeList = [];
      this.queryClassPackageList();
    },
  },
  methods: {
    async handleCoursePackageChange() {
      this.form.packageTreeId = "";
      this.packageTreeList = [];
      this.form.courseHierarchyIds = [];
      this.courseHierarchyList = [];
      this.queryPackageTreeList();
    },
    async handlePackageTreeChange() {
      this.form.courseHierarchyIds = [];
      this.courseHierarchyList = [];
      const {
        status,
        data: { code, data },
      } = await this.$Api.groupManagement.getCourseHierarchyData({
        packageId: this.form.coursePackageId,
        packageTreeId: this.form.packageTreeId,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      this.courseHierarchyList = data;
    },
    initData() {
      this.rules = {
        classtypeNameZh: [
          {
            required: true,
            message: this.$t("请输入班级中文名称"),
            trigger: "blur",
          },
        ],
        classtypeNameEn: [
          {
            required: true,
            message: this.$t("请输入班级英文名称"),
            trigger: "blur",
          },
        ],
        team: [
          {
            required: true,
            message: this.$t("请选择负责团队"),
            trigger: "change",
          },
        ],
        type: [
          {
            required: true,
            message: this.$t("请选择班型类型"),
            trigger: "change",
          },
        ],
        coursePackageId: [
          {
            required: true,
            message: this.$t("请选择课程包"),
            trigger: "change",
          },
        ],
        packageTreeId: [
          { required: true, trigger: "change", message: this.$t("请选择版本") },
        ],
        courseHierarchyIds: [
          {
            required: true,
            trigger: "change",
            message: this.$t("请选择级别、单元、lesson"),
          },
        ],
        classStartTime: [
          {
            required: true,
            message: this.$t("请选择发车日期"),
            trigger: "change",
          },
        ],
        week: [
          {
            required: true,
            trigger: "change",
            validator: (rules, value, callback) => {
              let { weekStartClassTime } = this;
              let result = weekStartClassTime.some(
                (item) =>
                  item.week === "" || item.time === "" || item.timeInd === ""
              );
              if (result) {
                return callback(
                  new Error(this.$t("上课周期信息不完善，请完善"))
                );
              } else {
                return callback();
              }
            },
          },
        ],
        lessonNum: [
          {
            trigger: "blur",
            validator: (rules, value, callback) => {
              if (this.form.packageTreeId) {
                if (value === 0)
                  return callback(this.$t("首次排课数量不能为0"));
                if (!value) return callback(this.$t("请输入"));
                return callback();
              }
              callback();
            },
          },
        ],
        isRenew: { required: true },
        userMax: [
          {
            required: true,
            trigger: "change",
            validator: (rules, value, callback) => {
              let { userMax } = this.form;
              if (isNaN(userMax)) {
                return callback(this.$t("请输数字"));
              } else if (userMax.indexOf(".") != -1) {
                return callback(this.$t("请输整数"));
              }
              if (userMax * 1 < 4 || userMax * 1 > 12) {
                return callback(new Error(this.$t("请输入大于4小于12的数字")));
              }
              return callback();
            },
          },
        ],
        userMin: [
          {
            required: true,
            trigger: "blur",
            validator: (rules, value, callback) => {
              let { userMax, userMin } = this.form;
              if (isNaN(userMin)) {
                return callback(this.$t("请输数字"));
              } else if (userMin.indexOf(".") != -1) {
                return callback(this.$t("请输整数"));
              }
              if (userMin * 1 > userMax * 1) {
                return callback(new Error(this.$t("成班人数不能大于班级容量")));
              } else if (userMin * 1 < 1) {
                return callback(this.$t("成班人数不能小于0"));
              } else {
                return callback();
              }
            },
          },
        ],
        weekList: [
          {
            required: true,
            trigger: "change",
            message: this.$t("请选择开课周期"),
          },
        ],
        time: [
          {
            required: true,
            trigger: "change",
            message: this.$t("请选择上课时间"),
          },
        ],
        dateTime: [
          {
            required: true,
            trigger: "change",
            message: this.$t("请选择有效日期"),
          },
        ],
      };
    },
    cancel() {
      this.$router.push(`/groupManagement/groupTypeList`);
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          let { type } = this.form;
          if (type == AUDITION_COURSE) {
            // 创建试听班型
            this.submitTryForm();
          } else if (type == FORMAL_COURSE) {
            // 创建正式班型
            this.submitNormalForm();
          }
        }
      });
    },
    /**
     * 提交创建正式
     */
    submitNormalForm() {
      let {
        ageLabel,
        classtypeNameEn,
        classtypeNameZh,
        languageLabel,
        team,
        classStartTime,
        lessonNum,
        isRenew,
        userMax,
        userMin,
        packageTreeId,
        coursePackageId,
        courseHierarchyIds: [courseLevel, unitNo, lessonId],
      } = this.form;

      let params = {
        classtypeNameZh,
        classtypeNameEn,
        team,
        classStartTime,
        lessonNum: lessonNum == "" ? 0 : lessonNum,
        isRenew,
        userMax,
        userMin,
        languageLabel,
        ageLabel,
        weekList: this.weekStartClassTime,
        coursePackageId,
        subjectType: this.subjectType,
        packageTreeId,
        courseLevel,
        unitNo,
        lessonId,
      };
      let f = false;
      this.weekStartClassTime.forEach((item) => {
        for (var key in item) {
          if (item[key] === null) {
            f = true;
          }
        }
      });
      if (f) {
        this.$notify({ message: "上课周期中缺少必要信息", type: "error" });
        this.submitLoading = false;
        return;
      }

      this.$Api.groupManagement
        .createNormalGroupType(params)
        .then(({ status, data }) => {
          if (data.code === ABNORMAL_CODE.scheduledCoursesNumberFaild) {
            this.$notify({
              message: this.$t("首次排课数量不能多于课程总数"),
              type: "error",
            });
          } else if (status == 200 && data.code == 200) {
            this.$notify({
              message: this.$t("创建成功"),
              type: "success",
            });
            this.$router.push(
              `/groupManagement/groupTypeDetail?groupTypeId=${data.data}`
            );
          } else {
            this.$notify({
              message: data.message,
              type: "error",
            });
          }
          this.submitLoading = false;
        });
    },
    /**
     * 提交创建试听班型表单
     */
    submitTryForm() {
      let {
        ageLabel,
        classtypeNameEn,
        classtypeNameZh,
        languageLabel,
        team,
        time,
        userMax,
        userMin,
        weekList,
        packageTreeId,
        coursePackageId,
        courseHierarchyIds: [courseLevel, unitNo, lessonId],
        dateTime,
      } = this.form;

      let params = {
        classtypeNameZh,
        classtypeNameEn,
        team,
        weekList,
        time,
        applyStartTime: new Date(dateTime[0]).toISOString(),
        applyEndTime: new Date(dateTime[1]).toISOString(),
        userMax,
        userMin,
        languageLabel,
        ageLabel,
        coursePackageId,
        subjectType: this.subjectType,
        packageTreeId,
        courseLevel,
        unitNo,
        lessonId,
      };

      this.$Api.groupManagement
        .createTryGroupType(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              message: this.$t("创建成功"),
              type: "success",
            });
            this.$router.push(
              `/groupManagement/groupTypeDetail?groupTypeId=${data.data}`
            );
          } else {
            this.$notify({
              message: data.message,
              type: "error",
            });
          }
          this.submitLoading = false;
        });
    },
    strUnit(unit) {
      return `unit${unit}`;
    },
    addWeekTime(item, index) {
      if (this.weekStartClassTime.length == 10) {
        this.$notify({
          message: this.$t("最多10个"),
          type: "warning",
        });
        return;
      }
      this.weekStartClassTime.push({
        week: "",
        timeInd: "",
        time: "",
      });
    },
    reduceWeekTime(item, index) {
      if (this.weekStartClassTime.length == 1) {
        this.$notify({
          message: this.$t("最少保留一个"),
          type: "warning",
        });
        return;
      }
      this.weekStartClassTime.splice(index, 1);
    },
    async queryClassPackageList() {
      try {
        this.coursePackageLoading = true;
        const {
          status,
          data: { code, data },
        } = await this.$Api.groupManagement.queryClassPackageList({
          packageType: this.form.type,
          classType: this.ApiConstants.smallGroup,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        this.coursePackageList = data.map((v) => {
          let nameZh, nameEn;
          v.coursePackageNameList?.forEach(({ languageCode, name }) => {
            if (languageCode === "CN") nameZh = name;
            if (languageCode === "EN") nameEn = name;
          });
          return { ...v, nameZh, nameEn };
        });
      } finally {
        this.coursePackageLoading = false;
      }
    },
    async queryPackageTreeList() {
      try {
        this.packageTreeLoading = true;
        const {
          status,
          data: { code, data },
        } = await this.$Api.groupManagement.queryPackageTreeList({
          packageId: this.form.coursePackageId,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        this.packageTreeList = data;
      } finally {
        this.packageTreeLoading = false;
      }
    },
  },
  created() {
    this.initData();
    this.queryClassPackageList();
  },
};
</script>
<style lang="scss" scoped>
.create-gt-wrap {
  padding: 5px;
  box-sizing: border-box;
  width: 100%;
  // .create-gt-in {
  // width: 50%;
  // }
  .add {
    display: inline-block;
  }
}
</style>
