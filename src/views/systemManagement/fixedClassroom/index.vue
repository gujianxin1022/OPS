<template>
  <div class="padding20">
    <el-radio-group v-model="classType" @change="changeGetTableFun" style="margin-bottom: 20px;">
      <el-radio-button :label="ONETOONE_OR_SMALLCLASS.oneToOne">1v1</el-radio-button>
      <el-radio-button :label="ONETOONE_OR_SMALLCLASS.smallClass">小班课</el-radio-button>
    </el-radio-group>

    <header>
      <el-form :inline="true" :model="formData" class="demo-form-inline">
        <el-form-item label="学生ID" v-if="classType === ONETOONE_OR_SMALLCLASS.oneToOne">
          <el-input v-model.number="formData.studentID" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="班级ID" v-if="classType === ONETOONE_OR_SMALLCLASS.smallClass">
          <el-input v-model.number="formData.classID" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="openBatchSearch">批量查询</el-button>
        </el-form-item>
      </el-form>
    </header>
    <mian>
      <nav class="table-nav">
        <span class="table-nav-title">{{classType === ONETOONE_OR_SMALLCLASS.oneToOne ? '学生详情' : '班级详情'}}</span>
        <el-button
          :disabled="!multipleSelection.length"
          type="primary"
          @click="changeClassroom()"
        >
          批量更改默认教室
        </el-button>
      </nav>
      <section>
        <el-table
          v-loading="tableLoading"
          ref="multipleTable"
          :data="classType === ONETOONE_OR_SMALLCLASS.oneToOne ? oneToOnetableData : smallClasstableData"
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="50"/>
          <el-table-column
            v-for="item in (classType === ONETOONE_OR_SMALLCLASS.oneToOne ? oneTooneTableColumn: smallClassTableColumn)"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'xgUserNameList'">
                <span v-if="!scope.row[item.prop] || !scope.row[item.prop].length">--</span>
                <span v-else v-for="(ite, index) in scope.row[item.prop]" :key="index">
                  {{ite}}
                </span>
              </template>
              <template v-else-if="item.prop === 'virtualClassTypeId'">
                <span>
                  {{filterVirtualClassType(scope.row[item.prop]) || '--'}}
                </span>
              </template>
              <template v-else-if="item.prop === 'team'">
                <span>{{ Filters.teamFilter(scope.row[item.prop],currentLang==="en") }}</span>
              </template>
              <template v-else>
                <span>
                  {{
                    scope.row[item.prop] === null || 
                    scope.row[item.prop] === undefined || 
                    scope.row[item.prop] === '' ? '--' : scope.row[item.prop]
                  }}
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button type="text" @click="changeClassroom(row)">更改默认教室</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </mian>
    <ChangeClassroom
      v-if="changeClassroomVisible"
      :dialogVisible.sync="changeClassroomVisible"
      :defaultClassroom="defaultClassroom"
      :idList="changeIdList"
      :classType="classType"
      @refreshTable="changeGetTableFun"
    />
    <BatchSearch
      v-if="batchSearchVisible"
      :dialogVisible.sync="batchSearchVisible"
      :classType="classType"
      @clearInput="clearInput"
      @changeGetTableFun="changeGetTableFun"
    />
  </div>
</template>

<script>
import { ref, unref, reactive, toRefs, computed, onMounted } from '@vue/composition-api';
import ChangeClassroom from './components/changeClassroom.vue';
import BatchSearch from './components/batchSearch.vue';
import {ONETOONE_OR_SMALLCLASS,filterVirtualClassType} from './constants';

export default {
  components: {ChangeClassroom, BatchSearch},
  setup(props, {root, emit, refs}) {
    const classType = ref(1);
    const constants = {ONETOONE_OR_SMALLCLASS, filterVirtualClassType}
    const formData = reactive({
      studentID: '',
      classID: ''
    });
    const tableDataObj = reactive({
      tableLoading: false,
      oneTooneTableColumn: computed(() => [
        {label: "学生ID", prop: "studentUserId"},
        {label: "学生姓名", prop: "studentRealName"},
        {label: "学管", prop: "xgUserNameList"},
        {label: "当前默教室类型", prop: "virtualClassTypeId"},
      ]),
      oneToOnetableData: [],
      smallClassTableColumn: computed(() => [
        {label: "班级名称", prop: "smallClassNameZh"},
        {label: "负责团队", prop: "team"},
        {label: "下节课程", prop: "nextCourse"},
        {label: "下节老师", prop: "nextCourseTutorUserName"},
        {label: "已有学生", prop: "studentCount"},
        {label: "默认教室", prop: "virtualClassTypeId"},
      ]),
      smallClasstableData: [],
    })
    const multipleSelection = ref([]);
    const changeIdList = ref([]);
    const defaultClassroom = ref(void 0);
    const batchSearchVisible = ref(false);
    const changeClassroomVisible = ref(false);
    // 打开批量查询弹框
    const openBatchSearch = () => {
      batchSearchVisible.value = true;
    }
    // 监听table多选
    const handleSelectionChange = (val) => {
      multipleSelection.value = val;
    }
    // 更换默认教室 || 批量更改默认教室 (val有值：更换默认教室， 反之：批量更改默认教室)
    const changeClassroom = (val) => {
      val 
        ? (
          defaultClassroom.value = val.virtualClassTypeId, 
          changeIdList.value = unref(classType) === ONETOONE_OR_SMALLCLASS.oneToOne ? [val.studentUserId] : [val.smallClassId]
        )
        : ( 
          defaultClassroom.value = void 0, // 批量更改清空默认教室
          changeIdList.value = multipleSelection.value.map(item => unref(classType) === ONETOONE_OR_SMALLCLASS.oneToOne ? item.studentUserId : item.smallClassId)
        )
      changeClassroomVisible.value = true;
    }
    // 批量查询后清空对应输入框的id
    const clearInput = () => {
      unref(classType) === ONETOONE_OR_SMALLCLASS.oneToOne ? formData.studentID = '' : formData.classID = '';
    }
    // 用来判断子组件更新table时，走单个查询，还是批量查询
    const changeGetTableFun = () => {
      let studentIdList = JSON.parse(window.sessionStorage.getItem("studentIdList")) ?? [], 
        classIdList = JSON.parse(window.sessionStorage.getItem("classIdList")) ?? [];
      let idList = unref(classType) === ONETOONE_OR_SMALLCLASS.oneToOne ? studentIdList : classIdList;
      idList.length ? getTableData(idList) : search();
    }

    const search = () => {
      let idList = [];
      if (unref(classType) === ONETOONE_OR_SMALLCLASS.oneToOne && formData.studentID !== '') {
        idList.push(formData.studentID);
        sessionStorage.removeItem("studentIdList");
        getTableData(idList);
      } else if (unref(classType) === ONETOONE_OR_SMALLCLASS.smallClass && formData.classID !== '') {
        idList.push(formData.classID);
        sessionStorage.removeItem("classIdList");
        getTableData(idList);
      }
    }

    const getTableData = async (idList = []) => {
      try {
        tableDataObj.tableLoading = true;
        let requestFun = unref(classType) === ONETOONE_OR_SMALLCLASS.oneToOne
            ? root.$Api.systemManagement.getOneToOneList({idList})
            : root.$Api.systemManagement.getSmallClassList({idList});
        const {status, data:{code, data}} = await requestFun;
        if (status === 200 && code === 200) {
          unref(classType) === ONETOONE_OR_SMALLCLASS.oneToOne 
            ? tableDataObj.oneToOnetableData = Object.freeze(data?.platformRespList) ?? []
            : tableDataObj.smallClasstableData = Object.freeze(data?.classList) ?? [];
        }
      }
      finally{tableDataObj.tableLoading = false};
    }

    onMounted(() => {
      search();
    })

    return {
      classType,
      formData,
      ...toRefs(constants),
      ...toRefs(tableDataObj),
      multipleSelection,
      batchSearchVisible,
      changeClassroomVisible,
      defaultClassroom,
      changeIdList,
      openBatchSearch,
      handleSelectionChange,
      changeClassroom,
      search,
      getTableData,
      filterVirtualClassType,
      clearInput,
      changeGetTableFun
    }
  },
}
</script>

<style lang='scss' scoped>
.table-nav {
  display: flex;
  justify-content: space-between;
  margin: 0 0 10px;
  &-title {
    line-height: 32px;
  }
}
</style>