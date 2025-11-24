<template>
  <div class="rule-container">
    <div class="rule-container-title">
      <span>{{ $t('教师请假') }}</span>
      <span class="rule-right">
        <el-switch v-model="status" @change="handleStatusChange" v-if="!isDetails"></el-switch>
      </span>
    </div>
    <div class="rule-container-content">
      <el-form label-width="100px" v-if="status" :disabled="isDetails">
        <el-form-item>
          <el-button @click="addRule" class="rule-right" icon="el-icon-plus" v-if="!isDetails">{{ $t('添加课酬类型') }}</el-button>
        </el-form-item>
        <!-- 遍历课酬类型规则结构 start-->
        <div v-for="(rule, ruleIndex) in ruleList" :key="ruleIndex">
          <div class="rule-tab-content">
            <el-form-item :label="$t('课酬类型') + '：'">
              <el-select v-model="rule.subCategory" :placeholder="$t('请选择')" style="width: 300px" @change="handlesubCategoryChange(ruleIndex)">
                <el-option v-for="item in getAvailableRuleTypes(ruleIndex)" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-button type="primary" @click="delRule(ruleIndex)" class="rule-right" v-if="!isDetails"
                icon="el-icon-delete"></el-button>
            </el-form-item>
            <!-- table start-->
            <el-table :data="rule.tableData" border :style="{ width: !isDialog ? '1000px' : '100%' }"
              header-cell-class-name="table-header">
              <el-table-column type="index" :label="$t('序号')" width="80" align="center" :index="indexMethod">
              </el-table-column>
              <el-table-column :label="$t('条件字段')" min-width="280">
                <template slot-scope="scope">
                  <div class="tab-wrapper">
                    <div class="tab-line-left" v-if="scope.row.countries.length > 1">
                      <el-select v-model="scope.row.logic" placeholder="" style="width: 60px">
                        <el-option v-for="item in logicOptions" :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="tab-line-right">
                      <div v-for="(item, index) in scope.row.countries" :key="index">
                        <el-select v-model="scope.row.countries[index]" :placeholder="$t('请选择')" style="width: 180px" @change="onCountryChange(index, scope.$index, ruleIndex)">
                          <el-option v-for="item in optionsBysubCategory[rule.subCategory] || []" :key="item.value"
                            :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('运算规则')" width="150">
                <template slot-scope="scope">
                  <div class="tab-right">
                    <div v-for="(item, index) in scope.row.operator" :key="index">
                      <el-select v-model="scope.row.operator[index]" :placeholder="$t('请选择')" style="width: 100px">
                        <el-option v-for="item in operatorNumOptions" :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('条件值')" min-width="200">
                <template slot-scope="scope">
                  <div class="tab-right">
                    <div v-for="(item, index) in scope.row.countriesChild" :key="index">
                      <el-input v-model="scope.row.countriesChild[index]" :placeholder="$t('请输入')" style="width: 180px">
                        <template slot="append" v-if="scope.row.countries[index] === 'leaveTimeGapOfStart'">h</template>
                        <template slot="append" v-else>次</template>
                      </el-input>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column width="185">
                <template slot="header" slot-scope="scope">
                  <el-select v-model="rule.deductionType" @change="onDeductionTypeChange(ruleIndex)" style="width: 160px; border: none; outline: none; box-shadow: none;">
                    <el-option v-for="item in deductionTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  - <el-input v-model="scope.row.deduce" style="width: 100px"></el-input>
                  <span>{{ rule.deductionType === 2 ? '%' : currency }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('操作')" width="80" align="center" v-if="!isDetails">
                <template slot-scope="scope">
                  <div class="tab-wrapper tab-operation">
                    <div class="tab-left">
                      <div v-for="(item, index) in scope.row.operator" :key="index">
                        <el-button type="text" icon="el-icon-delete"
                          @click="delLine(index, scope.$index, ruleIndex)"></el-button>
                      </div>
                    </div>
                    <div class="tab-right">
                      <el-button type="text" icon="el-icon-plus"
                        @click="addline(scope.$index, ruleIndex)"></el-button>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- table end-->
            <el-button icon="el-icon-plus" @click="addTabItem(ruleIndex)" class="mt-10" v-if="!isDetails">{{ $t('添加条件') }}</el-button>
          </div>
        </div>
        <!-- 遍历课酬类型规则结构 end-->
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  teacherLeaveRuleTypeOptions,
  operatorStrOptions,
  operatorNumOptions,
  logicOptions,
  teacherStatusOptions,
  deductionTypeOptions,
  teacherLeaveIfOptions,
} from "./filterRule";

export default {
  name: 'TeacherLeaveRule',
  props: {
    subject: {
      type: String,
      default: ''
    },
    isDialog: {
      type: Boolean,
      default: false
    },
    isDetails: {
      type: Boolean,
      default: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    status: {
      type: Boolean,
      default: true
    },
    initialRuleList: {
      type: Array,
      default: () => ([
        {
          subCategory: "",
          deductionType: 1,
          tableData: [
            {
              logic: "1",
              countries: [""],
              operator: [""],
              countriesChild: [""],
              deduce: 0,
            },
          ],
        },
      ])
    }
  },
  data() {
    return {
      teacherLeaveRuleTypeOptions,
      operatorStrOptions,
      operatorNumOptions,
      teacherLeaveIfOptions,
      logicOptions,
      teacherStatusOptions,
      deductionTypeOptions,
      operatorOptions: {},
      ruleList: this.initialRuleList,
    };
  },
   computed: {
  optionsBysubCategory() {
    // 当subject='0'时，去掉{ value: "quarterlyLeaveNum", label: "请假次数（季度）" },这个下拉框的值
    // if (this.subject === '0') {
    //   this.teacherLeaveIfOptions = this.teacherLeaveIfOptions.filter(item => item.value !== 'quarterlyLeaveNum');
    // }
    return {
      22: this.teacherLeaveIfOptions,
    };
  }
},
methods: {
  validate() {
    return new Promise((resolve, reject) => {
      if (!this.status) {
        resolve(true);
        return;
      }
      const hasEmptysubCategory = this.ruleList.some(rule => !rule.subCategory);
      if (hasEmptysubCategory) {
        reject(new Error('请选择教师请假的课酬类型'));
        return;
      }
      for (let i = 0; i < this.ruleList.length; i++) {
        const rule = this.ruleList[i];
        for (let j = 0; j < rule.tableData.length; j++) {
          const row = rule.tableData[j];
          if (row.countries.some(country => !country)) {
            reject(new Error(`教师请假的第${i + 1}个课酬类型的第${j + 1}行条件字段不能为空`));  
            return;
          }
          if (row.operator.some(op => !op)) {
            reject(new Error(`教师请假的第${i + 1}个课酬类型的第${j + 1}行运算规则不能为空`));
            return;
          }
          if (row.countriesChild.some(child => !child)) {
            reject(new Error(`教师请假的第${i + 1}个课酬类型的第${j + 1}行条件值不能为空`));
            return;
          }
          
          // 验证条件值中的数字输入框
          for (let k = 0; k < row.countries.length; k++) {
            const country = row.countries[k];
            const childValue = row.countriesChild[k];
            const numValue = Number(childValue);
            if (isNaN(numValue)) {
              reject(new Error(`教师请假的第${i + 1}个课酬类型的第${j + 1}行第${k + 1}个条件值必须是数字`));
              return;
            }
            if (!Number.isInteger(numValue)) {
              reject(new Error(`教师请假的第${i + 1}个课酬类型的第${j + 1}行第${k + 1}个条件值必须是整数`));
              return;
            }
            // 验证是否为正整数或0
            if (numValue < 0) {
              reject(new Error(`教师请假的第${i + 1}个课酬类型的第${j + 1}行第${k + 1}个条件值不能为负数`));
              return;
            }
            if (numValue > 99999) {
              reject(new Error(`教师请假的第${i + 1}个课酬类型的第${j + 1}行第${k + 1}个条件值不能超过99999`));
              return;
            }
          }
          if (!row.deduce && row.deduce !== 0) {
            reject(new Error(`教师请假的第${i + 1}个课酬类型的第${j + 1}行薪酬扣除不能为空`));
            return;
          }
          
          // 验证薪酬扣除金额格式：支持0、正数、小数，限制5位数字
          const defaultRewardStr = String(row.deduce);
          const defaultRewardRegex = /^[0-9]+(\.[0-9]+)?$/;
          if (!defaultRewardRegex.test(defaultRewardStr)) {
            reject(new Error(`教师请假的第${i + 1}个课酬类型的第${j + 1}行薪酬扣除格式不正确，请输入0或正数`));
            return;
          }
          
          // 验证数字位数限制（整数部分+小数部分总共不超过5位）
          const numStr = defaultRewardStr.replace('.', '');
          if (numStr.length > 5) {
            reject(new Error(`教师请假的第${i + 1}个课酬类型的第${j + 1}行薪酬扣除位数不能超过5位`));
            return;
          }
        }
      }
      resolve(true);
    });
  },
  // 当条件字段变化，清空当前行所对应的条件值；
  onCountryChange(index, rowIndex, ruleIndex) {
    const currentRow = this.ruleList[ruleIndex].tableData[rowIndex];
    if (currentRow && currentRow.countriesChild && currentRow.countriesChild[index] !== undefined) {
      this.$set(currentRow.countriesChild, index, '');
    }
    this.emitUpdate();
  },
  // 处理课酬类型变化 --> 重置对应的tableData为默认值
  async handlesubCategoryChange(ruleIndex) {
    const subCategory = this.ruleList[ruleIndex].subCategory;
    try {
      this.$set(this.ruleList[ruleIndex], "tableData", [
        {
          logic: "1",
          countries: [""],
          operator: [""],
          countriesChild: [""],
          deduce: 0,
        },
      ]);
      this.emitUpdate();
    } catch (error) {
      this.$message.error('切换课酬类型失败');
    }
  },
  emitUpdate() {
    this.$emit('update', {
      ruleList: this.ruleList,
      status: this.status
    });
  },
  // 获取可用的课酬类型选项,获取所有已选择的课酬类型（排除当前项）, 返回未被选择的选项
  getAvailableRuleTypes(currentIndex) {
    const selectedTypes = this.ruleList
        .filter((_, index) => index !== currentIndex)
        .map((rule) => rule.subCategory)
        .filter((type) => type !== "");

    return this.teacherLeaveRuleTypeOptions.filter(
        (option) => !selectedTypes.includes(option.value)
    );
  },
  // 序号
  indexMethod(index) {
    return String(index + 1).padStart(2, "0");
  },
  // 新加ruleList整条规则
  addRule() {
    if (this.ruleList.length >= this.teacherLeaveRuleTypeOptions.length) {
      this.$message.warning("已达到最大课酬类型数量限制");
      return;
    }
    this.ruleList.push({
      subCategory: "",
      deductionType: 1,
      rewardType: 1,
      tableData: [
        {
          logic: "1",
          countries: [""],
          operator: [""],
          countriesChild: [""],
          deduce: 0,
        },
      ],
    });
    this.emitUpdate();
  },
  // 删除ruleList整条数据
  delRule(ruleIndex) {
    if (this.ruleList.length <= 1) {
      this.$message.warning("不能删除，至少保留一个课酬类型");
      return;
    }
    this.$confirm("确定删除该课酬类型吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      this.ruleList.splice(ruleIndex, 1);
      this.emitUpdate();
    });
  },

  // 在table-->添加一行数据
  addTabItem(ruleIndex) {
    this.ruleList[ruleIndex].tableData.push({
      logic: "1",
      countries: [""],
      operator: [""],
      countriesChild: [""],
      deduce: 0,
    });
    this.emitUpdate();
  },
  // 在每行数据-->添加一条数据
  addline(index, ruleIndex) {
    const currentRow = this.ruleList[ruleIndex].tableData[index];
    if (currentRow.countries.length >= 10) {
      this.$message.warning("最多只能添加10条数据");
      return;
    }
    currentRow.operator.push("");
    currentRow.countries.push("");
    currentRow.countriesChild.push("");
  },
  // 切换薪酬扣除类型
  onDeductionTypeChange(ruleIndex) {
    if (this.ruleList[ruleIndex] && this.ruleList[ruleIndex].tableData) {
      this.ruleList[ruleIndex].tableData.forEach(row => {
        row.deduce = 0;
      });
    }
    this.emitUpdate();
  },
  // 在每行数据-->删除一条数据
  delLine(index, rowIndex, ruleIndex) {
    const currentRow = this.ruleList[ruleIndex].tableData[rowIndex];
    if (
      this.ruleList[ruleIndex].tableData.length > 1 &&
      currentRow.countries.length === 1
    ) {
      this.$confirm("确定删除该条规则吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.ruleList[ruleIndex].tableData.splice(rowIndex, 1);
        this.emitUpdate();
        return;
      });
    } else {
      if (currentRow.countries.length <= 1) {
        this.$message.warning("不能删除，至少保留一条规则");
        return;
      }
      this.$confirm("确定删除该条件吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        currentRow.countries.splice(index, 1);
        currentRow.operator.splice(index, 1);
        currentRow.countriesChild.splice(index, 1);
        this.emitUpdate();
      });
    }
  },
  handleStatusChange() {
    this.emitUpdate();
  }
},
  async created() {
    try {
      this.ruleList.forEach(rule => {
        if (rule.deductionType === undefined) {
          this.$set(rule, 'deductionType', 1);
        }
      });
    } catch (error) {
    }
  },
  watch: {
    initialRuleList: {
      handler(newVal) {
        // console.log('deductionType' , newVal);
        this.$nextTick(() => {
          this.ruleList = [...newVal];
          this.ruleList.forEach((rule, index) => {
            if (rule.deductionType === undefined) {
              this.$set(this.ruleList[index], 'deductionType', 1);
            }
          });
        });
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
.el-select {
  .el-input__inner {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
}
</style>
