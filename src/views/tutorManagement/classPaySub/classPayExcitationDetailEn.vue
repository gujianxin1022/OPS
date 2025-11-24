<template>
  <div class="part-time-detail-wrap">
    <!-- <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="新数据"
        :name="DATA_TYPE.NEW"
      ></el-tab-pane>
      <el-tab-pane
        label="老数据"
        :name="DATA_TYPE.OLD"
      ></el-tab-pane>
    </el-tabs> -->

   
    <div class="table-wrap">

      <el-collapse>
        <el-collapse-item :title="$t('转化奖励')" v-if="tableData.transferFeeList && tableData.transferFeeList.length > 0">
          <!-------------- 转化奖励 --------------------->
          <!-- <div class="title">
            <span>
              {{ $t("转化奖励") }}
            </span>
          </div> -->

          <el-table
            :border="false"
            :data="tableData.transferFeeList"
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
                slot-scope="scope">{{  scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('支付时间')"
              prop="payTime"
              min-width="100"
            >
              <template slot-scope="scope">
                <span>{{ DateTimeUtils.dateClockTime(scope.row.payTime) }}</span>
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
              :label="$t('家长ID')"
              prop="parentUserId"
              min-width="100"
            >

            </el-table-column>

            <el-table-column
              align="center"
              :label="$t('激励')"
              prop="fee"
              min-width="100"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.salaryCurrencyStr + (scope.row.fee || 0) }}</span>
              </template>
            </el-table-column>

          </el-table>
        </el-collapse-item>

        <el-collapse-item :title="$t('全勤奖励')" v-if="tableData.fullAttendFeeList && tableData.fullAttendFeeList.length > 0">  
          <!-------------- 全勤奖励 --------------------->
          <!-- <div class="title">
            <span>
              {{ $t("全勤奖励") }}
            </span>
          </div> -->

          <el-table
            :border="false"
            :data="tableData.fullAttendFeeList"
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
                slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>

            <el-table-column
              align="center"
              :label="$t('上课数量')"
              prop="virtualclassNum"
              min-width="100"
            >
            </el-table-column>

            
            <el-table-column
              align="center"
              :label="$t('激励')"
              prop="fee"
              min-width="100"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.salaryCurrencyStr + (scope.row.fee || 0) }}</span>
              </template>
            </el-table-column>

          </el-table>
        </el-collapse-item>



        <el-collapse-item v-if="tableData.LevelFeeList && tableData.LevelFeeList.length > 0">
          <template slot="title">
            <div style="width: 100%"> 
              <span> {{ $t('等级额外激励') }} </span>
            </div>
          </template>
          <el-table
            :border="false"
            :data="tableData.LevelFeeList"
            v-loading="loading"
            tooltip-effect="dark"
            fit
            show-overflow-tooltip="true"
            style="width: 100%;margin-top:10px"
            stripe
            :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
          >

            <template>
              <el-table-column
                type="index"
                :label="$t('序号')"
                width="100"
                >
              </el-table-column>
              

              <el-table-column
                :label="$t('上课时间')"
                min-width="150"
                >
                <template slot-scope="{row}">
                  {{DateTimeUtils.dateClockTime(row.startTime)}}
                </template>
              </el-table-column>


              <el-table-column
                align="center"
                :label="$t('上课数量')"
                prop="virtualclassNum"
                min-width="100"
              >
              </el-table-column>

              <el-table-column
                align="center"
                :label="$t('激励')"
                prop="fee"
                min-width="100"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.salaryCurrencyStr + (scope.row.fee || 0)   }}</span>
                  </template>
                </el-table-column>
            </template>

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
  name: 'classPayExcitationDetailEn',
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
      tableData: {
        fullAttendFeeList: [],
        transferFeeList: [],
        LevelFeeList: [],
      },
      loading: false,
  
    }
  },

  methods: {
    // 获取老师表格数据
    getTableData () {
      this.loading = true
      var tutorType = 1,
        tutorId = this.tutorId,
        params = {
          month: this.time,
          tutorUserId: tutorId,
        }
      this.$Api.tutorManagement.getEnTutorExcitationDetail(
         params
      )
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData.fullAttendFeeList = data.data.fullAttendFeeList
            this.tableData.transferFeeList = data.data.transferFeeList
            if(data.data.levelFee && (data?.data?.levelFee?.fee || data?.data?.levelFee?.virtualclassNum || data?.data?.levelFee?.startTime)){
              this.tableData.LevelFeeList.push(data.data.levelFee)
            }
            this.loading = false
          }
          else {
            return Promise.reject()
          }
        }).catch(() => {
          this.loading = false
          this.tableData = {
            fullAttendFeeList: [],
            transferFeeList: [],
            LevelFeeList: [],
          }
        })
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