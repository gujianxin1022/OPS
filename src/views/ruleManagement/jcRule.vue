<template>
  <div class="rule-container">
    <div class="rule-container-title">
      <span>{{ $t('基础课酬') }}</span>
      <span class="rule-right">
        <el-switch v-model="status" @change="handleStatusChange" v-if="!isDetails"></el-switch>
      </span>
    </div>
    <div class="rule-container-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" v-if="status" :disabled="isDetails">
        <el-form-item :label="$t('课酬') + '：'" prop="type">
          <el-radio-group v-model="ruleForm.defaultRule">
            <el-radio :label="1">{{ $t('默认') }}</el-radio>
            <el-radio :label="0">{{ $t('自定义') }}</el-radio>
          </el-radio-group>
          <el-button v-if="ruleForm.defaultRule === 0 && !isDetails" @click="addRule" class="rule-right"
            icon="el-icon-plus">{{ $t('添加课酬类型') }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('计费金额') + '(' + currency + '/' + $t('课时')+')：'" prop="defaultReward" v-if="ruleForm.defaultRule === 1">
          <el-input v-model="ruleForm.defaultReward" placeholder="请输入" style="width: 300px"></el-input>
        </el-form-item>
        <!-- 遍历课酬类型规则结构 start-->
        <div v-for="(rule, ruleIndex) in ruleList" :key="ruleIndex">
          <div class="rule-tab-content" v-if="ruleForm.defaultRule === 0">
            <el-form-item :label="$t('课酬类型') + '：'">
              <el-select v-model="rule.subCategory" :placeholder="$t('请选择')" style="width: 300px"
                @change="handlesubCategoryChange(ruleIndex)">
                <el-option v-for="item in getAvailableRuleTypes(ruleIndex)" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
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
                      <el-input v-model="scope.row.countriesChild[index]" :placeholder="$t('请输入')" style="width: 180px" v-if="rule.subCategory === 5">
                        <template slot="append">{{ $t('次') }}</template>
                      </el-input>
                      <el-cascader 
                        v-model="scope.row.countriesChild[index]" 
                        :placeholder="$t('请选择')" 
                        filterable
                        :options="countryOptions[rule.subCategory] || []" 
                        :props="{
                          checkStrictly: true,
                          expandTrigger: 'click',
                          emitPath: true
                        }"
                        style="width: 180px"
                        v-if="rule.subCategory === 3">
                      </el-cascader>
                      <el-select v-model="scope.row.countriesChild[index]" filterable :placeholder="$t('请选择')" style="width: 180px" v-if="rule.subCategory !== 5 && rule.subCategory !== 3">
                        <el-option v-for="item in countryOptions[rule.subCategory] || []" :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('计费金额') + ' (' + currency + '/'+$t('课时')+')'" width="150">
                <template slot-scope="scope">
                  + <el-input v-model="scope.row.reward" :placeholder="$t('输入金额')" style="width: 100px"></el-input>
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
  ruleTypeOptions,
  operatorStrOptions,
  operatorNumOptions,
  logicOptions,
  gjOptions,
  xlOptions,
  dqOptions,
  zzOptionsZh,
  zzOptionsEn,
  zzOptionsMath,
  msOptions,
  zxOptions,
  isOrNoOptions,
  teacherTypeRuleOptions,
} from "./filterRule";
import { getTeacherInfoOption,reqQueryTeacherTypeList } from "@/api/tutorManagement";
import { countryList } from "@/api/ruleManagement";

export default {
  name: 'JcRule',
  props: {
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
    subject: {
      type: String,
      default: '0'
    },
    status: {
      type: Boolean,
      default: true
    },
    initialRuleForm: {
      type: Object,
      default: () => ({
        defaultRule: 1,
        defaultReward: ""
      })
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
    const validatedefaultReward = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入计费金额"));
      } else {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          callback(new Error("请输入有效的数字"));
          return;
        }
        if (numValue < 0) {
          callback(new Error("金额不能为负数"));
          return;
        }
        if (numValue > 99999) {
          callback(new Error("金额不能超过99999"));
          return;
        }
        if (String(value).includes(".") && String(value).split(".")[1].length > 2) {
          callback(new Error("最多支持两位小数"));
          return;
        }
        callback();
      }
    };

    return {
      ruleTypeOptions,
      operatorStrOptions,
      operatorNumOptions,
      logicOptions,
      gjOptions,
      xlOptions,
      dqOptions,
      zzOptionsZh,
      zzOptionsEn,
      zzOptionsMath,
      msOptions,
      zxOptions,
      isOrNoOptions,
      teacherTypeRuleOptions,
      countryOptions: {}, 
      ruleForm: this.initialRuleForm,
      rules: {
        defaultReward: [
          { required: true, message: "请输入计费金额", trigger: "blur" },
          { validator: validatedefaultReward, trigger: ["blur", "change"] },
        ],
      },
      ruleList: this.initialRuleList,
    };
  },
  computed: {
    optionsBysubCategory() {
      return {
        1: this.gjOptions,
        2: this.xlOptions,
        3: this.dqOptions,
        4: this.subject === '0' ? this.zzOptionsZh : this.subject === '1' ? this.zzOptionsEn : this.zzOptionsMath,
        5: this.msOptions,
        6: this.zxOptions,
        7: this.teacherTypeRuleOptions
      };
    },
    isEn() {
      return this.$store.getters.currentLang === "en";
    }
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        if (!this.status) {
          resolve(true);
          return;
        }
        
        this.$refs.ruleForm.validate(valid => {
          if (!valid) {
            reject(new Error('请完善基础信息'));
            return;
          }

          // 如果是自定义类型，需要验证每个规则
          if (this.ruleForm.defaultRule === 0) {
            const hasEmptysubCategory = this.ruleList.some(rule => !rule.subCategory);
            if (hasEmptysubCategory) {
              reject(new Error('请选择基础课酬的课酬类型'));
              return;
            }
            for (let i = 0; i < this.ruleList.length; i++) {
              const rule = this.ruleList[i];
              for (let j = 0; j < rule.tableData.length; j++) {
                const row = rule.tableData[j];
                if (row.countries.some(country => !country)) {
                  reject(new Error(`基础课酬的第${i + 1}个课酬类型的第${j + 1}行条件字段不能为空`));
                  return;
                }
                if (row.operator.some(op => !op)) {
                  reject(new Error(`基础课酬的第${i + 1}个课酬类型的第${j + 1}行运算规则不能为空`));
                  return;
                }
                if (row.countriesChild.some(child => {
                  // 对于级联选择器（subCategory === 3），检查是否为数组且不为空
                  if (rule.subCategory === 3) {
                    return !Array.isArray(child) || child.length === 0;
                  }
                  // 对于其他选择器，检查是否为空
                  return !child;
                })) {
                  reject(new Error(`基础课酬的第${i + 1}个课酬类型的第${j + 1}行条件值不能为空`));
                  return;
                }
                
                // 当subCategory为5时，验证条件值必须是0或正整数，且不超过99999
                if (rule.subCategory === 5) {
                  for (let k = 0; k < row.countriesChild.length; k++) {
                    const childValue = row.countriesChild[k];
                    const numValue = Number(childValue);
                    if (isNaN(numValue)) {
                      reject(new Error(`基础课酬的第${i + 1}个课酬类型的第${j + 1}行条件值必须是数字`));
                      return;
                    }
                    if (!Number.isInteger(numValue)) {
                      reject(new Error(`基础课酬的第${i + 1}个课酬类型的第${j + 1}行条件值必须是整数`));
                      return;
                    }
                    if (numValue < 0) {
                      reject(new Error(`基础课酬的第${i + 1}个课酬类型的第${j + 1}行条件值不能为负数`));
                      return;
                    }
                    if (numValue > 99999) {
                      reject(new Error(`基础课酬的第${i + 1}个课酬类型的第${j + 1}行条件值不能超过99999`));
                      return;
                    }
                  }
                }
                // 验证金额
                if (!row.reward && row.reward !== 0) {
                  reject(new Error(`基础课酬的第${i + 1}个课酬类型的第${j + 1}行金额不能为空`));
                  return;
                }
                if (isNaN(Number(row.reward))) {
                  reject(new Error(`基础课酬的第${i + 1}个课酬类型的第${j + 1}行金额必须是数字`));
                  return;
                }
                if (Number(row.reward) > 99999) {
                  reject(new Error(`基础课酬的第${i + 1}个课酬类型的第${j + 1}行金额不能超过99999`));
                  return;
                }
                const defaultRewardStr = String(row.reward || '');
                if (defaultRewardStr.includes('.') && defaultRewardStr.split('.')[1].length > 2) {
                  reject(new Error(`基础课酬的第${i + 1}个课酬类型的第${j + 1}行金额最多支持两位小数`));
                  return;
                }
              }
            }
          }
          
          resolve(true);
        });
      });
    },
    async handlesubCategoryChange(ruleIndex) {
      const subCategory = this.ruleList[ruleIndex].subCategory;
      try {
        await this.fetchCountryOptions(subCategory);
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
        ruleForm: this.ruleForm,
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
      // 当subject=0 中文时，排除资质课酬
      let availableOptions = this.ruleTypeOptions;
      if (this.subject === '0') {
        availableOptions = this.ruleTypeOptions.filter(
          (option) => option.value !== 4
        );
      }
      return availableOptions.filter(
        (option) => !selectedTypes.includes(option.value)
      );
    },

    indexMethod(index) {
      return String(index + 1).padStart(2, "0");
    },
    // 新加ruleList整条规则
    addRule() {
      if (this.ruleList.length >= this.ruleTypeOptions.length) {
        this.$message.warning("已达到最大课酬类型数量限制");
        return;
      }
      this.ruleList.push({
        subCategory: "",
        rewardType: 1,
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

    // 获取对应条件值的options
    async fetchCountryOptions(subCategory) {
      try {
        if (subCategory === 1) {
          // subCategory为国籍课酬
          const data = await this.$Api.tutorManagement.getCountryList({
            "X-LNG": this.$i18n.locale
          });
          this.$set(this.countryOptions, subCategory, data.map(item => ({
            value: item.areaId,
            label: item.nameZh + ' / ' + item.nameEn
          })));
          this.$set(this.countryOptions, subCategory, [
            {
              value: -1,
              label: "其他"
            },
          ].concat(this.countryOptions[subCategory]));
        } else if (subCategory === 2) {
          // subCategory为学历课酬 81-中文教师最高学历枚举, 84-英文教师最高学历
          const subjectNum = this.subject === '0' ? '81' : '84';
          const data = await getTeacherInfoOption(subjectNum);
          this.$set(this.countryOptions, subCategory, data.map(item => ({
            value: item,
            label: item
          })));
        } else if (subCategory === 3) {
          // subCategory为地区课酬
          const data = await countryList({  });
          // console.log('countryList--------:', data.data.data);
          const cascaderOptions = [];
          data.data.data.forEach(item => {
            const regionOption = {
              value: item.regionId,
              label: this.isEn ? item.nameEn : item.nameZh,
              children: []
            };
            // console.log('regionOption--------:', item.countryList);
            item.subRegionList?.forEach(sub => {
              const subRegionOption = {
                value: sub.regionId,
                label: this.isEn ? sub.nameEn : sub.nameZh,
                children: []
              };
              sub.countryList?.forEach(country => {
                subRegionOption.children.push({
                  value: country.id,
                  label: this.isEn ? country.nameEn : country.nameZh
                });
              });
              regionOption.children.push(subRegionOption);
            });
            cascaderOptions.push(regionOption);
          });
          this.$set(this.countryOptions, subCategory, cascaderOptions);
          this.$set(this.countryOptions, subCategory, [
            {
              value: -1,
              label: "其他"
            },
          ].concat(this.countryOptions[subCategory]));
        }else if (subCategory === 4) {
          // subCategory为资质课酬 , 85-英文教师资质种类枚举
          const data = await getTeacherInfoOption('85');
          this.$set(this.countryOptions, subCategory, data.map(item => ({
            value: item,
            label: item
          })));
        }else if (subCategory === 6) {
          // 当subCategory为专项培训时
          this.$set(this.countryOptions, subCategory, this.isOrNoOptions);
        }else if (subCategory === 7) {
          // 当subCategory为教师类型课酬时
          const params = {
            pageNum: 1,
            pageSize: 10000,
            businessLine: Number(this.subject)+1
          };
          const data = await reqQueryTeacherTypeList(params);
          this.$set(this.countryOptions, subCategory, data.list.map(item => ({
            value: item.id,
            label: this.isEn ? item.typeNameEn : item.typeNameZh
          })));
        }
      } catch (error) {
        this.$message.error('获取条件值列表失败');
        throw error;
      }
    },
  },
  async created() {
    try {
      for (let i = 0; i < this.ruleList.length; i++) {
        const rule = this.ruleList[i];
        if (rule.subCategory) {
          await this.fetchCountryOptions(rule.subCategory);
        }
      }
    } catch (error) {
    }
  },
  watch: {
    initialRuleForm: {
      handler(newVal) {
        this.ruleForm = newVal;
      },
      deep: true
    },
    initialRuleList: {
      async handler(newVal) {
        this.ruleList = newVal;
        try {
          for (let i = 0; i < this.ruleList.length; i++) {
            const rule = this.ruleList[i];
            if (rule.subCategory && !this.countryOptions[rule.subCategory]) {
              await this.fetchCountryOptions(rule.subCategory);
            }
          }
        } catch (error) {
        }
      },
      deep: true
    },
    'ruleForm.defaultRule': {
      handler() {
        this.emitUpdate();
      }
    },
    'ruleForm.defaultReward': {
      handler() {
        this.emitUpdate();
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
