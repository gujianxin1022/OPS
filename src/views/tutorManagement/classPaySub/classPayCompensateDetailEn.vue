<template>
  <div class="part-time-detail-wrap">
    <div class="table-wrap">
      <el-collapse>
        <el-collapse-item :title="$t('学生取消')" v-if="tableData.cancelFeeList && tableData.cancelFeeList.length > 0">
          <el-table
            :border="false"
            :data="tableData.cancelFeeList"
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
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('取消时间')"
              prop="cancelTime"
              min-width="100"
            >
              <template slot-scope="scope">
                <span>{{ DateTimeUtils.dateClockTime(scope.row.cancelTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('上课时间')"
              prop="startTime"
              min-width="150"
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
            >
              <template slot-scope="scope">
                <span>{{scope.row.studentName ? scope.row.studentName : "-"}}</span>
              </template>
            </el-table-column>
            
            <el-table-column
              align="center"
              :label="$t('课程名称')"
              prop="editionName"
              min-width="150"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.editionName }}</span>
              </template>
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
              :label="$t('时长')"
              prop="duration"
              min-width="100"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.duration }} {{ $t('分钟') }}</span>
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              align="center"
              :label="$t('补偿')"
              prop="fee"
              min-width="100"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.salaryCurrencyStr + (scope.row.fee || 0) }}</span>
              </template>
            </el-table-column>

          </el-table>
        </el-collapse-item>
      

      <el-collapse-item :title="$t('人工补偿')" v-if="tableData.artificialFeeList && tableData.artificialFeeList.length > 0">
        <el-table
          :border="false"
          :data="tableData.artificialFeeList"
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
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            :label="$t('上课时间')"
            prop="startTime"
            min-width="150"
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
          >
            <template slot-scope="scope">
              <span>{{scope.row.studentName ? scope.row.studentName : "-"}}</span>
            </template>
          </el-table-column>

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
            :label="$t('原因')"
            prop="reason"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{  $t(Filters.newCorrectReasonFilter(scope.row.reason)) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            align="center"
            :label="$t('补偿')"
            prop="fee"
            min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.salaryCurrencyStr + (scope.row.fee || 0) }}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-collapse-item>
      


      <el-collapse-item :title="$t('其他补偿')" v-if="tableData.otherFeeList && tableData.otherFeeList.length > 0">
        <el-table
          :border="false"
          :data="tableData.otherFeeList"
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
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('处理时间')"
            prop="createTime"
            min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ DateTimeUtils.dateClockTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          

          <el-table-column
            align="center"
            :label="$t('原因')"
            prop="reason"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.reason }}</span>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            align="center"
            :label="$t('补偿')"
            prop="fee"
            min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.salaryCurrencyStr + (scope.row.fee || 0) }}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-collapse-item>

      <el-collapse-item :title="$t('课堂补偿')" v-if="tableData.courseFeeList && tableData.courseFeeList.length > 0">
        <el-table
          :border="false"
          :data="tableData.courseFeeList"
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
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
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
            :label="$t('课堂ID')"
            prop="virtualclassId"
            min-width="150"
          >
          </el-table-column>
          <el-table-column
              align="center"
              :label="$t('上课时间')"
              prop="startTime"
              min-width="150"
            >
              <template slot-scope="scope">
                <span>{{ DateTimeUtils.dateClockTime(scope.row.startTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('版本名称')"
              prop="editionName"
              min-width="150"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('课程类型')"
              min-width="150"
            >
            <template slot-scope="scope">
              <span> {{ setCourseTypeContent(scope.row.courseType) }}</span>
            </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('时长')"
              min-width="150"
            >
            <template slot-scope="scope">
              <span>{{ scope.row.duration }} {{ $t("分钟") }}</span>
            </template>
            </el-table-column>
            <el-table-column
                align="center"
                :label="$t('补偿金额')"
                prop="fee"
                min-width="150"
              >
              <template slot-scope="scope">
                <span>{{ scope.row.salaryCurrencyStr + (scope.row.fee || 0) }}</span>
              </template>
              </el-table-column>
        </el-table>
      </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

const DATA_TYPE = {
  NEW: 1,
  OLD: 2
}
const CLASS_PAY_TYPE = {
  NORMAL: 1,
  DEDUCTION: 2,
  COMPENSATE: 3,
  EXCITATION: 4
}

export default {
  name: 'classPayCompensateDetailEn',
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
    }
  },
  data () {
    return {
      DATA_TYPE,
      activeName: DATA_TYPE.NEW,
      CLASS_PAY_TYPE,
      activePayType: CLASS_PAY_TYPE.NORMAL,
      tableData: { 
        artificialFeeList: [],
        cancelFeeList: [],
        otherFeeList: [],
        courseFeeList: [],
      },
      loading: false,

    }
  },

  methods: {
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
      this.$Api.tutorManagement.getEnTutorCompensateDetail(
        params
      )
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data
            this.tableData.courseFeeList = data.data.courseFeeList.filter(item => item.fee !== 0)
            this.loading = false
          }
          else {
            return Promise.reject()
          }
        }).catch(() => {
          this.loading = false
          this.tableData = { 
            artificialFeeList: [],
            cancelFeeList: [],
            otherFeeList: [],
            courseFeeList: [],
          }
        })
    },

  },
  created () {
    this.getTableData()
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

  ::v-deep .el-collapse-item__header {
    height: 60px; // 增加头部高度
    line-height: 60px; // 调整行高以垂直居中文本
  }

  ::v-deep .el-table {
    &::after {
      display: none; // 去掉表格最后的横线
    }
  }
}
</style>