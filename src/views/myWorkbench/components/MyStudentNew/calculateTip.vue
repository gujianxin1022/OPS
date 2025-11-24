<template>
  <div>
    <h3>{{$t('数据字段说明')}}</h3>
    <el-table
      :data="tableData"
      tooltip-effect="dark"
      :border="false"
      fit
      show-overflow-tooltip="true"
      class="calculate-table"
      :cell-style="{ textAlign: 'center' }"
      stripe
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' ,textAlign: 'center'}"
    >
      <el-table-column
        align="center"
        prop="name"
        :label="$t('数据名称')"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="desc"
        :label="$t('描述')"
      >
        <template slot-scope="{ row }">
          <div v-if="keys.includes(row.key)">
            <div v-if="row.key === 'preThreeMonthComplete'">
              <p>
                {{isEn ? 'The average number of lessons in the latest three months of this subject. (Excluding trail lessons and lessons for leave.)' : '学生本学科最近三个月的平均正常完课数（不包含试听课和请假）'}}
              </p>
              <p>{{isEn ? 'Calculation method: ' : "计算方式:"}}</p>
              <p>
                {{isEn ? 'M4 and above: Number of lessons completed in the last 3 months/3' : 'M4及以上：近3个月完课数/3'}}
              </p>
              <p>
                {{isEn ? 'M3: Number of lessons completed in the last 2 months/2' : 'M3：近2个月完课数/2'}}
              </p>
              <p>
                {{isEn ? 'M2: Number of lessons completed in the last 1 month/1': "M2： 近1个月完课数/1"}}
              </p>
              <p>M0、M1：0</p>
            </div>
            <div v-if="row.key === 'threeWeekPercent'">
              <p>
                {{isEn ? 'ratio of lessons in three weeks' : '上周正常完课：本周预计完课：下周约课数'}}
              </p>
              <p>
                {{isEn ? 'lessons completed in last week : ' : '上周正常完课：本学科所有进度上周的正常完课总数'}}
              </p>
              <p>
                {{isEn ? 'Expected number of completed lessons this week' : '本周预计完课：详见上方释义'}}
              </p>
              <p>
                {{isEn ? 'number of lesson booked next week(Excluding trail lessons and lessons for leave.)': "下周约课数：本学科下周约课总数（不包含试听课和请假）"}}
              </p>
            </div>
            <div v-if="row.key === 'threeMonthPercent'">
              <p>
                {{isEn ? 'ratio of lessons in three months' : '上月正常完课：本月预计完课：下月约课数'}}
              </p>
              <p>
                {{isEn ? 'lessons completed in last month ' : '上月正常完课：本学科上月正常完课总数'}}
              </p>
              <p>
                {{isEn ? 'Expected number of completed lessons this month' : '本月预计完课：详见上方'}}
              </p>
              <p>
                {{isEn ? 'number of lesson booked next month(Excluding trail lessons and lessons for leave.)': "下月约课数：本学科所有进度下月约课总数（不包含试听课和请假"}}
              </p>
            </div>
            <div v-if="row.key === 'studentClassTime'">
              <p>
                {{isEn ? 'Class points for student account of the subject. ' : '本学科所有学生账户的总课时'}}
              </p>
              <p>
                {{isEn ? '(Excluding general trail points.)' : '注：通用试听课时不算在任何学科的课时里'}}
              </p>
            </div>
            <div v-if="row.key === 'parentClassTime'">
              <p>
                {{isEn ? 'Class points for parent account of the subject. ' : '本学科所有家长账户的总课时'}}
              </p>
              <p>
                {{isEn ? '(Excluding general trail points.)' : '注：通用试听课时不算在任何学科的课时里'}}
              </p>
            </div>
          </div>
          <span
            v-else
            class="desc-cell"
          >{{row.desc}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="times"
        :label="$t('更新频率')"
      >
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { defineComponent, computed, ref, onMounted, watch } from '@vue/composition-api'

export default defineComponent({
  setup (_, { root }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    watch(isEn, () => { initData() })
    let tableData = ref([])

    const initData = () => {
      tableData.value = [
        {
          name: root.$t('学生'),
          desc: root.$t('学生姓名'),
          times: '4h'
        },
        {
          name: root.$t('学生ID'),
          desc: root.$t('学生ID'),
          times: '4h'
        },
        {
          name: root.$t('家长ID'),
          desc: root.$t('家长ID'),
          times: '4h'
        },
        {
          name: root.$t('学生在读周期'),
          desc: root.$t('学生本学科首课（学科第一节正常完课）距离现在的自然月（M0、M1、M2…..）'),
          times: '4h'
        },
        {
          name: root.$t('家长在读周期'),
          desc: root.$t('家长本学科首单距离现在的自然月（M0、M1、M2…..）'),
          times: '4h'
        },
        {
          name: root.$t('地区'),
          desc: root.$t('同家长档案的居住地'),
          times: '4h'
        },
        {
          name: root.$t('时差'),
          desc: root.$t('同家长档案中扩展信息的时差'),
          times: '4h'
        },
        {
          name: root.$t('学科'),
          desc: root.$t('学生的学科'),
          times: '4h'
        },
        {
          name: root.$t('学管老师'),
          desc: root.$t('当前学生本学科所有学管老师'),
          times: '4h'
        },
        {
          name: root.$t('最近交接时间'),
          desc: root.$t('学生本学科最近一次更换学管时间'),
          times: '4h'
        },
        {
          name: root.$t('上次备注时间'),
          desc: root.$t('学生本学科上次备注的时间'),
          times: '4h'
        },
        {
          name: root.$t('最近备注内容'),
          desc: root.$t('学生本学科最近三次的备注内容'),
          times: '4h'
        },
        {
          name: root.$t('上次完课时间+停课天数'),
          desc: root.$t('学生本学科最近一次正常完课时间+距离今天的天数（包含试听课、不包含请假）'),
          times: 'T+1'
        },
        {
          name: root.$t('下次上课时间'),
          desc: root.$t('本学科下次上课时间（包含试听课、不包含请假）'),
          times: '4h'
        },
        {
          name: root.$t('本周正常完课'),
          desc: root.$t('本学科本周正常完课数（不包含试听课和请假）'),
          times: '4h'
        },
        {
          name: root.$t('本周已约未完课'),
          desc: root.$t('本学科本周已经约上但是还没完课的课程（不包含试听课和请假；未完课：即未开始和上课中）'),
          times: '4h'
        },
        {
          name: root.$t('本周预计完课'),
          desc: root.$t('本周预计完课=本周正常完课+本周已约未上'),
          times: '4h'
        },
        {
          name: root.$t('本月正常完课'),
          desc: root.$t('本学科本月正常完课数（不包含试听课和请假）'),
          times: '4h'
        },
        {
          name: root.$t('本月已约未完课'),
          desc: root.$t('本学科所有进度本月已经约上但是还没完课的课程（不包含试听课和请假；未完课：即未开始和上课中）'),
          times: '4h'
        },
        {
          name: root.$t('本月预计完课'),
          desc: root.$t('本周预计完课=本月正常完课+本月已约未上'),
          times: '4h'
        },
        {
          name: root.$t('前三月平均月完课'),
          key: 'preThreeMonthComplete',
          desc: '',
          times: 'T+1'
        },
        {
          name: root.$t('三周约课对比'),
          key: 'threeWeekPercent',
          desc: '',
          times: '4h'
        },
        {
          name: root.$t('三月约课对比'),
          key: 'threeMonthPercent',
          desc: '',
          times: '4h'
        },
        {
          name: root.$t('学生课时'),
          key: 'studentClassTime',
          desc: '',
          times: '4h'
        },
        {
          name: root.$t('家长课时'),
          key: 'parentClassTime',
          desc: '',
          times: '4h'
        },
        {
          name: root.$t('家长积分'),
          desc: root.$t('家长账户所有积分，不区分学科'),
          times: '4h'
        },
        {
          name: root.$t('N签'),
          desc: root.$t('学生本学科订单总数'),
          times: '4h'
        },
        {
          name: root.$t('本月是否有订单'),
          desc: root.$t('学生本学科在本月是否有订单'),
          times: 'T+1'
        },
        {
          name: root.$t('最近订单时间'),
          desc: root.$t('学生本学科最近订单时间'),
          times: 'T+1'
        },
        {
          name: root.$t('累计完课'),
          desc: root.$t('学生本学科完课次数总和（包含试听）'),
          times: 'T+1'
        },
        {
          name: root.$t('家长账户优惠券'),
          desc: root.$t('本学科家长账户中商品的未失效的优惠券和到期时间'),
          times: '4h'
        },
        {
          name: root.$t('订单情况'),
          desc: root.$t('本学科家长账户订单的各种状态'),
          times: '4h'
        },
        {
          name: root.$t('剩余打卡次数'),
          desc: root.$t('本学科对应的打卡账户，剩余的打卡次数总和'),
          times: '4h'
        },
        {
          name: root.$t('上次打卡时间'),
          desc: root.$t('本学科对应的打卡账户，上次打卡的时间'),
          times: '4h'
        },
        {
          name: root.$t('本周是否上传'),
          desc: root.$t('本学科对应的打卡账户，本周是否上传成功'),
          times: '4h'
        },
        {
          name: root.$t('本周是否打卡'),
          desc: root.$t('本学科对应的打卡账户，本周是否打卡成功（审核通过）'),
          times: '4h'
        },
        {
          name: root.$t('本月已打卡次数'),
          desc: root.$t('本学科对应的打卡账户，本月打卡成功的次数'),
          times: 'T+1'
        },
        {
          name: root.$t('学员总数'),
          desc: root.$t('所有学员的数量'),
          times: 'T+1'
        },
        {
          name: root.$t('M0-M3学员数'),
          desc: root.$t('M0、M1、M2学员的数量'),
          times: 'T+1'
        },
        {
          name: root.$t('M3以上学员数'),
          desc: root.$t('M3及以上学员数量'),
          times: 'T+1'
        },
        {
          name: root.$t('家长总数'),
          desc: root.$t('学管负责的家长总数'),
          times: '4h'
        },
        {
          name: root.$t('已加微信家长数'),
          desc: root.$t('已经绑定微信的家长总数'),
          times: '4h'
        },
        {
          name: root.$t('本月课消目标'),
          desc: root.$t('本月的课消目标'),
          times: 'T+1'
        },
        {
          name: root.$t('本月课消完成率'),
          desc: root.$t('本月课消完成=本月课消总量/本月课消目标'),
          times: 'T+1'
        },
        {
          name: root.$t('本月课消总量'),
          desc: root.$t('学管名下所有学员本月所有课消总量'),
          times: 'T+1'
        },
        {
          name: root.$t('本月预计课消总量'),
          desc: root.$t('本月预计课消总量=所有本月正常完课+已约未上'),
          times: 'T+1'
        },
        {
          name: root.$t('本月续费目标'),
          desc: root.$t('本月的续费目标'),
          times: 'T+1'
        },
        {
          name: root.$t('本月续费完成率'),
          desc: root.$t('本月续费完成=本月续费总额/本月续费目标'),
          times: 'T+1'
        },
        {
          name: root.$t('本月续费总额'),
          desc: root.$t('本月续费金额总数'),
          times: 'T+1'
        },
        {
          name: root.$t('本月续费单量'),
          desc: root.$t('名下续费订单数量'),
          times: 'T+1'
        },
        {
          name: root.$t('本月续费客单价'),
          desc: root.$t('本月续费单价=本月续费总额/本月续费单量'),
          times: 'T+1'
        },
        {
          name: root.$t('本月转介绍目标'),
          desc: root.$t('本月的转介绍目标'),
          times: 'T+1'
        },
        {
          name: root.$t('本月转介绍完成'),
          desc: root.$t('本月转介绍完成=本月线索总数/本月转介绍目标'),
          times: 'T+1'
        },
        {
          name: root.$t('本月打卡用户数'),
          desc: root.$t('本月所有打卡成功的用户数量'),
          times: 'T+1'
        },
        {
          name: root.$t('本月线索总数'),
          desc: root.$t('本月转介绍带来的线索数量'),
          times: 'T+1'
        },
        {
          name: root.$t('本月线索完课总数'),
          desc: root.$t('本月完成试听课的转介绍线索数量'),
          times: 'T+1'
        },
        {
          name: root.$t('本月线索付费总数'),
          desc: root.$t('本月付费的转介绍线索数量'),
          times: 'T+1'
        },

      ]
    }
    const keys = ['preThreeMonthComplete', 'threeWeekPercent', 'threeMonthPercent', 'studentClassTime', 'parentClassTime']
    onMounted(initData)
    return {
      keys,
      isEn,
      tableData
    }
  },
})
</script>
<style scoped lang="scss">
.calculate-table {
  width: 600px;
  height: 700px;
  overflow: auto;
}
.desc-cell {
  display: inline-block;
  text-align: left;
}
p {
  text-align: left;
}
::v-deep .el-table .cell,
span {
  word-break: break-word !important;
}
</style>
