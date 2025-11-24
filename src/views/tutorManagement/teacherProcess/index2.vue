<template>
  <div class="teacher-process-wrap-new">
    <div class="title">{{$t('教师待上岗列表')}}</div>
    <div class="top-wrap">
      <div class="diy-top-button">
        <el-button-group>
          <el-button
            v-for="item in topButtonList"
            :key='item.id'
            :type="currentActiveTopButtonId == item.id ? 'primary' : ''"
            @click="changeCurrentButtonId(item.id)"
          >{{item.label}} ({{item.peopleNum}})</el-button>
        </el-button-group>
        <div class="top-more-select">
          <el-button
            @click="showDialog=true"
            v-show="currentActiveTopButtonId==7&&Per.handleButtonPer('teach.tutorMT.teacherWaitList.batchImport')"
            type="primary"
          >{{$t('批量导入')}}</el-button>
        </div>
      </div>
    </div>
    <div class="teacher-process-table-wrap">
      <WaitTeachTable
        ref="WaitTeachTable"
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
    <ImportTeacherListDialog
      :showDialog='showDialog'
      @importSuccess='importSuccess'
      @closeDialog='showDialog=false'
    />
  </div>
</template>
<script>
import WaitTeachTable from "./components/waitTeachTable";
import OutTeacher from "./components/outTeacher";
import GiveUpTeacher from "./components/giveUpTeacher";
import ImportTeacherListDialog from "./components/importTeacherListDialog"
import { mapGetters } from "vuex"
export default {
  name: "teacherWaitList",
  components: {
    WaitTeachTable,
    OutTeacher,
    GiveUpTeacher,
    ImportTeacherListDialog
  },
  data () {
    return {
      topButtonList: [],
      currentActiveTopButtonId: 7,
      outReasonList: [],
      giveUpReassonList: [],
      list: [],
      showDialog: false
    };
  },
  computed: {
    ...mapGetters([
      'currentLang'
    ]),
    outNum () {
      let flag = this.list.find((item) => item.stage == 8);
      if (flag) {
        return flag.total;
      } else {
        return 0;
      }
    },
    giveUpNum () {
      let flag = this.list.find((item) => item.stage == 9);
      if (flag) {
        return flag.total;
      } else {
        return 0;
      }
    },
  },
  watch: {
    currentLang () {
      this.initData()
      this.getCount()
    }
  },
  methods: {
    initData () {
      this.topButtonList = [
        { label: this.$t("全部待上岗"), peopleNum: 0, id: 7 },
        { label: this.$t("淘汰老师"), peopleNum: 0, id: 8 },
        { label: this.$t("主动放弃"), peopleNum: 0, id: 9 },
      ]
    },
    // 导入成功
    importSuccess () {
      this.showDialog = false
      this.$refs.WaitTeachTable.getTableData()
      this.getCount()
    },
    changeCurrentButtonId (id) {
      this.currentActiveTopButtonId = id;
    },
    handleCommand (command) {
      this.currentActiveTopButtonId = command;
    },
    getCount () {
      this.$Api.tutorManagement
        .getStageTeacherNum()
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.list = data.data;
            // this.topButtonList = this.$options.data().topButtonList;
            data.data.forEach((item) => {
              let flag = this.topButtonList.find((ite) => ite.id == item.stage);
              if (flag) {
                flag.peopleNum = item.total;
              }
            });
          }
        });
    },
    getOutAndGiveUpReasonList () {
      // 请求 淘汰原因列表
      this.$Api.tutorManagement.getExamineDic(6).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.outReasonList = data.data;
        }
      });
      // 请求 放弃原因列表
      this.$Api.tutorManagement.getExamineDic(7).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.giveUpReassonList = data.data;
        }
      });
    },
  },
  created () {
    this.getCount();
    this.getOutAndGiveUpReasonList();
    this.initData()
  },
};
</script>
<style lang="scss" scoped>
.teacher-process-wrap-new {
  width: 100%;
  height: 100%;
  .title {
    font-size: 14px;
    color: #99a9bf;
    margin-left: 15px;
    line-height: 44px;
  }
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
    height: 75px;
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