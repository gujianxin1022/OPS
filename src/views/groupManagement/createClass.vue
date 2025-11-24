<template>
  <el-card class="box-card-class" shadow="hover">
    <div slot="header" class="clearfix">
      <span>{{ $t("创建班级") }}</span>
    </div>
    <el-form ref="ruleForm" :model="form" :rules="rules" :label-width="currentLang === 'en' ? '200px' : '120px'">
      <el-form-item :label="$t('班级中文名称')" prop="groupNameZh">
        <el-input
          class="w200"
          v-model="form.groupNameZh"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '' : '班级中文名称')
          "
        />
      </el-form-item>
      <el-form-item :label="$t('班级英文名称')" prop="groupNameEn">
        <el-input
          class="w200"
          v-model="form.groupNameEn"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '' : '班级英文名称')
          "
        />
      </el-form-item>
      <el-form-item :label="$t('班型类型')" prop="type">
        <el-radio-group v-model="form.type" @change="handleTypeChange">
          <el-radio :label="AUDITION_COURSE">{{$t('试听课程')}}</el-radio>
          <el-radio :label="FORMAL_COURSE">{{$t('正式')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('课程包')" prop="coursePackageId">
        <el-select
          class="w200"
          filterable
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
        <el-form-item :label="$t('班级课程')" prop="packageTreeId">
          <el-select
            class="w200"
            v-model="form.packageTreeId"
            :placeholder="$t('版本')"
            :loading="packageTreeLoading"
            @change="handlePackageTreeChange"
          >
            <el-option
              v-for="item of packageTreeList"
              :key="item.packageTreeId"
              :label="currentLang === 'en' ? item.editionNameOpsEn : item.editionNameOpsZh"
              :value="item.packageTreeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="courseHierarchyIds" :style="{marginLeft: currentLang === 'en' ? '-195px' : '-115px'}">
          <el-cascader
            class="w200"
            v-model="form.courseHierarchyIds"
            :options="courseHierarchyList"
            :props="{value: 'id', label: 'name'}"
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
      <el-form-item :label="$t('班级容量')" prop="userMax">
        <el-input-number
          class="w200"
          size="small"
          :max="15"
          :min="4"
          v-model="form.userMax"
        />
      </el-form-item>
      <el-form-item :label="$t('招生地区')" prop="studentArea">
        <el-select
          class="w200"
          :disabled="groupScale == 2"
          v-model="form.studentArea"
          :placeholder="$t('my-home-Select')"
        >
          <el-option
            v-for="item in areaList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('收费标准')" prop="chargingStandard">
        <el-select
          class="w200"
          v-model="form.chargingStandard"
          :placeholder="$t('my-home-Select')"
        >
          <el-option
            v-for="item in Constants.getMoneyList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('排课方式')" prop="style">
        <el-radio-group v-model="form.style">
          <el-radio :label="1">{{ $t("单次排课") }}</el-radio>
          <el-radio :label="2">{{ $t("按天重复排课") }}</el-radio>
          <el-radio :label="3">{{ $t("按周重复排课") }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 单次排课 start -->
      <div
        class="m-classtime-wrap"
        v-show="form.style == Constants.singleSetClass"
      >
        <el-form-item :label="$t('开课日期')">
          <el-date-picker
            class="w200"
            v-model="form.startDateTime"
            type="date"
            :picker-options="pickerOptions"
            :placeholder="$t('选择日期')"
          />
        </el-form-item>
        <div class="clear-fix">
          <span class="c-custom-label" :style="{ width: currentLang === 'en' ? '200px' : '120px' }">{{ $t("上课时间") }}</span>
          <div class="left">
            <div class="mb10">
              <el-select
                class="w200"
                v-model="startClassTimeIndex"
                :placeholder="$t('选择时间段')"
              >
                <el-option
                  v-for="(item, index) in Constants.startClassTimeData"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-time-select
                class="w200"
                v-model="form.startClassTime"
                :picker-options="startClassTimeObj"
                :placeholder="$t('选择时间')"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 单次排课 end -->

      <!-- 按天排课start -->
      <div class="clear-fix" v-show="form.style == Constants.byDaySetClass">
        <div class="clear-fix">
          <span class="c-custom-label" :style="{ width: currentLang === 'en' ? '200px' : '120px' }">{{ $t("上课时间") }}</span>
          <div class="left mb10">
            <div>
              <el-select
                class="w200"
                v-model="startClassTimeIndex"
                :placeholder="$t('选择时间段')"
              >
                <el-option
                  v-for="(item, index) in Constants.startClassTimeData"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-time-select
                class="w200"
                v-model="form.startClassTime"
                :picker-options="startClassTimeObj"
                :placeholder="$t('选择时间')"
              />
            </div>
          </div>
        </div>
        <el-form-item :label="$t('开课日期')">
          <el-date-picker
            class="w200"
            v-model="form.startDateTime"
            type="date"
            :picker-options="pickerOptions"
            :placeholder="$t('选择日期')"
          />
        </el-form-item>
      </div>
      <!-- 按天排课end -->
      <!-- 按周排课 start -->
      <div
        class="m-classtime-wrap"
        v-show="form.style == Constants.byWeekSetClass"
      >
        <div class="clear-fix">
          <span class="c-custom-label" :style="{ width: currentLang === 'en' ? '200px' : '120px' }">{{ $t("上课时间") }}</span>
          <div class="left">
            <div
              class="mb10"
              v-for="(item, index) in weekStartClassTime"
              :key="index"
            >
              <el-select v-model="item.week" :placeholder="$t('请选择周几')" class="w200">
                <el-option :label="$t('周一')" :value="1"></el-option>
                <el-option :label="$t('周二')" :value="2"></el-option>
                <el-option :label="$t('周三')" :value="3"></el-option>
                <el-option :label="$t('周四')" :value="4"></el-option>
                <el-option :label="$t('周五')" :value="5"></el-option>
                <el-option :label="$t('周六')" :value="6"></el-option>
                <el-option :label="$t('周日')" :value="0"></el-option>
              </el-select>
              <el-select v-model="item.timeInd" :placeholder="$t('选择时间段')" class="w200">
                <el-option
                  v-for="(ite, i) in Constants.startClassTimeData"
                  :key="i"
                  :label="ite.label"
                  :value="ite.value"
                />
              </el-select>
              <el-time-select
                class="w200"
                v-model="item.time"
                :picker-options="Constants.startClassTimeOfData[item.timeInd]"
                :placeholder="$t('选择时间')"
              />
              <div class="add" @click="addWeekTime(item, index)">
                <i class="el-icon-circle-plus-outline"></i>
              </div>
              <div class="add" @click="reduceWeekTime(item, index)">
                <i class="el-icon-remove-outline"></i>
              </div>
            </div>
          </div>
        </div>
        <el-form-item :label="$t('开课日期')">
          <el-date-picker
            class="w200"
            v-model="form.startDateTime"
            type="date"
            :picker-options="pickerOptions"
            :placeholder="$t('选择日期')"
          />
        </el-form-item>
      </div>
      <!-- 按周排课 end -->

      <div v-show="form.style != Constants.singleSetClass">
        <el-form-item :label="$t('结束方式')">
          <el-radio-group v-model="form.method">
            <el-radio :label="1">{{ $t("按课节总数") }}</el-radio>
            <el-radio :label="2">{{ $t("按日期结束") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="form-one-line" v-show="form.method == 1">
          <el-form-item :label="$t('课节总数')">
            <el-input class="w200" v-model="form.classSum" />
          </el-form-item>
          <el-link class="ml10" type="primary" @click="showPreviewList">
            {{ $t("预排课") }}
          </el-link>
        </div>
        <div class="form-one-line" v-show="form.method == 2">
          <el-form-item :label="$t('结束日期')">
            <el-date-picker
              class="w200"
              v-model="form.endDateTime"
              type="date"
              :picker-options="pickerOptions"
              :placeholder="$t('选择日期')"
            />
            <el-link class="ml10" type="primary" @click="showPreviewList">
              {{ $t("预排课") }}
            </el-link>
          </el-form-item>
        </div>
      </div>
      <el-form-item>
        <!-- <el-button @click="$router.go( -1 )">取消</el-button> -->
        <el-button type="primary" @click="onSubmit" :loading="createLoading">
          {{ $t("创建班级") }}
        </el-button>
      </el-form-item>
    </el-form>
    <PreviewsetList
      :show="showPreview"
      @close="showPreview = false"
      @removeRow="removeRow"
      :startTimes="startTimes"
    />
  </el-card>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { AUDITION_COURSE /* 试听课 */, FORMAL_COURSE /* 正式课 */ } from "@/utils/constants"

import PreviewsetList from "./components/previewsetList.vue";

export default {
  name: "createClass",
  components: {
    PreviewsetList,
  },
  data() {
    return {
      AUDITION_COURSE,
      FORMAL_COURSE,
      form: {
        type: AUDITION_COURSE,
        coursePackageId: '',
        packageTreeId: '',
        courseHierarchyIds: [],
        style: 1, //排课方式
        method: "", //结束方式
        groupNameZh: "", //中文名
        groupNameEn: "", //英文名
        chargingStandard: "", //收费标准
        startDateTime: "", // 开课日期
        endDateTime: "", // 结束日期
        startClassTime: "", // 上课时间
        classSum: "",
        userMax: 6,
        studentArea: "",
      },
      areaList: [
        { label: "北美", value: "北美" },
        { label: "亚欧", value: "亚欧" }
      ],
      createLoading: false,
      coursePackageList: [],
      coursePackageLoading: false,
      packageTreeList: [],
      packageTreeLoading: false,
      courseHierarchyList: [],
      value: "",
      showPreview: false,
      startClassTimeIndex: "",
      startClassTimeObj: {},
      startTimes: [],
      weekStartClassTime: [
        {
          week: "",
          timeInd: "",
          time: ""
        }
      ], //周格式
      isRemoved: false,
      pickerOptions: {
        // 判断是否日历上的日期是否小于当前日期
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      rules: null,
      groupScale: null
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
    style() {
      return this.form.style;
    },
    method() {
      return this.form.method;
    }
  },
  watch: {
    currentLang() {
      this.initData();
    },
    method() {
      this.startTimes = [];
      this.form.classSum = "";
      this.isRemoved = false;
    },
    style(newDate) {
      this.form.startClassTime = "";
      this.startClassTimeIndex = "";
      this.form.startDateTime = "";
      this.startTimes = [];
    },
    startClassTimeIndex(newData, oldData) {
      this.startClassTimeObj = this.Constants.startClassTimeOfData[newData];
    }
  },
  created() {
    this.initData();
    this.groupScale = this.$route.query.type;
    this.queryClassPackageList()
  },
  mounted() {
    this.setPageTitle("创建班级");
  },
  methods: {
    ...mapMutations({
      setPageTitle: "SET_PAGE_TITLE"
    }),
    handleTypeChange() {
      this.form.coursePackageId = '';
      this.form.packageTreeId = '';
      this.form.courseHierarchyIds = [];
      this.coursePackageList = [];
      this.packageTreeList = [];
      this.courseHierarchyList = [];
      this.queryClassPackageList();
    },
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
      const { status , data: { code, data } } = await this.$Api.groupManagement.getCourseHierarchyData({
        packageId: this.form.coursePackageId,
        packageTreeId: this.form.packageTreeId
      })
      if (status !== 200 || code !== 200) return Promise.reject();
      this.courseHierarchyList = data;
    },
    initData() {
      this.rules = {
        groupNameZh: [{ required: true, message: this.$t("班级中文名不能为空"), trigger: "blur" }],
        type: [{ required: true, message: this.$t('请选择班型类型'), trigger: 'change' }],
        coursePackageId: [{ required: true, message: this.$t("课程包不能为空"), trigger: "change" }],
        packageTreeId: [{ required: true, trigger: 'change', message: this.$t('请选择版本')}],
        courseHierarchyIds: [{required: true, trigger: 'change', message: this.$t('请选择级别、单元、lesson') }],
        chargingStandard: [{ required: true, message: this.$t("收费标准不能为空"), trigger: "change" }],
        editionName: [{ required: true, message: this.$t("班级课程不能为空"), trigger: "change" }],
        style: [{ required: true, message: this.$t("排课方式不能为空"), trigger: "change" }],
      };
    },
    addWeekTime(item, index) {
      this.weekStartClassTime.push({
        week: "",
        timeInd: "",
        time: ""
      });
    },
    reduceWeekTime(item, index) {
      this.weekStartClassTime.splice(index, 1);
    },
    strUnit(unit) {
      return `unit${unit}`;
    },
    onSubmit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.createLoading = true;
          let {
            groupNameZh, //中文名
            groupNameEn, //英文名
            chargingStandard, //收费标准
            studentArea,
            coursePackageId,
            packageTreeId,
            courseHierarchyIds: [courseLevel, unitNo, lessonId],
          } = this.form;

          // 判断是否进行过删除操作，如果删除过数据，那么就不重新计算数据，用删除之后的startTimes
          // if(!this.isRemoved) {
          this.setClassData();
          // }

          let start_times = [];
          // 格式化时间，改成 yyyy-mm-dd hh:mm:ss 这样的格式传给后端
          this.startTimes.forEach(item => {
            start_times.push(new Date(item).toISOString());
          });

          if (start_times.length == 0) {
            this.$notify({
              message: "未给班级排课",
              type: "error"
            });
            this.createLoading = false;
            return;
          }

          let params = {
            classNameZh: groupNameZh,
            className: groupNameEn,
            classCategory: chargingStandard,
            courseLevel,
            lessonId,
            startTimeList: start_times,
            userMax: this.form.userMax,
            studentArea: studentArea,
            coursePackageId,
            packageTreeId,
            subjectType: this.coursePackageList.find(v => v.packageId === coursePackageId).subjectType
          };
          if (params.className.trim() == "") {
            params.className = params.classNameZh;
          }
          if (params.classNameZh.trim() == "") {
            this.$notify({
              message: this.$t("班级中文名不能为空"),
              type: "error"
            });
            this.createLoading = false;
            return;
          }
          if (isNaN(params.userMax)) {
            this.$notify({
              message: this.$t("班级容量请输入有效数字"),
              type: "error"
            });
            this.createLoading = false;
            return;
          }
          if (this.groupScale == 2) {
            params.studentArea = null;
            this.$Api.groupManagement.createSmallClass(params).then(res => {
              if (res.status == 200 && res.data.code == 200) {
                this.$notify({
                  message: this.$t("创建班级成功"),
                  type: "success"
                });
                let id = res.data.data;
                window.sessionStorage.setItem("group", id);
                this.$router.push(
                  "/groupManagement/classInfo?id=" + id + "&type=" + 2
                );
                this.createLoading = false;
              }
              this.createLoading = false;
            });
          } else if (this.groupScale == 3) {
            this.$Api.groupManagement.createBigClass(params).then(res => {
              if (res.status == 200 && res.data.code == 200) {
                this.$notify({
                  message: this.$t("创建班级成功"),
                  type: "success"
                });
                let id = res.data.data;
                window.sessionStorage.setItem("group", id);
                this.$router.push(
                  "/groupManagement/classInfo?id=" + id + "&type=" + 3
                );
                this.createLoading = false;
              }
              this.createLoading = false;
            });
          }
        }
      });
    },
    /**
     * 排课方式的几个处理方案
     */
    setClassData() {
      if (this.isRemoved) {
        return;
      }
      this.startTimes = [];
      let {
        style, //排课方式
        method, //结束方式
        startDateTime, // 开课日期
        endDateTime, // 结束日期
        classSum //按照课时的课时总数
      } = this.form;
      if (style == 1) {
        /**单次排课的提交方法 */
        if (
          !this.getAndSetDate(this.form.startDateTime, this.form.startClassTime)
        ) {
          this.$notify({
            message: "上课时间未填写",
            type: "error"
          });
          return false;
        }
        let date = this.getAndSetDate(
          this.form.startDateTime,
          this.form.startClassTime
        );
        this.startTimes.push(date);
      } else if (style == 2) {
       
        let date = this.getAndSetDate(
          this.form.startDateTime,
          this.form.startClassTime
        );
        if (method == 1) {
          if (!classSum) {
            this.$notify({
              message: "课节总数未填写",
              type: "error"
            });
            return;
          }
          // 循环课节总数，推算时间 push 到数组里传给后台
          for (var i = 0; i < classSum * 1; i++) {
            this.startTimes.push(this.DateTimeUtils.getDateStr(date, i));
          }
        } else if (method == 2) {
          if (!endDateTime) {
            this.$notify({
              message: "结束日期未选择",
              type: "error"
            });
            return;
          }
          // 按结束日期推算 开始 - 结束 共计几天，循环push
          let DifferenceValue = endDateTime.getTime() - startDateTime.getTime();
          let days = Math.floor(DifferenceValue / (24 * 3600 * 1000));
          for (var i = 0; i <= days; i++) {
            this.startTimes.push(this.DateTimeUtils.getDateStr(date, i));
          }
        }
      } else if (style == 3) {
        if (method == 1) {
          if (!classSum) {
            this.$notify({
              message: "课节总数未填写",
              type: "error"
            });
            return;
          }
          let weekArr = [];
          this.weekStartClassTime.forEach(item => {
            weekArr.push({
              week: item.week,
              time: item.time
            });
          });
          var i = 0;
          while (this.startTimes.length < classSum * 1) {
            let day = new Date(
              this.DateTimeUtils.getDateStr(this.form.startDateTime, i)
            );
            let flag = weekArr.filter(item => item.week == day.getDay());
            if (flag.length != 0) {
              flag.forEach(ite => {
                if (this.startTimes.length < classSum * 1) {
                  this.startTimes.push(this.getAndSetDate(day, ite.time));
                }
              });
            } else {
            }
            i++;
          }
        } else if (method == 2) {
          if (!endDateTime) {
            this.$notify({
              message: "结束日期未选择",
              type: "error"
            });
            return;
          }
          let DifferenceValue = endDateTime.getTime() - startDateTime.getTime();
          let days = Math.floor(DifferenceValue / (24 * 3600 * 1000));
          let weekArr = [];
          this.weekStartClassTime.forEach(item => {
            weekArr.push({
              week: item.week,
              time: item.time
            });
          });

          for (var i = 0; i <= days; i++) {
            let day = new Date(
              this.DateTimeUtils.getDateStr(this.form.startDateTime, i)
            );
            let flag = weekArr.filter(item => item.week == day.getDay());
            if (flag.length != 0) {
              flag.forEach(ite => {
                this.startTimes.push(this.getAndSetDate(day, ite.time));
              });
            } else {
            }
          }
        }
      }
    },
    removeRow(index) {
      this.isRemoved = true;
      this.startTimes.splice(index, 1);
      this.form.classSum = this.startTimes.length;
      this.$notify({
        message: "删除成功",
        type: "success"
      });
    },
    showPreviewList() {
      this.setClassData();
      this.showPreview = true;
    },
    // 根据日期和时间转换拼接的方法
    getAndSetDate(date, time) {
      if (date instanceof Date) {
        let fdate = new Date(date).toLocaleDateString(),
          h = time.split(":")[0] * 1,
          m = time.split(":")[1] * 1;
        let rdate = `${fdate} ${h}:${m}`;
        return new Date(rdate).toISOString();
      } else {
        return "";
      }
    },
    async queryClassPackageList() {
      try {
        this.coursePackageLoading = true
        const {
          status,
          data: { code, data },
        } = await this.$Api.groupManagement.queryClassPackageList({
          packageType: this.form.type,
          classType: this.ApiConstants.smallGroup
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
        this.coursePackageLoading = false
      }
    },
    async queryPackageTreeList() {
      try {
        this.packageTreeLoading = true
        const {
          status,
          data: { code, data },
        } = await this.$Api.groupManagement.queryPackageTreeList({
          packageId: this.form.coursePackageId,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        this.packageTreeList = data;
      } finally {
         this.packageTreeLoading = false
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.m-classtime-wrap {
  .add {
    display: inline-block;
  }
}
</style>
