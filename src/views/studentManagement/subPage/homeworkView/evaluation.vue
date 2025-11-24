<template>
  <div class="text">
    <p class="text-title">{{$t('作业评价')}}</p>
    <section class="text-studentInfo bt">
      <dl class="contentBox">
        <dt v-if="currentLang === 'zh'" class="label">{{$t('学生')}}</dt>
        <dt v-else>{{$t('学生')}}</dt>:
        <dd class="contentMsg">{{studentInfo.studentName}}</dd>
      </dl>
      <dl class="contentBox">
        <dt v-if="currentLang === 'zh'" class="label">{{$t('课时')}}</dt>
        <dt v-else>{{$t('课时')}}</dt>:
        <dd class="contentMsg">{{studentInfo.lessonName}}</dd>
      </dl>
      <dl class="contentBox">
        <dt v-if="currentLang === 'zh'" class="label">{{$t('提交时间')}}</dt>
        <dt v-else>{{$t('提交时间')}}</dt>:
        <dd class="contentMsg">{{DateTimeUtils.dateClockTime(msgForm.updateTime)}}</dd>
      </dl>
    </section>
    <section class="homework-score bt">
      <dl class="contentBox">
        <dt v-if="currentLang === 'zh'" class="label fw600 fs">{{$t('作业评分')}}</dt>
        <dt v-else class="fw600">{{$t('作业评分')}}</dt>
        <dd class="contentMsg"><el-rate disabled v-model="msgForm.score" :max="3"></el-rate></dd>
      </dl>
    </section>
    <section class="comment bt">
      <dl class="contentInputBox">
        <dt v-if="currentLang === 'zh'" class="label fw600 fs">{{$t('中文评语')}}</dt>
        <dt v-else class="fw600">{{$t('中文评语')}}</dt>
        <dd class="inputBox">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 6}"
            placeholder="学生练习做的怎么样？快告诉ta吧"
            v-model="msgForm.commentZh"
            disabled
          />
        </dd>
      </dl>
      <dl class="contentInputBox">
        <dt v-if="currentLang === 'zh'" class="label fw600 fs">{{$t('英文评语')}}</dt>
        <dt v-else class="fw600">{{$t('英文评语')}}</dt>
        <dd class="inputBox">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 6}"
            placeholder="How is the student's assignment? What should be praised or strengthened? Tell him/her now"
            v-model="msgForm.commentEn"
            disabled
          />
        </dd>
      </dl>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    studentInfo: {type: Object, default: () => ({})},
    msgForm: {type: Object, default: () => ({})},
  },
}
</script>

<style lang='scss' scoped>
.text {
  width: 260px;
  padding: 0 15px 10px;
  .text-title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
}
.contentBox {
  display: flex;
}
.contentInputBox {
  .inputBox {
    margin: 10px 0 0;
  }
}
.label {
  width: 65px;
  text-align: justify;
  text-align-last: justify;
}
.bt {
  border-top: 1px solid #dfe4ed;
}
.fw600 {
  font-weight: 600;
}
.fs {
  font-size: 16px;
}
dl {
  font-size: 14px;
  dd {
    margin: 0 0 0 15px;
  }
}
</style>