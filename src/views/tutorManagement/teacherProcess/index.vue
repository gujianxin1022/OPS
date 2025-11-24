<template>
  <div class="teacher-process-wrap">
    <div class="top-wrap">
      <div class="top-line"></div>
      <div class="diy-top-button">
        <div
          :class="item.id == currentActiveTopButtonId?'top-button-item button-active':'top-button-item'"
          v-for="item in topButtonList"
          :key="item.id"
          @click="changeCurrentButtonId( item.id )"
        >
          <span class="label">{{ $t(item.label) }}</span>
          <span>{{ item.peopleNum }}{{$t('人')}}</span>
        </div>
        <div class="top-more-select">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <el-button type="text">{{$t('更多')}}</el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="8">{{$t('淘汰老师')}} ( {{outNum}} )
              </el-dropdown-item>
              <el-dropdown-item :command="9">{{$t('主动放弃')}} ( {{giveUpNum}} )
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="teacher-process-table-wrap">
      <NewRegistryTable
        @getCount="getCount"
        :giveUpReassonList="giveUpReassonList"
        :outReasonList="outReasonList"
        v-if="currentActiveTopButtonId == 1"
        :currentActiveTopButtonId="currentActiveTopButtonId"
      ></NewRegistryTable>
      <TryTeacherTable
        :editionList="editionList"
        @getCount="getCount"
        :giveUpReassonList="giveUpReassonList"
        :outReasonList="outReasonList"
        v-if="currentActiveTopButtonId == 2"
        :currentActiveTopButtonId="currentActiveTopButtonId"
      ></TryTeacherTable>
      <TeachTrainTable
        :editionList="editionList"
        @getCount="getCount"
        :giveUpReassonList="giveUpReassonList"
        :outReasonList="outReasonList"
        v-if="currentActiveTopButtonId == 3"
        :currentActiveTopButtonId="currentActiveTopButtonId"
      ></TeachTrainTable>
      <TechnologyTrainTable
        @getCount="getCount"
        :giveUpReassonList="giveUpReassonList"
        :outReasonList="outReasonList"
        v-if="currentActiveTopButtonId == 4"
        :currentActiveTopButtonId="currentActiveTopButtonId"
      ></TechnologyTrainTable>
      <LastInterViewTable
        :editionList="editionList"
        @getCount="getCount"
        :giveUpReassonList="giveUpReassonList"
        :outReasonList="outReasonList"
        v-if="currentActiveTopButtonId == 5"
        :currentActiveTopButtonId="currentActiveTopButtonId"
      ></LastInterViewTable>
      <MoTeachTable
        :editionList="editionList"
        @getCount="getCount"
        :giveUpReassonList="giveUpReassonList"
        :outReasonList="outReasonList"
        v-if="currentActiveTopButtonId == 6"
        :currentActiveTopButtonId="currentActiveTopButtonId"
      ></MoTeachTable>
      <WaitTeachTable
        @getCount="getCount"
        :giveUpReassonList="giveUpReassonList"
        :outReasonList="outReasonList"
        v-if="currentActiveTopButtonId == 7"
        :currentActiveTopButtonId="currentActiveTopButtonId"
      ></WaitTeachTable>
      <OutTeacher
        @getCount="getCount"
        :giveUpReassonList="giveUpReassonList"
        :outReasonList="outReasonList"
        v-if="currentActiveTopButtonId == 8"
        :currentActiveTopButtonId="currentActiveTopButtonId"
      ></OutTeacher>
      <GiveUpTeacher
        @getCount="getCount"
        :giveUpReassonList="giveUpReassonList"
        :outReasonList="outReasonList"
        v-if="currentActiveTopButtonId == 9"
        :currentActiveTopButtonId="currentActiveTopButtonId"
      ></GiveUpTeacher>
    </div>
  </div>
</template>
<script>
import NewRegistryTable from './components/newRegistryTable'
import TryTeacherTable from './components/tryTeachTable'
import TeachTrainTable from './components/teachTrainTable'
import TechnologyTrainTable from './components/technologyTrainTable'
import LastInterViewTable from './components/lastInterViewTable'
import MoTeachTable from './components/moTeachTable'
import WaitTeachTable from './components/waitTeachTable'
import OutTeacher from './components/outTeacher'
import GiveUpTeacher from './components/giveUpTeacher'
export default {
  name: 'teacherProcess',
  components: {
    NewRegistryTable,
    TryTeacherTable,
    TeachTrainTable,
    TechnologyTrainTable,
    LastInterViewTable,
    MoTeachTable,
    WaitTeachTable,
    OutTeacher,
    GiveUpTeacher
  },
  data () {
    return {
      topButtonList: [
        { label: '新 注 册', peopleNum: 0, id: 1 },
        { label: '试 讲 阶 段', peopleNum: 0, id: 2 },
        { label: '教 学 培 训 阶 段', peopleNum: 0, id: 3 },
        { label: '技 术 培 训 阶 段', peopleNum: 0, id: 4 },
        { label: '终 面 阶 段', peopleNum: 0, id: 5 },
        { label: '磨 课 阶 段', peopleNum: 0, id: 6 },
        { label: '待 上 岗', peopleNum: 0, id: 7 },
      ],
      currentActiveTopButtonId: 1,
      outReasonList: [],
      giveUpReassonList: [],
      list: [],
      editionList: [],
    }
  },
  computed: {
    outNum () {
      let flag = this.list.find(item => item.stage == 8)
      if (flag) {
        return flag.total
      } else {
        return 0
      }
    },
    giveUpNum () {
      let flag = this.list.find(item => item.stage == 9)
      if (flag) {
        return flag.total
      } else {
        return 0
      }
    }
  },
  methods: {
    // 获取课程版本
    async reqCourseEdition () {
      const { status, data: { code, data } } = await this.$Api.tutorManagement.getCourseEditionList();
      if (status === 200 && code === 200) {
        this.editionList = data || [];
        this.editionList.unshift({
          editionId: '',
          editionNameOpsEn: 'all',
          editionNameOpsZh: '全部',
          levelInfoList: []
        })
      }
    },
    changeCurrentButtonId (id) {
      this.currentActiveTopButtonId = id
    },
    handleCommand (command) {
      this.currentActiveTopButtonId = command
    },
    getCount () {
      this.$Api.tutorManagement.getStageTeacherNum()
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.list = data.data
            this.topButtonList = this.$options.data().topButtonList
            data.data.forEach(item => {
              let flag = this.topButtonList.find(ite => ite.id == item.stage)
              if (flag) {
                flag.peopleNum = item.total
              }
            })
          }
        })
    },
    getOutAndGiveUpReasonList () {
      // 请求 淘汰原因列表
      this.$Api.tutorManagement.getExamineDic(6)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.outReasonList = data.data
          }
        })
      // 请求 放弃原因列表
      this.$Api.tutorManagement.getExamineDic(7)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.giveUpReassonList = data.data
          }
        })
    }
  },
  created () {
    this.getCount()
    this.getOutAndGiveUpReasonList()
    this.reqCourseEdition()
  }
}
</script>
<style lang="scss" scoped>
.teacher-process-wrap {
  width: 100%;
  height: 100%;
  .teacher-process-table-wrap {
    padding: 0 10px;
  }
  .top-wrap {
    display: flex;
    position: relative;
  }
  .top-line {
    width: 88%;
    height: 1px;
    top: 51%;
    left: 1%;
    border-top: 2px dotted rgba(204, 204, 204, 0.959);
    position: absolute;
    z-index: 0;
  }
  .top-more-select {
    font-size: 14px;
    margin-left: 10px;
  }
  .diy-top-button {
    width: 96%;
    display: flex;
    height: 120px;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    .top-button-item {
      position: relative;
      z-index: 1;
      width: 13%;
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      // transition: color .5s;
      // background-color: rgba(232, 237, 242, .7);
      background-color: rgba(241, 241, 241, 0.9);
      border-radius: 8px;
      font-size: 12px;
      line-height: 20px;
      color: #666;
      cursor: pointer;
      span:nth-child(1) {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 2px;
      }
    }
    div.button-active {
      background-color: rgba(2, 136, 209, 0.9);
      color: #ffffff;
      box-sizing: border-box;
      box-shadow: 0 0 10px #cccccc;
    }
    > div {
      .label {
        text-align: center;
      }
    }
  }
}
</style>