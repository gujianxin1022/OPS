<template>
  <el-dialog 
    :before-close="closeAbnomalReview"
    :close-on-click-modal="false" 
    :title="$t('my-home-Audit')" 
    :visible.sync="abnormalLog">
    <el-row>
      <el-col :span="8">
        <label>{{$t('教师')}}：{{ virtualclassData.submitter }}</label>
      </el-col>
      <el-col :span="currentLang=='en'?16:8">
        <label>{{$t('my-home-Submission Time')}}：{{ DateTimeUtils.dateClockTime(virtualclassData.submitTime) }}</label>
      </el-col>
      <el-col :span="currentLang=='en'?24:8">
        <label>{{$t('Exception type')}}：{{ virtualclassData.endReason == '1' ? $t('schedule-Absence of students') : virtualclassData.endReason == '2' ? $t('schedule-Student equipment or network failure') : virtualclassData.endReason == '12' ? $t('Teacher equipment or network failure') : virtualclassData.endReason == '20' ? $t('Other reasons') : virtualclassData.endReason == '21' ? $t('schedule-None of the teachers and students attended the class') : virtualclassData.endReason == 0 ? $t('normal') : virtualclassData.endReason == 11 ? $t('Absence of Teachers') : virtualclassData.endReason == 22 ? $t('The teacher did not click the end of the lecture') : $t('abnormal') }}</label>
      </el-col>
      <el-col :span="24">
        <el-input
          type="textarea"
          maxlength="200"
          :rows="4"
          resize="none"
          class="mt10"
          readonly
          :value="virtualclassData.endReasonDescription"
        />
      </el-col>
      <el-col class="mt10">
        <span>{{$t('my-home-Audit Result')}}</span>
      </el-col>
      <el-col class="mt10" v-if="virtualclassData.checkUser">
        <span>{{$t('Reviewer')}}：</span> <label>{{virtualclassData.checkUser}}</label>
        <span class="ml20">{{$t('Audit time')}}：</span> <label>{{ DateTimeUtils.dateClockTime(virtualclassData.checkTime)}}</label>
      </el-col>
      <el-col class="mt20">
        <el-radio-group
          v-model="virtualclassData.checkCode"
          :disabled="virtualclassData.tag == 1"
        >
          <el-radio :label="1">{{$t('my-home-2-Student Absent')}}</el-radio>
          <el-radio :label="11">{{$t('my-home-Teacher Absent')}}</el-radio>
          <el-radio :label="21">{{$t('my-home-Student and Teacher Both Absent')}}</el-radio>
        </el-radio-group>
      </el-col>
      <el-col class="mt10">
        <div v-if="virtualclassData.checkCode == 1">
          <el-col>
            <screen-item :label="$t('my-home-Teacher\'s Compensation')" :label-width="currentLang=='en'?100:80">
              <el-input
                v-model="virtualclassData.teacherAmount"
                :disabled="virtualclassData.tag == 1"
              />
            </screen-item>
            <screen-item :label="$t('my-home-Student\'s Fine')" :label-width="currentLang=='en'?100:80">
              <el-input
                v-model="virtualclassData.studentAmount"
                :disabled="virtualclassData.tag == 1"
              />
            </screen-item>
          </el-col>
        </div>
        <div v-else-if="virtualclassData.checkCode == 11">
          <el-col>
            <screen-item :label="$t('my-home-Student\'s Compensation')" :label-width="currentLang=='en'?100:80">
              <el-input
                v-model="virtualclassData.studentAmount"
                :disabled="virtualclassData.tag == 1"
              />
            </screen-item>
            <screen-item :label="$t('my-home-Teacher\'s Fine')" :label-width="currentLang=='en'?100:80">
              <el-input
                v-model="virtualclassData.teacherAmount"
                :disabled="virtualclassData.tag == 1"
              />
            </screen-item>
          </el-col>
        </div>
        <div v-else>
          <el-col>
            <screen-item :label="$t('my-home-Student\'s Fine')" :label-width="currentLang=='en'?100:80">
              <el-input
                v-model="virtualclassData.studentAmount"
                :disabled="virtualclassData.tag == 1"
              />
            </screen-item>
            <screen-item :label="$t('my-home-Teacher\'s Fine')" :label-width="currentLang=='en'?100:80">
              <el-input
                v-model="virtualclassData.teacherAmount"
                :disabled="virtualclassData.tag == 1"
              />
            </screen-item>
          </el-col>
        </div>
        <el-input
          v-model="virtualclassData.checkDescription"
          type="textarea"
          maxlength="200"
          :rows="4"
          resize="none"
          class="mt10"
          :disabled="virtualclassData.tag == 1"
          :placeholder="$t('my-home-Please Fill in the Comment')"
        />
        <el-button
          :loading="normalLoading"
          v-if="virtualclassData.tag !== 1"
          class="mt20"
          type="primary"
          size="medium"
          @click="submitException"
        >{{$t('提交')}}</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    virtualclassData: {
      type: Object,
      default: () => {}
    },
    abnormalLog: {
      type: Boolean,
      default: false
    },
    virtualclassId: {
      type: Number,
      default: 0
    },
    currentType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      normalLoading: false
    }
  },
  computed: {
    ...mapGetters(['currentLang'])
  },
  methods: {
    // 异常审核提交
    submitException() {
      this.normalLoading = true
      const {
        studentAmount,
        teacherAmount,
        checkCode,
        checkDescription
      } = this.virtualclassData;
      const params = {
        reason: checkCode,
        studentAmount: studentAmount,
        teacherAmount: teacherAmount,
        description: checkDescription
      };
      if( !params.reason ) {
        this.$notify({
          message: this.$t('请选择原因'),
          type: "error"
        });
        return
      } else if ( !params.studentAmount ) {
        this.$notify({
          message: this.$t('请输入学生罚款金额'),
          type: "error"
        });
        return
      } else if ( !params.teacherAmount ) {
        this.$notify({
          message: this.$t('请输入老师罚款金额'),
          type: "error"
        });
        return
      } 
      let classTypeId = -1
      switch (this.currentType) {
        case 'oneByOne':
          classTypeId = 1
          break;
        case 'smallClass':
          classTypeId = 2
          break;
        case 'bigClass':
          classTypeId = 3
          break;
        default:
          break;
      }
      
      this.$Api.classManagement
      .examineJava(classTypeId, this.virtualclassId, params)
      .then(({ status, data }) => {
        this.normalLoading = false
        if( status == 200 && data.code == 200 ){
          this.$notify({
            message: this.$t('Exception audit successful'),
            type: "success"
          });
          this.closeAbnomalReview()
          this.$emit('getTableData')
        }
      });
    },
    closeAbnomalReview() {
      this.$emit('closeAbnomalReview')
    }
  }
}
</script>