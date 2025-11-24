<template>
  <div class="smass-class-adjust-dialog">
    <el-dialog
      :title="$t('小班课调课')"
      @close="$emit('close')"
      :visible.sync="show"
      width="1200px"
      height="500px"
    >
      <div class="search-contain">
        <el-select
          style="width: 13%"
          clearable
          v-model="reqData.team"
          :placeholder="$t('请选择负责团队')"
        >
          <el-option
            v-for="item in Constants.responsiblieTeam(currentLang)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          style="width: 13%"
          clearable
          v-model="reqData.className"
          :placeholder="$t('请输入') + $t('班级名称')"
        ></el-input>
        <el-select
          style="width: 13%"
          clearable
          v-model="reqData.languageLabel"
          :placeholder="$t('请选择语言标签')"
        >
          <el-option
            v-for="item in Constants.langList(currentLang)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          style="width: 13%"
          clearable
          v-model="reqData.ageLabel"
          :placeholder="$t('请选择年龄标签')"
        >
          <el-option
            v-for="item in Constants.ageList(currentLang)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-date-picker
          v-model="makeUpTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="~"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
        >
        </el-date-picker>
        <el-button @click="reqList" type="primary">{{ $t("查询") }}</el-button>
      </div>
      <el-table
        ref="singleTable"
        :data="list"
        height="400"
        highlight-current-row
        style="width: 100%; margin-top: 10px"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="zydescription"
      >
        <el-table-column type="expand">
          <template v-if="currentRowStudentList.length > 0">
            <p v-for="item in currentRowStudentList" :key="item.id">
              <span class="mr10">{{ item.realName }}</span>
              <span class="mr10" v-if="item.gender != 0 && item.gender != null"
                >{{ item.gender | mapGender
                }}<span v-if="currentLang === 'zh'">孩</span></span
              >
              <span class="mr10" v-else>{{ $t("性别未设置") }}</span>
              <span class="mr10"
                ><span v-if="currentLang === 'en'">Age </span>{{ item.age
                }}<span v-if="currentLang === 'zh'">岁</span></span
              >
              <span class="mr10"
                >{{ $t("现居") }}：
                {{ item.studentLocation ? item.studentLocation : "--" }}</span
              >
              <span class="mr10"
                >{{ $t("期望老师") }}：
                {{
                  item.expectTeacherStyle
                    ? handleTeacherStyle(item.expectTeacherStyle)
                    : "--"
                }}</span
              >
            </p>
          </template>
          <template v-else>
            <p>{{ $t("暂无数据") }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('负责团队')"
          prop="name"
          :width="currentLang == 'en' ? 130 : 100"
        >
          <template slot-scope="scope">
            <span>{{ Filters.teamFilter(scope.row.team,currentLang==="en") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('班级名称')"
          prop="name"
          width="120"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                path: `/groupManagement/classInfo`,
                query: { id: scope.row.classId, type: 2 },
              }"
            >
              <el-button type="text">{{ scope.row.classNameZh }}</el-button>
              <el-tag type="success" v-if="scope.row.languageLabel">{{
                scope.row.languageLabel | languageLabelFilter
              }}</el-tag>
              <el-tag type="danger" v-if="scope.row.ageLabel">{{
                scope.row.ageLabel | ageLabelFilter
              }}</el-tag>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('补课时间')"
          prop="name"
          width="140"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('补课课程')"
          :prop="currentLang === 'en' ? 'lessonDescEN' : 'lessonDescZH'"
          width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('已有学生')"
          prop="name"
          width="130"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.userNum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('剩余位置')"
          prop="name"
          width="135"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.userMax != null && scope.row.userNum != null"
              >{{ scope.row.userMax * 1 - scope.row.userNum * 1 }}</span
            >
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="center" :label="$t('操作')" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handlerMakeUpLessons(scope.row)">{{
              $t("补课")
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="reqData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </el-dialog>
    <el-dialog
      :title="$t('确定补课')"
      :visible.sync="sureDialog"
      width="600px"
      append-to-body
    >
      <h3>{{ $t("确定进入本课堂补课吗？") }}</h3>
      <div class="make-up-dialog">
        <el-row>
          <el-col :span="12">
            <el-row :gutter="10">
              <el-col :span="8">{{ $t("班级名称") }}</el-col>
              <el-col :span="16">{{ optRow.classNameZh }}</el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row :gutter="10">
              <el-col :span="8">{{ $t("上课时间") }}</el-col>
              <el-col :span="16">{{
                DateTimeUtils.dateClockTime(optRow.startTime)
              }}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row :gutter="10">
              <el-col :span="8">{{ $t("课程") }}</el-col>
              <el-col :span="16">
                <span>{{
                  currentLang === "en"
                    ? optRow.lessonDescEN
                    : optRow.lessonDescZH
                }}</span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row :gutter="10">
              <el-col :span="8">{{ $t("老师") }}</el-col>
              <el-col :span="16">{{ optRow.tutorRealName }}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sureDialog = false">{{ $t("取消") }}</el-button>
        <el-button type="primary" @click="submit">{{ $t("确定") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAdjustList,
  reqAdjust,
  getVirtualclassStudentList,
} from "@/api/groupManagement";
import { mapGetters } from "vuex";

export default {
  name: "smallClassAdjustDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    studentId: {
      type: String,
      default: "",
    },
    adjustVirtualclassId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      getRowKeys: (row) => {
        return row.classId;
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      expands: [],
      optRow: {},
      sureDialog: false,
      list: [],
      pageNum: 1,
      pageSize: 50,
      reqData: {
        ageLabel: "",
        className: "",
        languageLabel: "",
        team: "",
        startTimeBegin:'',
        startTimeEnd:'',
      },
      total: 1,
      currentRowStudentList: [],
      makeUpTime:[]
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  watch: {
    currentLang() {
      this.initData();
    },
    makeUpTime(time) {
      this.reqData.startTimeBegin=new Date(time[0]).toISOString()
      this.reqData.startTimeEnd=new Date(time[1]).toISOString()
    },
  },
  mounted() {
    this.reqList();
  },
  methods: {
    handleTeacherStyle(str) {
      let strarr = str.split("、"),
        newArr = [];
      strarr.forEach((item) => {
        newArr.push(this.$t(item));
      });
      return newArr.join("、");
    },
    zydescription(row, rowList) {
      if (rowList.length) {
        this.expands = [];
        if (row) {
          this.getRowStudentInfo(row.classId, row.vitualclassId);
        }
      } else {
        this.expands = [];
      }
    },
    getRowStudentInfo(id, vitualclassId) {
      getVirtualclassStudentList(vitualclassId).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.currentRowStudentList = data.data;
          this.expands.push(id); // 只展开当前行id
        } else {
          this.currentRowStudentList = [];
        }
      });
    },
    handlerMakeUpLessons(row) {
      this.optRow = row;
      this.sureDialog = true;
    },
    reqList() {
      getAdjustList(
        this.studentId,
        this.adjustVirtualclassId,
        this.pageNum,
        this.pageSize,
        this.reqData
      ).then((res) => {
        if (res.status == 200 && res.data.code == 200) {
          this.list = res.data.data.list || [];
          this.total = res.data.data.total;
        }
      });
    },
    getCurrentPage(page) {
      this.pageNum = page;
      this.reqList();
    },
    getPerPage(perPage) {
      this.pageSize = perPage;
      this.reqList();
    },
    submit() {
      let reqData = {
        adjustVirtualclassId: this.adjustVirtualclassId,
        classId: this.optRow.classId,
        repairVirtualclassId: this.optRow.vitualclassId,
        studentUserId: this.studentId,
      };
      reqAdjust(reqData).then(({ status, data: { code } }) => {
        if (status !== 200 || code !== 200) return Promise.reject()
        this.$notify({
          message: this.$t("调课成功"),
          type: "success",
        });
        this.sureDialog = false;
        this.$emit("close");
        this.$emit("success");
      });
    },
  },
};
</script>
<style lang='scss'>
.make-up-dialog {
  .el-row {
    margin-bottom: 10px;
  }
}
</style>
