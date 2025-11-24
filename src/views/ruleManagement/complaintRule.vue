<template>
  <div class="rule-container">
    <div class="rule-container-title">
      <span>{{ $t('投诉扣款') }}</span>
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
              <el-select v-model="rule.subCategory" :placeholder="$t('请选择')" style="width: 300px">
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
                        <el-select v-model="scope.row.countries[index]" :placeholder="$t('请选择')" style="width: 160px">
                          <el-option v-for="item in optionsBysubCategory[rule.subCategory]" :key="item.value"
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
                        <el-option v-for="item in operatorStrOptions" :key="item.value" :label="item.label"
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
                      <el-select v-model="scope.row.countriesChild[index]" :placeholder="$t('请选择')" style="width: 180px">
                        <el-option v-for="item in complaintResultOptions" :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('课酬奖励') + ' (' + currency + ')'" width="185">
                <template slot="header" slot-scope="scope">
                  <el-select v-model="rule.deductionType" @change="onDeductionTypeChange(ruleIndex)" style="width: 160px; border: none; outline: none; box-shadow: none;">
                    <el-option v-for="item in feeTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
                <template slot-scope="scope">
                  - <el-input v-model="scope.row.deduce" :placeholder="$t('输入金额')" style="width: 100px"></el-input>
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
  complaintRuleTypeOptions,
  operatorStrOptions,
  operatorNumOptions,
  logicOptions,
  complaintIfOptions,
  feeTypeOptions ,
  complaintResultOptions,
} from "./filterRule";

export default {
  name: 'ComplaintRule',
  props: {
    currency: {
      type: String,
      default: 'USD'
    },
    isDialog: {
      type: Boolean,
      default: false
    },
    isDetails: {
      type: Boolean,
      default: true
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
      complaintRuleTypeOptions,
      operatorStrOptions,
      operatorNumOptions,
      logicOptions,
      complaintIfOptions,
      complaintResultOptions,
      feeTypeOptions , 
      ruleList: this.initialRuleList,
    };
  },
  computed: {
    optionsBysubCategory() {
      return {
        24: this.complaintIfOptions,
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
          reject(new Error('请选择投诉扣款的课酬类型'));
          return;
        }
        // 验证每个规则的金额
        for (let i = 0; i < this.ruleList.length; i++) {
          const rule = this.ruleList[i];
          for (let j = 0; j < rule.tableData.length; j++) {
            const row = rule.tableData[j];
            if (row.countries.some(country => !country)) {
              reject(new Error(`投诉扣款的第${i + 1}个课酬类型的第${j + 1}行条件字段不能为空`));  
              return;
            }
            if (row.operator.some(op => !op)) {
              reject(new Error(`投诉扣款的第${i + 1}个课酬类型的第${j + 1}行运算规则不能为空`));
              return;
            }
            if (row.countriesChild.some(child => !child)) {
              reject(new Error(`投诉扣款的第${i + 1}个课酬类型的第${j + 1}行条件值不能为空`));  
              return;
            }
            // 验证金额
            if (!row.deduce && row.deduce !== 0) {
              reject(new Error(`投诉扣款的第${i + 1}个课酬类型的第${j + 1}行课酬扣除不能为空`));
              return;
            }
            if (isNaN(Number(row.deduce))) {
              reject(new Error(`投诉扣款的第${i + 1}个课酬类型的第${j + 1}行课酬扣除必须是数字`));
              return;
            }
            // if (Number(row.deduce) < 0) {
            //   reject(new Error(`投诉扣款的第${i + 1}个课酬类型的第${j + 1}行课酬扣除不能为负数`));  
            //   return;
            // }
            if (Number(row.deduce) > 99999) {
              reject(new Error(`投诉扣款的第${i + 1}个课酬类型的第${j + 1}行课酬扣除不能超过99999`));
              return;
            }
            const defaultRewardStr = String(row.deduce);
            if (!/^\d+(\.\d{1,2})?$/.test(defaultRewardStr)) {
              reject(new Error(`投诉扣款的第${i + 1}个课酬类型的第${j + 1}行课酬扣除最多支持两位小数`));
              return;
            }
          }
        }
        resolve(true);
      });
    },
    // 切换薪酬扣除类型 ---> 清空对应ruleIndex的表格中的薪酬扣除值
    onDeductionTypeChange(ruleIndex) {
      if (this.ruleList[ruleIndex] && this.ruleList[ruleIndex].tableData) {
        this.ruleList[ruleIndex].tableData.forEach(row => {
          row.deduce = 0;
        });
      }
      this.emitUpdate();
    },
    emitUpdate() {
      this.$emit('update', {
        ruleList: this.ruleList,
        status: this.status
      });
    },
    handleStatusChange() {
      this.emitUpdate();
    },
    // 获取可用的课酬类型选项,获取所有已选择的课酬类型（排除当前项）, 返回未被选择的选项
    getAvailableRuleTypes(currentIndex) {
      const selectedTypes = this.ruleList
          .filter((_, index) => index !== currentIndex)
          .map((rule) => rule.subCategory)
          .filter((type) => type !== "");

      return this.complaintRuleTypeOptions.filter(
          (option) => !selectedTypes.includes(option.value)
      );
    },
    // 序号
    indexMethod(index) {
      return String(index + 1).padStart(2, "0");
    },
    // 新加ruleList整条规则
    addRule() {
      if (this.ruleList.length >= this.complaintRuleTypeOptions.length) {
        this.$message.warning("已达到最大课酬类型数量限制");
        return;
      }
      this.ruleList.push({
        subCategory: "",
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
  },
  async created() {
    try {
      this.ruleList.forEach(rule => {
        if (rule.deductionType === undefined) {
          this.$set(rule, 'deductionType', 1);
        }
      });
    } catch (error) {
      // console.error('初始化数据失败:', error);
    }
  },
  watch: {
    initialRuleList: {
      handler(newVal) {
        // console.log('deductionType' , newVal);
        this.$nextTick(() => {
          this.ruleList = [...newVal];
          this.ruleList.forEach((rule, index) => {
            if (!rule.deductionTyp) {
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
<style lang="scss" scoped></style>
