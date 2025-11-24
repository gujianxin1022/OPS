<template>
  <div class="data-board-card">
    <div class="item-box mb10">
      <div class="card-item one mr5">
        <div class="title">
          <span>{{$t('学员总数')}}:</span>
          <span>{{getValue(studentTotalNum) }}</span>
        </div>
        <span>{{$t('新生数量')}}:{{getValue(newStudentTotalNum) }}</span>
        <span>{{$t('老生数量')}}:{{getValue(oldStudentTotalNum) }}</span>
        <span>{{$t('家长数')}}:{{getValue(parentTotalNum) }}</span>
        <span>{{$t('已加微信家长数')}}:{{getValue(wechatParentTotalNum)}}</span>
      </div>
      <div class="card-item two ">
        <div class="title">
          <span>{{$t('课消完成')}}:</span>
          <span>{{getValue(classCompletionRate, 'rate')}}%</span>
        </div>
        <span>{{$t('课消目标')}}:{{getValue(classGoalsNum)}}</span>
        <span>{{$t('课消总量')}}:{{getValue(classTotalNum)}}</span>
        <span>{{$t('预计课消总量')}}:{{getValue(planClassTotalNum)}}</span>
      </div>
    </div>
    <div class="item-box">
      <div class="card-item three mr5">
        <div class="title">
          <span>{{$t('续费完成')}}:</span>
          <span>{{getValue(renewalCompletionRate, 'rate')}}%</span>
        </div>
        <span>{{$t('本月续费目标')}}:{{getValue(renewalGoalsAmount)}}</span>
        <span>{{$t('本月续费总额')}}:{{getValue(renewalTotalAmount)}}</span>
        <span>{{$t('本月续费单量')}}:{{getValue(renewalOrderNum)}}</span>
        <span>{{$t('本月续费客单价')}}:{{getValue(renewalUnitPrice)}}</span>
      </div>
      <div class="card-item four">
        <div class="title">
          <span>{{$t('转介绍完成')}}:</span>
          <span>{{getValue(referrerCompletionRate, 'rate')}}%</span>
        </div>
        <span>{{$t('本月转介绍目标')}}:{{getValue(referrerGoalsAmount)}}</span>
        <span>{{$t('本周打卡用户数')}}:{{getValue(peoplePunchInNum)}}</span>
        <span>{{$t('本月线索总数')}}:{{getValue(leadsNum)}}</span>
        <span>{{$t('本月线索完课总数')}}:{{getValue(leadsCompletedClassNum)}}</span>
        <span>{{$t('本月线索付费总数')}}:{{getValue(leadsPaymentNum)}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, toRefs } from '@vue/composition-api'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup (_, { root, emit }) {
    const userId = JSON.parse(window.localStorage.getItem("userInfo"))?.id;
    const dataInfo = reactive({
      studentTotalNum: '',
      newStudentTotalNum: '',
      oldStudentTotalNum: '',
      parentTotalNum: '',
      wechatParentTotalNum: '',
      classCompletionRate: '',
      classGoalsNum: '',
      classTotalNum: '',
      planClassTotalNum: '',
      renewalCompletionRate: '',
      renewalGoalsAmount: '',
      renewalTotalAmount: '',
      renewalOrderNum: '',
      renewalUnitPrice: '',
      referrerCompletionRate: '',
      referrerGoalsAmount: '',
      peoplePunchInNum: '',
      leadsNum: '',
      leadsCompletedClassNum: '',
      leadsPaymentNum: '',
    })

    const getValue = (value, type) => {
      if (!value && value !== 0) return '-'
      if (type === 'rate') {
        return (value * 100).toFixed()
      } else {
        if ((value + '').includes('.')) return value.toFixed(2)
      }
      return value
    }
    const close = () => {
      emit('update:visible', false)
    }

    const getDataBoard = () => {
      root.$Api.studentManagement.getDataBoard(userId).then(({ data }) => {
        if (data.code !== 200) {
          return Promise.reject()
        }
        Object.assign(dataInfo, data.data)
      })
    }

    onMounted(getDataBoard)

    return {
      ...toRefs(dataInfo),
      close,
      getDataBoard, getValue
    }
  },
})
</script>
<style lang="scss" scoped>
.data-board-card {
  color: #fff;
  text-align: center;
  width: 420px;
  .item-box {
    display: flex;
    .card-item {
      width: 200px;
      border-radius: 4px;
      padding: 5px;
      display: flex;
      flex-direction: column;
      .title {
        font-weight: bold;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  span {
    word-break: break-word;
    font-size: 12px;
    text-align: left;
  }

  .one {
    background: #57a8fa;
  }
  .two {
    background: #67be74;
  }
  .three {
    background: #7ad0d0;
  }
  .four {
    background: #ffbd00;
  }
}
</style>
