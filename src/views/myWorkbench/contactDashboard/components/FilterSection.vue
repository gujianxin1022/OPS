<template>
  <el-form :inline="true" :model="formInline" class="filter-section" size="small">
    <el-form-item v-if="Per.handleButtonPer('teach.myWorkbench.myCustomer.wbmyCustomerScope')" :label="$t('我的范围')">
      <CommonTree class="employee-tree" isShowLACCSelect="true"
        :hasLAPermission="Per.handleButtonPer('teach.myWorkbench.myclass.filterByLA')"
        :hasCCPermission="Per.handleButtonPer('teach.myWorkbench.myclass.filterByCC')" :hasTeachTubePermission="false"
        @get_seleParams="get_seleParams"></CommonTree>
    </el-form-item>
    <el-form-item :label="$t('是否建联')">
      <FilterRadioGroup v-model="form.isLink"></FilterRadioGroup>
    </el-form-item>
    <el-form-item :label="$t('是否绑定微信')">
      <FilterRadioGroup v-model="form.isBindWechat"></FilterRadioGroup>
    </el-form-item>
    <el-form-item :label="$t('最近30天有课消')">
      <FilterRadioGroup v-model="form.hasRecentClassConsumption"></FilterRadioGroup>
    </el-form-item>
    <el-form-item :label="$t('是否有课时')">
      <FilterRadioGroup v-model="form.isHaveClass"></FilterRadioGroup>
    </el-form-item>
    <el-form-item :label="$t('家长ID')">
      <el-input v-model="form.parentUserId" clearable :placeholder="$t('请输入家长ID')"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">{{ $t('查询') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import CommonTree from "@/views/reportManagement/commonTree";
import FilterRadioGroup from "./FilterRadioGroup.vue";

export default {
  name: 'FilterSection',
  components: {
    CommonTree,
    FilterRadioGroup,
  },
  data() {
    return {
      form: {
        scopeType: '',
        employeeId: '',
        isLink: '', // 是否建联
        isBindWechat: '', // 是否绑定微信
        isHaveClass: '', // 是否有课时
        hasRecentClassConsumption: '', // 最近有课消
        parentUserId: '', // 家长id
      },
      // 是否已经查询过
      isSearched: false,
    }
  },
  methods: {
    handleSearch() {
      console.log('handleSearch', this.isSearched);
      this.isSearched = true;
      // 不要直接传递对象，阻止共同引用
      this.$emit('search', { ...this.form });
    },
    //获取范围组件的值
    get_seleParams(val, valName, type) {
      this.form.scopeType = type;
      if (["postIdList", "userIdList"].includes(valName)) {
        if (val.length > 1) {
          this.$message.warning("我的范围只支持选择一个人");
        }
        this.form.employeeId = val.length > 0 ? val[0] : "";
        // 触发首次查询
        if (!this.isSearched) {
          this.handleSearch();
        }
      } else if (valName === "clear") {
        this.form.employeeId = "";
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.filter-section {
  padding: 10px 0;
}

// 隐藏范围组件的 按 人/组 筛选
.employee-tree {
  ::v-deep .tree_class {
    width: 430px !important;

    .el-select:nth-child(2) {
      display: none;
    }
  }
}
</style>
