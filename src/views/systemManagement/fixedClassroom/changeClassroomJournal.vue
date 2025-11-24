<template>
  <div class="padding20">
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
          <el-select clearable filterable v-model="formData.prePlatform" placeholder="切换前教室类型">
            <el-option
              v-for="item in OLD_VIRTUAL_CLASS_TYPE"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable filterable v-model="formData.afterPlatform" placeholder="切换后教室类型">
            <el-option
              v-for="item in OLD_VIRTUAL_CLASS_TYPE"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formData.createUserName"  placeholder="请输入操作人" style="width:200px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </header>
    <section>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
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
            <template v-if="item.prop === 'operationTime' || item.prop === 'virtualClassStartTime'">
              {{DateTimeUtils.dateClockTime(scope.row[item.prop]) || '--'}}
            </template>
            <template v-else-if="item.prop === 'virtualClassType'">
              {{filterCourseType(scope.row[item.prop])}}
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
import { ref, reactive, toRefs, computed, onMounted, toRef } from '@vue/composition-api';
import {OLD_VIRTUAL_CLASS_TYPE, filterVirtualClassType} from './constants';

export default {
  setup(props, {root, emit, refs}) {
    const constants = {OLD_VIRTUAL_CLASS_TYPE, filterVirtualClassType}
    const {tableColumn} = constantFun(props, root)
    const applyDate = ref('');
    const formData = reactive({
      prePlatform: '',
      afterPlatform: '',
      createUserName: ''
    });
    const tableDataObj = reactive({
      tableLoading: false,
      total: 0,
      pageNum: 1,
      pageSize: 50,
      tableData: [],
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
    const filterCourseType = (val) => {
      switch (val) {
        case 1: return '1v1';
        case 2: return '小班课';
        default: return '--';
      }
    }

    const search = () => {
      tableDataObj.pageNum = 1;
      getTableData();
    }

    const getTableData = () => {
      tableDataObj.tableLoading = true;
      let params = {
        pageNum: tableDataObj.pageNum,
        pageSize: tableDataObj.pageSize,
        recordType: 3,
        ...formData,
      }
      root.$Api.systemManagement.getJournal(params).then(({status, data:{code, data}}) => {
        if (status === 200 && code === 200) {
          tableDataObj.tableData = data?.list ?? [];
          tableDataObj.total = data?.total ?? 0;
        }
      }).finally(() => {tableDataObj.tableLoading = false});
    }

    onMounted(() => {
      getTableData()
    })

    return {
      applyDate,
      tableColumn,
      formData,
      ...toRefs(tableDataObj),
      ...toRefs(constants),
      timeChange,
      getCurrentPage,
      getPerPage,
      search,
      getTableData,
      filterCourseType
    }
  }
}

const constantFun = (props, root) => {
  const tableColumn = computed(() => [
    {label: "操作时间", prop: 'operationTime'},
    {label: "操作人", prop: 'createUserName'},
    {label: "课程班型", prop: 'virtualClassType'},
    {label: "学生姓名/班级名称", prop: 'recordNameZh'},
    {label: "课程开始时间", prop: 'virtualClassStartTime'},
    {label: "切换前教室类型", prop: 'prePlatform'},
    {label: "切换后教室类型", prop: 'afterPlatform'},
    {label: "切换原因", prop: 'remark'},
  ]);
  return {
    tableColumn
  }

}
</script>

<style lang='scss' scoped>
</style>