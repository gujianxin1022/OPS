<template>
    <div>
      <el-dialog
        :visible.sync="isShowDetailDiag"
        width="600px"
        :before-close="closeDetailDiag"
        :modal-append-to-body="false"
        :show-close="true"
        :close-on-click-modal="false"
        :title="$t('明细')"
      >
          <div class="detail-content" v-if="detailData">
              <div class="detail-content-item">
                  <div class="detail-content-item-label">
                      <span>{{ $t('课程名称') + ':' }}</span>
                  </div>
                  <div class="detail-content-item-value">
                      <span>{{ detailData.editionName }}</span>
                  </div>
              </div>
              <div class="detail-content-item">
                  <div class="detail-content-item-label">
                      <span>{{ $t('课程类型') + ':' }}</span>
                  </div>
                  <div class="detail-content-item-value">
                      <span>{{ detailData.courseType == 0 ? $t("试听") : $t("正式") }}</span>
                  </div>
              </div>
              <div class="detail-content-item">
                  <div class="detail-content-item-label">
                      <span>{{ $t('班型') + ':' }}</span>
                  </div>
                  <div class="detail-content-item-value">
                      <span>{{ detailData.classTypeId == 1 ? $t("1v1") : $t("小班课") }}</span>
                  </div>
              </div>
              <div class="detail-content-item">
                  <div class="detail-content-item-label">
                      <span>{{ $t('时长') + ':' }}</span>
                  </div>
                  <div class="detail-content-item-value">
                      <span>{{ detailData.duration + "min" }}</span>
                  </div>
              </div>
              <div class="detail-content-item">
                  <div class="detail-content-item-label">
                      <span>{{ $t('课程状态') + ':' }}</span>
                  </div>
                  <div class="detail-content-item-value">
                      <span>{{ detailData.status == 3 ? $t("正常") : $t("异常") }}</span>
                  </div>
              </div>
              <div class="detail-content-item">
                  <div class="detail-content-item-label">
                      <span>{{ $t('上课时间') + ':' }}</span>
                  </div>
                  <div class="detail-content-item-value">
                      <span>{{ DateTimeUtils.dateClockTime(detailData.startTime) }}</span>
                  </div>
              </div>
              <div class="detail-content-item">
                  <div class="detail-content-item-label">
                      <span>{{ $t('学生姓名') + ':' }}</span>
                  </div>
                  <div class="detail-content-item-value">
                      <span>{{ detailData.studentName }}</span>
                  </div>
              </div>
              <div class="detail-content-item">
                  <div class="detail-content-item-label">
                      <span>{{ $t('老师出席') + ':' }}</span>
                  </div>
                  <div class="detail-content-item-value">
                      <span>{{ Constants.getTeacherAttendStatus(currentLang, detailData.teacherAttendStatus) }}</span>
                  </div>
              </div>
              <div class="detail-content-item">
                  <div class="detail-content-item-label">
                      <span>{{ $t('学生出席') + ':' }}</span>
                  </div>
                  <div class="detail-content-item-value">
                      <span>{{ Constants.getStudentAttendStatus(currentLang, detailData.studentAttendStatus) }}</span>
                  </div>
              </div>
              <hr>
              <div class="detail-content-table">
                  <div class="detail-table-row">
                      <div class="detail-table-cell detail-table-label">
                          <span>{{ $t('课时费用') }}</span>
                      </div>
                      <div class="detail-table-cell detail-table-value">
                          <span>{{ detailData.salaryCurrencyStr + (detailData.originBaseFee || 0) }}</span>
                      </div>
                  </div>
                  <!-- ruleCategoryList 详细规则分类：1：基础课酬，2：保护期课酬，3：等级课酬，4：教学行为课酬，5：特殊补贴，6：试听课转化奖励，7：全勤奖励，8：等级额外奖励，9：学生取消，10：教师请假，11：质检扣款，12：投诉扣款-->
                  <div class="detail-table-row" v-if="detailData.baseFee">
                      <div class="detail-table-cell detail-table-label">
                          <span>{{ $t('基础薪酬') }}</span>
                      </div>
                      <div class="detail-table-cell detail-table-value">
                          <span>{{ detailData.salaryCurrencyStr + (detailData.baseFee || 0) }}</span>
                      </div>
                  </div>
                  <div class="detail-table-row" v-if="detailData.levelRewardFee">
                      <div class="detail-table-cell detail-table-label">
                          <span>{{ $t('等级课酬') }}</span>
                      </div>
                      <div class="detail-table-cell detail-table-value">
                          <span>{{ detailData.salaryCurrencyStr + (detailData.levelRewardFee || 0) }}</span>
                      </div>
                  </div>
                  <div class="detail-table-row" v-if="detailData.rewardFee">
                      <div class="detail-table-cell detail-table-label">
                          <span>{{ $t('补偿') }}</span>
                      </div>
                      <div class="detail-table-cell detail-table-value">
                          <span>{{ detailData.salaryCurrencyStr + (detailData.rewardFee || 0) }}</span>
                      </div>
                  </div>
                  <div class="detail-table-row" v-if="detailData.publishFee">
                      <div class="detail-table-cell detail-table-label">
                          <span>{{ $t('罚金') }}</span>
                      </div>
                      <div class="detail-table-cell detail-table-value">
                          <span>{{ detailData.salaryCurrencyStr + (detailData.publishFee || 0) }}</span>
                      </div>
                  </div>
                  <div class="detail-table-row" v-if="isShowSubsidy">
                      <div class="detail-table-cell detail-table-label">
                          <span>{{ $t('补贴课酬') }}</span>
                      </div>
                      <div class="detail-table-cell detail-table-value">
                          <div class="subsidy-list">
                              <div class="subsidy-item" v-if="detailData.fixedStudentFee">{{ $t('上月固定学生数补贴') }}: {{ detailData.salaryCurrencyStr + (detailData.fixedStudentFee || 0) }}</div>
                              <div class="subsidy-item" v-if="detailData.slotsSupplyFee">{{ $t('上月slots供给量补贴') }}: {{ detailData.salaryCurrencyStr + (detailData.slotsSupplyFee || 0) }}</div>
                              <div class="subsidy-item" v-if="detailData.teachingDisciplineFee">{{ $t('上月教学秩序补贴') }}: {{ detailData.salaryCurrencyStr + (detailData.teachingDisciplineFee || 0) }}</div>
                              <div class="subsidy-item" v-if="detailData.lessonQualityFee">{{ $t('上月课程质量补贴') }}: {{ detailData.salaryCurrencyStr + (detailData.lessonQualityFee || 0) }}</div>
                              <div class="subsidy-item" v-if="detailData.weeFee">{{ $t('凌晨补助') }}: {{ detailData.salaryCurrencyStr + (detailData.weeFee || 0) }}</div>
                              <div class="subsidy-item" v-if="detailData.smallClassFee">{{ $t('小班课补贴') }}: {{ detailData.salaryCurrencyStr + (detailData.smallClassFee || 0) }}</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="detail-footer">
              <div class="detail-footer-item">
                  <el-button @click="closeDetailDiag">{{ $t('取消') }}</el-button>
                  <el-button type="primary" @click="closeDetailDiag">{{ $t('确认') }}</el-button>
              </div>
          </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import DateTimeUtils from '@/utils/datetime_utils'
  import { mapGetters } from 'vuex'
  export default {
    name: 'DetailDiag',
    data() {
      return {
        DateTimeUtils,
      }
    },
    props: {
      isShowDetailDiag: {
        type: Boolean,
        default: false
      },
      detailData: {
        type: Object,
        default: null
      }
    },
    computed: {
      isShowSubsidy() {
        return this.detailData.fixedStudentFee || this.detailData.slotsSupplyFee || this.detailData.teachingDisciplineFee || this.detailData.lessonQualityFee || this.detailData.weeFee || this.detailData.smallClassFee;
      },
      ...mapGetters(['currentLang'])
    },
    methods: {
      closeDetailDiag() {
        this.$emit('closeDetailDiag')
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .detail-content {
      width: 100%;
  }
  .detail-content-item {
      display: inline-flex;
      margin: 0 20px 10px 0;
  }
  .detail-content-item-label {
      font-size: 14px;
      color: #333;
      margin-right: 10px;
  }
  .detail-content-item-value {
      font-size: 14px;
      color: #333;
  }
  .detail-footer {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      margin-top: 20px;
  }
  .detail-footer-item {
      display: flex;
      width: 100%;
      justify-content: space-evenly;
  }
  .detail-content-list {
      display: flex;
      flex-direction: column;
  }
  .detail-content-list > * + * {
      margin-top: 10px;
  }
  .detail-content-item-list-label {
      justify-content: center;
      font-size: 14px;
      color: #333;
      display: inline-flex;
      width: 46%;
  }
  .detail-content-item-list-value {
      justify-content: center;
      font-size: 14px;
      color: #333;
      display: inline-flex;
      width: 46%;
  }
  
  .detail-content-table {
      width: 100%;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 15px;
  }
  
  .detail-table-row {
      display: flex;
      border-bottom: 1px solid #e4e7ed;
  }
  
  .detail-table-row:last-child {
      border-bottom: none;
  }
  
  .detail-table-cell {
      padding: 12px 15px;
      font-size: 14px;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  
  .detail-table-label {
      font-weight: 500;
      width: 40%;
      border-right: 1px solid #e4e7ed;
  }
  
  .detail-table-value {
      width: 60%;
  }
  
  .subsidy-list {
      display: flex;
      flex-direction: column;
      width: 100%;
  }
  .subsidy-list > * + * {
      margin-top: 4px;
  }
  
  .subsidy-item {
      font-size: 13px;
      color: #666;
      line-height: 1.4;
      display: flex;
      justify-content: center;
  }
  </style>