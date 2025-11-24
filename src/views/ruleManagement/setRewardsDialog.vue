<template>
  <el-dialog
    :title="isDetails ? $t('查看计费金额') : $t('添加计费金额')"
    :visible.sync="dialogVisible"
    width="600px"
		:close-on-click-modal="false"
    :before-close="handleClose"
    destroy-on-close
    :append-to-body="true"
  >
    <el-form :model="form" label-width="90px" :disabled="isDetails">
      <el-form-item :label="$t('类型') + '：'">
        <el-radio-group v-model="form.rewardType" @change="handleRewardTypeChange">
					<el-radio :label="1" :value="1">{{ $t('固定金额') }}</el-radio>
					<el-radio :label="2" :value="2">{{ $t('自定义') }}</el-radio>
				</el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('计费金额') + '：'" v-if="form.rewardType === 1">
				<el-input v-model="form.reward" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
			<el-form-item :label="$t('金额') + '：'" v-if="form.rewardType === 2">
				<el-table :data="form.tableData" border style="width: 100%">
					<el-table-column :label="$t('数值')">
						<template slot-scope="scope">
							<el-input v-model="scope.row.value" :placeholder="$t('请输入数值')"></el-input>
						</template>
					</el-table-column>
					<el-table-column :label="$t('运算符')">
						<template slot-scope="scope">
							<el-select v-model="scope.row.arithmeticOperator" :placeholder="$t('请选择运算符')">
								<el-option :label="$t('乘号')" value="MULTIPLY"></el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column :label="$t('字段')" width="200">
						<template slot-scope="scope">
							<el-select v-model="scope.row.field" :placeholder="$t('请选择字段')">
								<el-option v-for="item in setRewardsOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!isDetails">
      <el-button @click="handleClose">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ $t('确定') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { setRewardsOptions } from './filterRule';	
export default {
  name: 'SetRewardsDialog',
  props: {
    currency: {
      type: String,
      default: 'USD'
    },
    isDetails: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
			setRewardsOptions,
      dialogVisible: false,
      ruleIndex: -1 , 
      rowIndex: -1 , 
      form: {
        reward: '',
        rewardType: 1,
				tableData: [
					{
						value: '',
						arithmeticOperator: 'MULTIPLY',
						field: ''
					}
				]
      }
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
		// 切换清空对应值
		handleRewardTypeChange() {
			this.form.reward = '';
			this.form.tableData = [
				{
					value: '',
					arithmeticOperator: 'MULTIPLY',
					field: ''
				}
			];
		},
    handleConfirm() {
      // 固定金额
      if (this.form.rewardType === 1) {
        if (!this.form.reward) {
          this.$message.warning('请输入计费金额');
          return;
        }
        // 校验是否为数字
        const rewardNum = Number(this.form.reward);
        if (isNaN(rewardNum)) {
          this.$message.warning('请输入有效的数字');
          return;
        }
        // 校验整数位数不超过5位
        const integerPart = Math.floor(rewardNum).toString();
        if (integerPart.length > 5) {
          this.$message.warning('整数部分不能超过5位');
          return;
        }
        // 校验小数位数不超过2位
        const decimalPart = String(this.form.reward || '').split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
          this.$message.warning('小数位数不能超过2位');
          return;
        }
      }
      // 自定义金额
      if (this.form.rewardType === 2) {
        if (!this.form.tableData[0].value) {
          this.$message.warning('请输入数值');
          return;
        }
        // 校验是否为数字
        const numberValue = Number(this.form.tableData[0].value);
        if (isNaN(numberValue)) {
          this.$message.warning('请输入有效的数字');
          return;
        }
        // 校验不能为0
        if (numberValue <= 0) {
          this.$message.warning('数值不能为0或负数');
          return;
        }
        // 校验整数位数不超过5位
        const integerPart = Math.floor(numberValue).toString();
        if (integerPart.length > 5) {
          this.$message.warning('数值不能超过5位整数');
          return;
        }
        // 校验小数位数不超过2位
        const decimalPart = String(this.form.tableData[0].value || '').split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
          this.$message.warning('数值不能超过2位小数');
          return;
        }
        if (!this.form.tableData[0].arithmeticOperator) {
          this.$message.warning('请选择运算符');
          return;
        }
        if (!this.form.tableData[0].field) {
          this.$message.warning('请选择字段');
          return;
        }
      }
      
      // console.log(this.form);
      this.$emit('update', {
        ruleIndex: this.ruleIndex ,
        rowIndex: this.rowIndex , 
        data: this.form.rewardType === 1 ? {
          rewardType: 1 , 
          reward: this.form.reward
        } : {
          rewardType: 2  ,
          reward: 0 ,
          tableData: this.form.tableData
        }
      });
      this.form.rewardType = 1;
      this.form.reward = '';
      this.form.tableData = [{
        value: '',
        arithmeticOperator: 'MULTIPLY',
        field: ''
      }]
      this.$message.success('暂存成功');
      this.dialogVisible = false;
    },
    open(ruleIndex , rowIndex , reShowData) {
      // console.log(reShowData);
      if(reShowData.feeExpression) {
        this.form.rewardType = 2;
        this.form.tableData[0].value = reShowData.feeExpression.value;
        this.form.tableData[0].arithmeticOperator = reShowData.feeExpression.arithmeticOperator;
        this.form.tableData[0].field = reShowData.feeExpression.field;
      } else {
        this.form.rewardType = 1;
        if(reShowData.reward){
          this.form.reward = reShowData.reward //`${reShowData.reward}`;
        }else {
          this.form.reward = "";
        }
      }
      this.ruleIndex = ruleIndex ; 
      this.rowIndex = rowIndex;
      this.dialogVisible = true;
    }
  },
};
</script>
<style scoped>
.el-form {
    border-top:none;
    padding-top: 0px;
    margin-top: 0px;
}
</style>
