<template>
  <div class="task_prompt_warp">
    <el-tabs v-model="currentTab" type="card">
      <el-tab-pane :label="$t('使用中')" name="0" />
      <el-tab-pane :label="$t('历史记录')" name="1" />
      <div class="table">
        <el-table v-loading="loading" :empty-text="$t('暂无数据')" :data="template" style="width: 100%">
          <el-table-column fixed align="center" :label="$t('序号')" :width="50">
            <template slot-scope="scope" >
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="id" :label="$t('配置文件编码')">
            <template slot-scope="scope">
              <el-button @click="openDialog(scope.row)" type="text">{{ scope.row.id }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="type" :label="$t('回访任务类型')">
            <template slot-scope="scope">
              <span>{{currentLang=='en'? scope.row.sopTaskType.nameEn:scope.row.sopTaskType.nameCn}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="$t('备注')"> </el-table-column>
          <el-table-column v-if="currentTab==='0'" prop="createUsername" :label="$t('操作人')"> </el-table-column>
          <el-table-column v-else prop="updateUsername" :label="$t('操作人')"> </el-table-column>
          <el-table-column v-if="currentTab==='0'" prop="createTime" :label="$t('操作时间')">
            <template slot-scope="scope">
              {{DateTimeUtils.dateClockTime(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column v-else prop="updateTime" :label="$t('操作时间')">
            <template slot-scope="scope">
              {{DateTimeUtils.dateClockTime(scope.row.updateTime)}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tabs>
    <TaskPromptDialog v-if="showDialog" :show="showDialog" :currentTab="currentTab"
      :typeCode="typeCode" :formId="formId" @handleClose="handleClose" @updateTable="reqList"/>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import TaskPromptDialog from '../components/TaskPromptDialog/index'
export default {
  name: "TaskPrompt",
  components:{
    TaskPromptDialog
  },
  data() {
    return {
      currentTab: "0",
      template: [],
      loading: false,
      showDialog:false,
      typeCode: 0,
      formId: 0,
    };
  },
  watch: {
    currentTab: {
      handler: function () {
        this.reqList();
      },
      immediate: true,
    },
  },
  // 获取当前语言
  computed: {
    ...mapState({
      currentLang: state => state.app.currentLang
    })
  },
  methods: {
    reqList() {
      this.loading = true;
      this.template = [];
      let params = {
        remove: this.currentTab
      };
      this.$Api.workBench.taskFormList(params).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.loading = false;
          data?.data.forEach(item => {
            item.typeCode = item.sopTaskType.code;
            item.type = item.sopTaskType.nameCn;
          });
          this.template = data?.data;
        }
      });
    },
    openDialog(row){
      this.typeCode = row.typeCode;
      this.formId = row.id;
      this.showDialog = true;
    },
    handleClose(){
      this.showDialog = false

    }
  },
};
</script>
<style scoped lang='scss'>
.task_prompt_warp {
  padding: 10px;
  .table {
    padding: 20px;
  }
}
</style>
