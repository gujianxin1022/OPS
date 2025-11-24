<template>
  <div class="padding20">
    <el-radio-group v-model="tabType" @change="searchTable" style="margin-bottom: 20px;">
      <el-radio-button :label="STUDENT_OR_CLASS.student">学生</el-radio-button>
      <el-radio-button :label="STUDENT_OR_CLASS.class">班级</el-radio-button>
    </el-radio-group>
    <header>
      <el-form :inline="true" :model="formData" :rules="rules">
        <el-form-item>
          <el-date-picker
            v-model="applyDate"
            style="width:220px;"
            type="daterange"
            value-format="yyyy-MM-dd"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            size="small"
            :default-time="['00:00:00', '23:59:59']"
            @change="timeChange"
          />
        </el-form-item>
        <el-form-item>
          <el-select clearable filterable v-model="formData.prePlatform" placeholder="操作前默认教室类型">
            <el-option
              v-for="item in OLD_VIRTUAL_CLASS_TYPE"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable filterable v-model="formData.afterPlatform" placeholder="操作后默认教室类型">
            <el-option
              v-for="item in OLD_VIRTUAL_CLASS_TYPE"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="tabType === STUDENT_OR_CLASS.student">
          <el-input v-model="formData.studentID" placeholder="请输入学生ID" style="width:170px"/>
        </el-form-item>
        <el-form-item v-if="tabType === STUDENT_OR_CLASS.student">
          <el-input v-model="formData.studentName" placeholder="请输入学生姓名" style="width:170px"/>
        </el-form-item>
        <el-form-item v-if="tabType === STUDENT_OR_CLASS.class">
          <el-input v-model="formData.classID" placeholder="请输入班级ID" style="width:170px"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formData.createUserName" placeholder="请输入操作人" style="width:170px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTable">查询</el-button>
        </el-form-item>
      </el-form>
    </header>
    <section>
      <el-table
        v-loading="tableLoading"
        :data="tabType === STUDENT_OR_CLASS.student ? studentTableData : classTableData"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
      >
        <el-table-column type="index" :label="$t('序号')" width="50"/>
        <el-table-column
          v-for="item in tableColumn"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'operationTime'">
              {{DateTimeUtils.dateClockTime(scope.row[item.prop]) || '--'}}
            </template>
            <template v-else-if="item.prop === 'prePlatform' || item.prop === 'afterPlatform'">
              {{filterVirtualClassType(scope.row[item.prop])}}
            </template>
            <template v-else>
              <span>
                <!-- {{scope.row[item.prop] || '--'}} -->
                {{
                  scope.row[item.prop] === null || 
                  scope.row[item.prop] === undefined || 
                  scope.row[item.prop] === '' ? '--' : scope.row[item.prop]
                }}
              </span>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </section>
  </div>
</template>

<script>
import { ref, unref, reactive, toRefs, computed, onMounted } from '@vue/composition-api';
import {STUDENT_OR_CLASS, OLD_VIRTUAL_CLASS_TYPE, filterVirtualClassType} from './constants';

export default {
  setup(props, {root, emit, refs}) {
    const constants = reactive({ STUDENT_OR_CLASS, OLD_VIRTUAL_CLASS_TYPE, filterVirtualClassType });
    const tabType = ref(1);
    const applyDate = ref('');
    const formData = reactive({
      prePlatform: '',
      afterPlatform: '',
      studentID: '',
      studentName: '',
      classID: '',
      createUserName: '',
      startTime: '',
      endTime: '',
    });
    const tableDataObj = reactive({
      tableLoading: false,
      total: 0,
      pageNum: 1,
      pageSize: 50,
      studentTableData: [],
      classTableData: [],
      tableColumn: computed(() => [
        {
          label: unref(tabType) === constants.STUDENT_OR_CLASS.student ? "学生ID" : "班级ID",
          prop: unref(tabType) === constants.STUDENT_OR_CLASS.student ? "recordId" : "recordId"
        },
        {
          label: unref(tabType) === constants.STUDENT_OR_CLASS.student ? "学生姓名" : "班级名称",
          prop: unref(tabType) === constants.STUDENT_OR_CLASS.student ? "recordNameZh" : "recordNameZh"
        },
        {label: "操作前默认教室", prop: 'prePlatform'},
        {label: "操作后默认教室", prop: 'afterPlatform'},
        {label: "操作时间", prop: 'operationTime'},
        {label: "操作人", prop: 'createUserName'},
        {label: "操作原因", prop: 'remark'},
      ])
    })

    const timeChange = (value) => {
      formData.startTime = value ? new Date(`${value[0]} 00:00`).toISOString() : '';
      formData.endTime = value ? new Date(`${value[1]} 23:59`).toISOString() : '';
    }
    // 当前页码
    const getCurrentPage = (val) => {
      tableDataObj.pageNum = val;
      getTableData();
    }
    // 当前页数
    const getPerPage = (val) => {
      tableDataObj.pageSize = val;
      getTableData();
    }

    const searchTable = () => {
      tableDataObj.pageNum = 1;
      getTableData();
    }

    const getTableData = () => {
      tableDataObj.tableLoading = true;
      let {prePlatform, afterPlatform, studentID, studentName, classID, createUserName, startTime, endTime} = formData;
      let params = {
        pageNum: tableDataObj.pageNum,
        pageSize: tableDataObj.pageSize,
        recordType: tabType.value,
        recordId: tabType.value === STUDENT_OR_CLASS.student ? studentID : classID,
        recordName: studentName,
        prePlatform,
        afterPlatform,
        createUserName,
        startTime,
        endTime
      }
      root.$Api.systemManagement.getJournal(params).then(({status, data:{code, data}}) => {
        if (status === 200 && code === 200) {
          tabType.value === STUDENT_OR_CLASS.student 
            ? tableDataObj.studentTableData = Object.freeze(data?.list) ?? []
            : tableDataObj.classTableData = Object.freeze(data?.list) ?? []
          tableDataObj.total = data?.total ?? 0;
        }
      }).finally(() => {tableDataObj.tableLoading = false});
    }

    onMounted(() => {
      getTableData()
    })

    return {
      applyDate,
      tabType,
      formData,
      ...toRefs(constants),
      ...toRefs(tableDataObj),
      timeChange,
      searchTable,
      getTableData,
      getCurrentPage,
      getPerPage
    }
  }
}
</script>

<style lang='scss' scoped>
</style>