<template>
  <div class="classHourList">
    <section v-for="(item, index) in clssHourArray" :key="index">
      <header>
        <el-form :inline="true">
          <el-form-item :label="$t('选择学生')">
            <el-select v-model="item.studentUserId" clearable :placeholder="$t('请选择')" @change="(val) => handleStudent(val, index)">
              <el-option
                v-for="ite in studentList"
                :key="ite.id"
                :label="ite.realName"
                :value="ite.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('课程包名称')">
            <el-select v-model="item.coursePackageId" clearable :placeholder="$t('请选择')" @change="(val) => handleCoursePackage(val, index)">
              <el-option
                v-for="ite in item.productTypeList"
                :key="ite.coursePackageId"
                :label="currentLang === 'zh' ? ite.coursePackageName : ite.coursePackageNameEn"
                :value="ite.coursePackageId"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('课时总数')">
            <el-input v-model="item.count" :placeholder="$t('请输入')" disabled/>
          </el-form-item>
          <el-form-item :label="$t('扣减数量')">
            <el-input v-model="item.deductAmount.value" :placeholder="$t('请输入')" disabled/>
          </el-form-item>
          <el-form-item>
            <i class="el-icon-plus" @click="addList"/>
            <i v-if="clssHourArray.length > 1" class="el-icon-minus" @click="reduceList(item, index)"/>
          </el-form-item>
        </el-form>
      </header>
      <div class="mian_table">
        <el-table
          :data="item.tableData"
          v-loading="item.tableLoading"
          border
          max-height="450"
        >
          <el-table-column
            v-for="col in tableColumn"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :width="col.width"
          >
            <template slot-scope="scope">
              <span v-if="col.prop === 'createTime'">{{DateTimeUtils.dateClockTime(scope.row[col.prop])}}</span>
              <template v-else>{{scope.row[col.prop]}}</template>
            </template>
          </el-table-column>
          <el-table-column
              :label="$t('扣减数量')"
              fixed="right"
              width="180px"
              :resizable="false"
          >
            <template slot-scope="{row}">
              <el-input-number
                :disabled="row.balance <= 0"
                :min="0"
                :max="row.balance"
                :precision="0"
                v-model="row.deductAmount"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted, computed, markRaw, set, unref } from "@vue/composition-api";

export default {
  props: {
    clssHourArray: {type: Array, default: []},
    parentUserId: {type: Number, default: -1}
  },
  setup(props, { root, emit }) {
    const { currentLang, tableColumn } = constantFun(props, root);
    const options = reactive({
      studentList: [],
    });

    // 添加一个新的课时列表
    const addList = () => {
      props.clssHourArray.push({
        studentUserId: '', 
        coursePackageId: '',
        count: 0,
        deductAmount: 0,
        // studentList: [],
        productTypeList: [],

        tableLoading: false,
        tableData: []
      })
      let newObj = props.clssHourArray[props.clssHourArray.length - 1];
      newObj.deductAmount = computed(() => newObj.tableData.reduce((acc, cur) => acc += cur.deductAmount || 0, 0));
      getClassHourTable(props.clssHourArray.length - 1);
    }
    // 删除课时列表
    const reduceList = (item, index) => {
      props.clssHourArray.splice(index, 1);
    }

    // const addList = () => {
    //   emit('addList');
    // }
    // const reduceList = (item, index) => {
    //   emit('reduceList', {item, index});
    // }
  
    // 获取学生下拉数据
    const getStudentList = async () => {
      const {status, data:{code, data}} = await root.$Api.financeManagement.getStudentListByParentId({parentUserId:props.parentUserId, status:1});
      if (status !== 200 || code !== 200 || data.length <= 0) return; // Promise.reject("接口报错");
      options.studentList = markRaw(data);
      // props.clssHourArray.forEach(item => {
      //   item.studentList =  markRaw(data.studentInfoList);
      // })
    }
    // 选择学生
    const handleStudent = (studentUserId, index) => {
      props.clssHourArray[index].coursePackageId = ''
      getCoursePackage(index, studentUserId);
      getClassHourTable(index, studentUserId);
    }
    // 选择课程包
    const handleCoursePackage = (coursePackageId, index) => {
      const {studentUserId} = props.clssHourArray[index];
      getClassHourTable(index, studentUserId, coursePackageId);
    }
    // 获取学生对应的课程包
    const getCoursePackage = async (index, studentUserId=null) => {
      const {status, data:{code, data}} = await root.$Api.studentManagement.getStudentProductList({
        parentUserId: props.parentUserId,
        studentUserId
      });
      if (status === 200 && code === 200) {
        props.clssHourArray[index].productTypeList = data;
      }
    }
    // 获取课时列表数据
    const getClassHourTable = async (index, studentUserId=null, coursePackageId=null) => {
      props.clssHourArray[index].tableLoading = true;
      const {status, data:{code, data}} = await root.$Api.financeManagement.getClassDetails({
        parentUserId: props.parentUserId,
        studentUserId,
        coursePackageId
      });
      if (status === 200 && code === 200) {
        props.clssHourArray[index].count = data.count;
        props.clssHourArray[index].tableData = data.classDetailsInfoResps.map((v) => ({
          ...v,
          deductAmount: 0,
        }));
      }
      props.clssHourArray[index].tableLoading = false;
    }

    const initData = () => {
      getStudentList();
      // console.log(props.clssHourArray.length);
      // await getClassHourTable(props.clssHourArray.length-1);
    }

    onMounted(() => {
      initData();
      addList();
    })

    return {
      currentLang,
      tableColumn,
      ...toRefs(options),
      addList,
      reduceList,
      handleStudent,
      handleCoursePackage,
    }
  }
}

const constantFun = (props, root) => {
  const currentLang = computed(() => root.$store.getters.currentLang);
  const tableColumn = computed(() => [
      {label: root.$t("课时明细ID"), prop: "id", width: '120px'},
      {label: root.$t("课时类别"), prop: "typeName", width: '120px'},
      {label: root.$t("课时数"), prop: "balance", width: '120px'},
      {label: root.$t("课时来源"), prop: "sourceName", width: '120px'},
      {label: root.$t("课单价"), prop: "unitPrice", width: '120px'},
      {label: root.$t("原始课单价"), prop: "originalUnitPrice", width: '120px'},
      {label: root.$t("一级成本名称"), prop: currentLang.value==='zh'?'costFirstNameZh':'costFirstNameEn', width: '150px'},
      {label: root.$t("二级成本名称"), prop: currentLang.value==='zh'?'costSecondNameZh':'costSecondNameEn', width: '150px'},
      {label: root.$t("中文描述"), prop: "describeZh", width: '150px'},
      {label: root.$t("获得时间"), prop: "createTime", width: '180px'},
  ]);

  return {
    currentLang,
    tableColumn,
  }

}
</script>

<style lang="scss" scoped>
.classHourList {
  .mian_table {
    margin: 0 0 20px;
  }
}
</style>