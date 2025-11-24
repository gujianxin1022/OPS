<template>
  <div class="rule-container">
    <div class="rule-container-title">
      <span>{{ $t('等级额外奖励') }}</span> 
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
              <el-select v-model="rule.subCategory" @change="handlesubCategoryChange(ruleIndex)" :placeholder="$t('请选择')" style="width: 300px">
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
                        <el-select v-model="scope.row.countries[index]" :placeholder="$t('请选择')" style="width: 190px" @change="onCountryChange(index, scope.$index, ruleIndex)">
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
                        <el-option v-for="item in (scope.row.countries[index] === 'classroomQualityStatus' 
                          || scope.row.countries[index] === 'monthlyComplianceStatus' 
                          ? operatorStrOptions : operatorNumOptions)"
                          :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('条件值')" min-width="160">
                <template slot-scope="scope">
                  <div class="tab-right">
                    <div v-for="(item, index) in scope.row.countriesChild" :key="index">
                      <el-select  v-if="scope.row.countries[index] === 'classroomQualityStatus' || scope.row.countries[index] === 'monthlyComplianceStatus'" v-model="scope.row.countriesChild[index]" :placeholder="$t('请选择')" style="width: 120px">
                        <el-option v-for="item in monthlyIfOptions" :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                      <el-input v-else v-model="scope.row.countriesChild[index]" :placeholder="$t('请输入')" style="width: 120px"></el-input>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('课程奖励') + ' (' + currency + ')'" width="180">
                <template slot-scope="scope">
                  <div style="margin-bottom: 6px;" v-if="scope.row.reward || scope.row.feeExpression">
                    <el-tag type="success" v-if="scope.row.reward">{{ $t('固定金额') }}：{{ scope.row.reward }} ({{ currency }})</el-tag>
                    <el-tag type="success" v-else>
                      <span>{{ scope.row.feeExpression.value }}</span>
                      <span v-if="scope.row.feeExpression.arithmeticOperator==='MULTIPLY'">*</span>
                      <span>{{ scope.row.feeExpression.field==='teacherClassCourseNum'?$t('教师所带班级课程数'):$t('教师本月所上课程数') }}</span>
                    </el-tag>
                  </div>
                  + <el-button @click="openSetRewardsDialog(ruleIndex , scope.$index, scope.row)" :disabled="false">
                    {{ 
                      !isDetails ? (scope.row.reward || scope.row.feeExpression ? $t('重新设置奖励') : $t('设置奖励')) : $t('查看已设置奖励')
                    }}
                  </el-button>
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
    
    <!-- 设置奖励对话框 -->
    <set-rewards-dialog 
      ref="setRewardsDialog"
      :currency="currency"
      :isDetails="isDetails"
      @update="getRewardsForm"
    />
  </div>
</template>

<script>
import {
  gradeRewardRuleTypeOptions,
  operatorNumOptions,
  operatorStrOptions,
  logicOptions,
  gradeRewardIfOptions,
  monthlyIfOptions
} from "./filterRule";
import SetRewardsDialog from "./setRewardsDialog.vue";

export default {
  name: 'GradeRewardRule',  
  components: {
    SetRewardsDialog
  },
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
      default: false
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
              reward: 0,
            },
          ],
        },
      ])
    }
  },
  data() {
    return {
      gradeRewardRuleTypeOptions,
      operatorNumOptions,
      operatorStrOptions,
      logicOptions,
      gradeRewardIfOptions,
      monthlyIfOptions,
      countryOptions: [],
      ruleList: this.initialRuleList,

    };
  },
  computed: {
    optionsBysubCategory() {
      return {
        20: this.gradeRewardIfOptions,
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
        const hasEmptydefaultRule = this.ruleList.some(rule => !rule.subCategory);
        if (hasEmptydefaultRule) {
          reject(new Error('请选择等级额外奖励的课酬类型'));
          return;
        }
        for (let i = 0; i < this.ruleList.length; i++) {
          const rule = this.ruleList[i];
          for (let j = 0; j < rule.tableData.length; j++) {
            const row = rule.tableData[j];
            if (row.countries.some(country => !country)) {
              reject(new Error(`等级额外奖励的第${i + 1}个课酬类型的第${j + 1}行条件字段不能为空`));   
              return;
            }
            if (row.operator.some(op => !op)) {
              reject(new Error(`等级额外奖励的第${i + 1}个课酬类型的第${j + 1}行运算规则不能为空`));    
              return;
            }
            if (row.countriesChild.some(child => !child)) {
              reject(new Error(`等级额外奖励的第${i + 1}个课酬类型的第${j + 1}行条件值不能为空`));  
              return;
            }
            // 验证条件值中的数字输入框
            for (let k = 0; k < row.countries.length; k++) {
              const country = row.countries[k];
              const childValue = row.countriesChild[k];
              
              // 只有当条件字段不是 'classroomQualityStatus' 和 'monthlyComplianceStatus' 时才验证数字格式
              if (country !== 'classroomQualityStatus' && country !== 'monthlyComplianceStatus') {
                const numValue = Number(childValue);
                if (isNaN(numValue)) {
                  reject(new Error(`等级额外奖励的第${i + 1}个课酬类型的第${j + 1}行第${k + 1}个条件值必须是数字`));
                  return;
                }
                
                // 验证是否为整数
                // if (!Number.isInteger(numValue)) {
                //   reject(new Error(`等级额外奖励的第${i + 1}个课酬类型的第${j + 1}行第${k + 1}个条件值必须是整数`));
                //   return;
                // }
                if (numValue < 0) {
                  reject(new Error(`等级额外奖励的第${i + 1}个课酬类型的第${j + 1}行第${k + 1}个条件值不能为负数`));
                  return;
                }
                if (numValue > 99999) {
                  reject(new Error(`等级额外奖励的第${i + 1}个课酬类型的第${j + 1}行第${k + 1}个条件值不能超过99999`));
                  return;
                }
              }
            }
            // 验证课程奖励是否已设置
            if (!row.reward && !row.feeExpression) {
              reject(new Error(`等级额外奖励的第${i + 1}个课酬类型的第${j + 1}行请设置课程奖励`));
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
      try {
        this.$set(this.ruleList[ruleIndex], "tableData", [
          {
            logic: "1",
            countries: [""],
            operator: [""],
            countriesChild: [""],
            reward: 0,
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

      return this.gradeRewardRuleTypeOptions.filter(
          (option) => !selectedTypes.includes(option.value)
      );
    },
    // 序号
    indexMethod(index) {
      return String(index + 1).padStart(2, "0");
    },
    // 新加ruleList整条规则
    addRule() {
      if (this.ruleList.length >= this.gradeRewardRuleTypeOptions.length) {
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
            reward: 0,
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
        reward: 0,
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

    // 打开设置奖励对话框
    openSetRewardsDialog(ruleIndex , rowIndex) {
      const reShowData = this.ruleList[ruleIndex].tableData[rowIndex];
      this.$refs.setRewardsDialog.open(ruleIndex , rowIndex , reShowData);
    },

    // 处理设置奖励确认
    getRewardsForm(rewardRule) {
      // console.log('设置的奖励金额:', rewardRule);
      this.$nextTick(() => {
        const row = this.ruleList[rewardRule.ruleIndex].tableData[rewardRule.rowIndex];
        if(rewardRule.data.rewardType === 1) {
          this.$set(row, 'reward', rewardRule.data.reward);
          this.$set(row, 'feeExpression', null);
        } else {
          this.$set(row, 'reward', 0);
          this.$set(row, 'feeExpression', rewardRule.data.tableData[0]);
        }
        this.emitUpdate();
      });
    },
    handleStatusChange() {
      this.emitUpdate();
    }
  },
  created() {
     
  },
  watch: {
    initialRuleList: {
      handler(newVal) {
        this.ruleList = newVal;
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped></style>
