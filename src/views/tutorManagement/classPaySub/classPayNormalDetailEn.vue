<template>
  <div class="part-time-detail-wrap">
   
    <div class="table-wrap">
      <el-table
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        show-overflow-tooltip="true"
        style="width: 100%;margin-top:10px"
        stripe
        :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
      >
        <el-table-column
          align="center"
          :label="$t('序号')"
          width="100"
        >
          <template
            slot-scope="scope">{{ (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('上课时间')"
          prop="startTime"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('学生')"
          prop="studentName"
          min-width="100"
        ></el-table-column>

        <el-table-column
          align="center"
          :label="$t('课程名称')"
          prop="editionName"
          min-width="150"
        >

        </el-table-column>

        <el-table-column
          align="center"
          :label="$t('课程类型')"
          min-width="100"
        >
          <template slot-scope="scope">
            <span> {{ setCourseTypeContent(scope.row.courseType) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$t('班型')"
        >
          <template slot-scope="scope">
            <span>{{ setClassTypeContent(scope.row.classTypeId) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$t('时长')"
          prop="duration"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.duration }} {{ $t('分钟') }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$t('课堂状态')"
          prop="virtualClassStatus"
          min-width="100"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.status"></span>
            <span
              v-else>{{ scope.row.status === 3 ? $t('正常完课') : $t('异常完课') }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$t('老师出席')"
          prop="teacherAttendStatus"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ Constants.getTeacherAttendStatus(
                        currentLang,
                        scope.row.teacherAttendStatus
                      ) 
                  }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$t('学生出席')"
          prop="stdudentAttendStatus"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{  Constants.getStudentAttendStatus(
                        currentLang,
                        scope.row.studentAttendStatus
                      ) 
                  }}
            </span>
          </template>
        </el-table-column>

        <template v-if="businessLine === '1' || businessLine === '3'">
          <el-table-column
            fixed = "right"
            prop="originBaseFee"
            :label="$t('小班课补助')"
            min-width="100"
            >
            <template slot-scope="scope">
              <span>{{ scope.row.salaryCurrencyStr + (scope.row.smallClassFee || 0) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            fixed = "right"
            prop="originBaseFee"
            :label="$t('凌晨补助')"
            min-width="100"
            >
            <template slot-scope="scope">
              <span>{{ scope.row.salaryCurrencyStr + (scope.row.weeFee || 0) }}</span>
            </template>
          </el-table-column>
        </template>

        <el-table-column
          align="center"
          :label="$t('标准课时费')"
          prop="originBaseFee"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.salaryCurrencyStr + (scope.row.originBaseFee || 0)  }} </span>
          </template>
        </el-table-column>

        <el-table-column
          fixed = "right"
          :label="$t('操作')"
          min-width="100"
        >
          <template slot-scope="scope">
            <div class="appeal-content" @click="openDetailDiag(scope.row)">{{$t('明细')}}</div>
          </template>
        </el-table-column>

      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
    <detail-diag :isShowDetailDiag="isShowDetailDiag" @closeDetailDiag="closeDetailDiag" :detailData="detailData"></detail-diag>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import detailDiag from './detailDiag.vue';
export default {
  name: 'classPayNormalDetailEn',
  components: {
    detailDiag
  },
  props: {
    tutorId: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true  
    },
    tutorName: {
      type: String,
      required: true
    },
    businessLine: {
      type: String,
      required: true
    }
  },
  data () {
    return {

      allDataList: [
        { name: 1 }
      ],
      tableData: [
        { name: 1 }
      ],
      loading: false,
      isShowDetailDiag: false,
      detailData: null,
      total: 0,
      screenData: {
        pageNum: 1,
        pageSize: 50
      },
    }
  },

  computed: {
    ...mapGetters(['currentLang']),
  },

  methods: {
    // 设置课程类型文案
    setCourseTypeContent(courseType) {
      if (courseType === undefined || courseType === null) return "--";
      return courseType === 0 ? this.$t("试听课") : this.$t("正式课");
    },

    setClassTypeContent(classType) {
      switch(classType) {
        case 1:
          return "1v1";
        case 2:
          return this.$t("小班课");
        default:
          return "--";
      }
    },

    // 获取老师表格数据
    getTableData () {
      this.loading = true
      var tutorType = 1,
        tutorId = this.tutorId,
        params = {
          month: this.time,
          tutorUserId: tutorId
        }

      this.$Api.tutorManagement.getEnTutorDetail(
        params
      )
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.allDataList = data.data || [];

            this.setTableData();
            this.total = this.allDataList.length
            this.loading = false
          }
          else {
            return Promise.reject()
          }
        }).catch(() => {
          this.loading = false
          this.tableData = []
          this.total = 0
        })
    },
    getCurrentPage (page) {
      this.screenData.pageNum = page
      this.setTableData();
    },
    getPerPage (perPage) {
      this.screenData.pageSize = perPage
      this.setTableData();
    },
    setTableData() {
      let pageNum = this.screenData.pageNum,
          pageSize = this.screenData.pageSize;

      this.tableData = this.allDataList.slice((pageNum-1)*pageSize, pageNum*pageSize);

    },
    openDetailDiag(row) {
      if (!row) return;
      this.isShowDetailDiag = true
      this.detailData = row
    },
    closeDetailDiag() {
      this.isShowDetailDiag = false
    }
  },
  created () {
    this.getTableData();
  }
}
</script>
<style lang="scss" scoped>
.part-time-detail-wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  .top-message-wrap {
    width: 100%;
    font-size: 14px;
  }
  .center-datashow-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
  }
  .card-flex {
    width: 49%;
    padding: 0 10px;
    padding: 0;
  }
  .card-inner {
    width: 100%;
    height: 102px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    font-size: 14px;
    box-sizing: border-box;
    .card-inner-font-weight {
      font-weight: bold;
      font-size: 16px;
    }
  }
  .appeal-content {
    font-size: 14px;
    font-weight: normal;
    color: #7580E5;
    line-height: 28px;
    cursor: pointer;
    span {
      color: #666666;
      padding-right: 5px;
    }
  }
}
</style>