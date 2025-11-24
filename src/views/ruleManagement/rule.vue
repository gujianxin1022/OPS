<template>
	<div class="rule-container-wrapper">
		<div class="rule-top" v-if="!isDialog">
			<span class="rule-container-title">{{ $t('已选择的筛选条件') }}</span>
			<span class="rule-container-item">
				<el-tag type="success">
				{{$t('学科')}}：{{ subject === '0' ? $t('中文') : subject === '1' ? $t('英文') : subject === '2' ? $t('数学') : '' }}
				</el-tag>
			</span>
			<span class="rule-container-item">
				<el-tag type="success">{{$t('薪酬标签')}}：{{ ruleName }}</el-tag>
			</span>
			<span class="rule-container-item">
				<el-tag type="success">{{$t('规则类型')}}：{{ ruleType === 1 ? $t('基本课酬') : ruleType === 2 ? $t('请假') : ruleType === 3 ? $t('扣款') : ruleType === 4 ? $t('试听课转化奖励') : ruleType === 5 ? $t('全勤奖励') : ruleType === 6 ? $t('等级额外奖励') : '' }}</el-tag>
			</span>
			<span class="rule-container-item">
				<el-tag type="success">{{$t('计薪币种')}}：{{ currency }}</el-tag>
			</span>
		</div>
		<!-- 基础课酬 -->
		<jc-rule
			v-if="ruleType === 1"
			ref="jcRule"
			:currency="currency"
			:initial-rule-form="jcRuleForm"
			:initial-rule-list="jcRuleList"
			:status="jcRuleStatus"
			:subject="subject"
			:isDetails="isDetails"
			:isDialog="isDialog"
			@update="handleJcRuleUpdate"
		/>
		<!-- 等级课酬 -->
		<dj-rule
			v-if="ruleType === 1"
			ref="djRule"
			:currency="currency"
			:initial-rule-list="djRuleList"
			:salaryLabelId="salaryLabelId"
			:status="djRuleStatus"
			:subject="subject"
			:isDetails="isDetails"
			:isDialog="isDialog"
			@update="handleDjRuleUpdate"
		/>
		<!-- 保护期课酬 -->
		<bhq-rule
			v-if="ruleType === 1"
			ref="bhqRule"
			:currency="currency"
			:subject="subject"
			:initial-rule-form="bhqRuleForm"
			:initial-rule-list="bhqRuleList"
			:status="bhqRuleStatus"
			:isDetails="isDetails"
			:isDialog="isDialog"
			@update="handleBhqRuleUpdate"
		/>
		<!-- 特殊补贴课酬 -->
		<special-rule
			v-if="ruleType === 1"
			ref="specialRule"
			:currency="currency"
			:initial-rule-list="specialRuleList"
			:status="specialRuleStatus"
			:isDetails="isDetails"
			:isDialog="isDialog"
			@update="handleSpecialRuleUpdate"
		/>
		<!-- 教学行为课酬 -->
		<teach-rule
			v-if="ruleType === 1"
			ref="teachRule"
			:currency="currency"
			:initial-rule-list="teachRuleList"
			:status="teachRuleStatus"
			:isDetails="isDetails"
			:isDialog="isDialog"
			@update="handleTeachRuleUpdate"
		/>
		<!-- 试听课转化奖励 -->
		<trial-lesson-rule
			v-if="ruleType === 4"
			ref="trialLessonRule"
			:currency="currency"
			:initial-rule-list="trialLessonRuleList"
			:status="trialLessonRuleStatus"
			:isDetails="isDetails"
			:isDialog="isDialog"
			@update="handleTrialLessonRuleUpdate"
		/>
		<!-- 全勤奖励 -->
		<all-reward-rule
			v-if="ruleType === 5"
			ref="allRewardRule"
			:salaryLabelId="salaryLabelId"
			:subject="subject"
			:ruleType="ruleType"
			:effectiveTime="basicInfo.effectiveTime"
			:expireTime="basicInfo.expireTime"
			:currency="currency"
			:initial-rule-list="allRewardRuleList"
			:status="allRewardRuleStatus"
			:isDetails="isDetails"
			:isDialog="isDialog"
			@update="handleAllRewardRuleUpdate"
		/>
		<!-- 等级额外奖励 -->
		<grade-reward-rule
			v-if="ruleType === 6"
			ref="gradeRewardRule"
			:currency="currency"
			:initial-rule-list="gradeRewardRuleList"
			:status="gradeRewardRuleStatus"
			:isDetails="isDetails"
			:isDialog="isDialog"
			@update="handleGradeRewardRuleUpdate"
		/>
		<!-- 学生取消 -->
		<student-cancel-rule
			v-if="ruleType === 2"
			ref="studentCancelRule"
			:currency="currency"
			:initial-rule-list="studentCancelRuleList"
			:status="studentCancelRuleStatus"
			:isDetails="isDetails"
			:isDialog="isDialog"
			@update="handleStudentCancelRuleUpdate"
		/>
		<!-- 教师请假 -->
		<teacher-leave-rule
			v-if="ruleType === 2"
			ref="teacherLeaveRule"
			:currency="currency"
			:subject="subject"
			:initial-rule-list="teacherLeaveRuleList"
			:status="teacherLeaveRuleStatus"
			:isDetails="isDetails"
			:isDialog="isDialog"
			@update="handleTeacherLeaveRuleUpdate"
		/>
		<!-- 质检扣款 -->
		<quality-test-rule
			v-if="ruleType === 3"
			ref="qualityTestRule"
			:currency="currency"
			:initial-rule-list="qualityTestRuleList"
			:status="qualityTestRuleStatus"
			:isDetails="isDetails"
			:isDialog="isDialog"
			@update="handleQualityTestRuleUpdate"
		/>
		<!-- 投诉扣款 -->
		<complaint-rule
			v-if="ruleType === 3"
			ref="complaintRule"
			:currency="currency"
			:initial-rule-list="complaintRuleList"
			:status="complaintRuleStatus"
			:isDetails="isDetails"
			:isDialog="isDialog"
			@update="handleComplaintRuleUpdate"
		/>
		<div class="rule-bottom" v-if="!isDialog">
			<el-button @click="handleCancel">{{ $t('取消') }}</el-button>
			<el-button @click="goBack">{{ $t('上一步') }}</el-button>
			<el-button type="primary" @click="saveRule" :loading="loading" v-if="!disabledButton">{{ $t('确定') }}</el-button>
		</div>
	</div>
</template>

<script>
import JcRule from './jcRule.vue'
import DjRule from './djRule.vue'
import BhqRule from './bhqRule.vue'
import TeachRule from './teachRule.vue'
import SpecialRule from './specialRule.vue'
import TrialLessonRule from './trialLessonRule.vue'
import AllRewardRule from './allRewardRule.vue'
import GradeRewardRule from './gradeRewardRule.vue'
import StudentCancelRule from './studentCancalRule.vue'
import TeacherLeaveRule from './teacherLeaveRule.vue'
import QualityTestRule from './qualityTestRule.vue'
import ComplaintRule from './complaintRule.vue'

import { saveSalaryRuleBasicInfo } from "@/api/tutorManagement";
import { saveLevelRule } from "@/api/ruleManagement";

export default {
	components: {
		JcRule,
		DjRule,
		BhqRule,
		TeachRule,
		SpecialRule,
		TrialLessonRule,
		AllRewardRule,
		GradeRewardRule,
		StudentCancelRule,
		TeacherLeaveRule,
		QualityTestRule,
		ComplaintRule
	},
	props: {
		basicInfo: {
			type: Object,
			default: () => ({}),
		},
		ruleList: {
			type: Array,
			default: () => ([]),
		},
		isDetails: {
			type: Boolean,
			default: true,
		},
		isDialog: {
			type: Boolean,
			default: false,
		},
		disabledButton: {
			type: Boolean,
			default: false,
		},
	},
			data() {
		return {
			subject: 2, //中文0、英文 1 、数学2
			salaryLabelId: 1,
			ruleName: "",
			ruleType: -1, // 1: 基本课酬 2: 请假 3: 扣款 4: 试听课转化奖励 5: 全勤奖励 6: 等级额外奖励
			currency: "",
			submitData: [], // 提交数据
			loading: false,
			ruleIds: {
				jcRuleId: '', 
				bhqRuleId: '', 
				djRuleId: '', 
				teachRuleId: '', 
				specialRuleId: '', 
				trialLessonRuleId: '', 
				allRewardRuleId: '', 
				gradeRewardRuleId: '', 
				studentCancelRuleId: '', 
				teacherLeaveRuleId: '', 
				qualityTestRuleId: '', 
				complaintRuleId: '', 
			},
			jcRuleStatus: true,
			djRuleStatus: true,
			bhqRuleStatus: true,
			specialRuleStatus: true,
			teachRuleStatus: true,
			trialLessonRuleStatus: true,
			allRewardRuleStatus: true,
			gradeRewardRuleStatus: true,
			studentCancelRuleStatus: true,
			teacherLeaveRuleStatus: true,
			qualityTestRuleStatus: true,
			complaintRuleStatus: true,
			jcRuleForm: {
				defaultRule: 1,
				defaultReward: "",
			},
			jcRuleList: [
				{
					subCategory: "",
					rewardType: 1 ,
					tableData: [
						{
							logic: "1",
							countries: [''],
							operator: [''],
							countriesChild: [''],
							reward: 0,
						},
					],
				},
			],
			djRuleList: [
				{
					subCategory: "",
					rewardType: 1 ,
					tableData: [
						{
							logic: "1",
							countries: [''],
							operator: [''],
							countriesChild: [''],
							reward: 0,
						},
					]
				}
			],
			bhqRuleForm: {
				defaultRule: 1,
				defaultReward: "",
			},
			bhqRuleList: [
				{
					subCategory: "",
					rewardType: 1 ,
					tableData: [
						{
							logic: "1",
							countries: [''],
							operator: [''],
							countriesChild: [''],
							reward: 0,
						},
					],
				},
			],
			teachRuleList: [
				{
					subCategory: "",
					deductionType: 1,
					rewardType: 2 ,
					tableData: [
						{
							logic: "1",
							countries: [''],
							operator: [''],
							countriesChild: [''],
							deduce: 0,
							reward: 0,
						},
					],
				},
			],
			specialRuleList: [
				{
					subCategory: "",
					rewardType: 1 ,
					tableData: [
						{
							logic: "2",
							countries: [''],
							operator: [''],
							countriesChild: [''],
							reward: 0,
						},
					],
				},
			],
			trialLessonRuleList: [
				{
					subCategory: "",
					rewardType: 1 ,
					tableData: [
						{
							logic: "2",
							countries: [''],
							operator: [''],
							countriesChild: [''],
							reward: 0,
						},
					],
				},
			],
			allRewardRuleList: [
				{
					subCategory: "",
					rewardType: 1 ,
					tableData: [
						{
							logic: "2",
							countries: [''],
							operator: [''],
							countriesChild: [''],
							reward: 0,
						},
					],
				},
			],
			gradeRewardRuleList: [
				{
					subCategory: "",
					rewardType: 1 ,
					tableData: [
						{
							logic: "2",
							countries: [''],
							operator: [''],
							countriesChild: [''],
							reward: 0,
						},
					],
				},
			],
			studentCancelRuleList: [
				{
					subCategory: "",
					deductionType: 1,
					rewardType: 1 ,
					tableData: [
						{
							logic: "2",
							countries: [''],
							operator: [''],
							countriesChild: [''],
							reward: 0,
						},
					],
				},
			],
			teacherLeaveRuleList: [
				{
					subCategory: "",
					deductionType: 1,
					rewardType: 1 ,
					tableData: [
						{
							logic: "2",
							countries: [''],
							operator: [''],
							countriesChild: [''],
							deduce: 0,
						},
					],
				},
			],
			qualityTestRuleList: [
				{
					subCategory: "",
					deductionType: 1,
					rewardType: 1 ,
					tableData: [
						{
							logic: "2",
							countries: [''],
							operator: [''],
							countriesChild: [''],
							deduce: 0,
						},
					],
				},
			],
			complaintRuleList: [
				{
					subCategory: "",
					deductionType: 1,
					rewardType: 1 ,
					tableData: [
						{
							logic: "2",
							countries: [''],
							operator: [''],
							countriesChild: [''],
							deduce: 0,
						},
					],
				},
			],
		}
	},
	methods: {
		goBack() {
			this.$emit('back');
		},
		handleCancel() {
			this.$confirm('确定要取消吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$message({
					type: 'success',
					message: '取消成功!'
				});
				this.$emit('cancel');
			});
		},
		handleJcRuleUpdate(data) {
			this.jcRuleForm = data.ruleForm;
			this.jcRuleList = data.ruleList;
			this.jcRuleStatus = data.status;
		},
		handleDjRuleUpdate(data) {
			this.djRuleList = data.ruleList;
			this.djRuleStatus = data.status;
		},
		handleBhqRuleUpdate(data) {
			this.bhqRuleForm = data.ruleForm;
			this.bhqRuleList = data.ruleList;
			this.bhqRuleStatus = data.status;
		},
		handleTeachRuleUpdate(data) {
			this.teachRuleList = data.ruleList;
			this.teachRuleStatus = data.status;
		},
		handleSpecialRuleUpdate(data) {
			this.specialRuleList = data.ruleList;
			this.specialRuleStatus = data.status;
		},
		handleTrialLessonRuleUpdate(data) {
			this.trialLessonRuleList = data.ruleList;
			this.trialLessonRuleStatus = data.status;
		},
		handleAllRewardRuleUpdate(data) {
			this.allRewardRuleList = data.ruleList;
			this.allRewardRuleStatus = data.status;
		},
		handleGradeRewardRuleUpdate(data) {
			this.gradeRewardRuleList = data.ruleList;
			this.gradeRewardRuleStatus = data.status;
		},
		handleStudentCancelRuleUpdate(data) {
			this.studentCancelRuleList = data.ruleList;
			this.studentCancelRuleStatus = data.status;
		},
		handleTeacherLeaveRuleUpdate(data) {
			this.teacherLeaveRuleList = data.ruleList;
			this.teacherLeaveRuleStatus = data.status;
		},
		handleQualityTestRuleUpdate(data) {
			this.qualityTestRuleList = data.ruleList;
			this.qualityTestRuleStatus = data.status;
		},
		handleComplaintRuleUpdate(data) {
			this.complaintRuleList = data.ruleList;
			this.complaintRuleStatus = data.status;
		},
		// 整理提交数据 
		//type 1 奖励;2 扣除
		doCalcData(data , ruleCategory) {
			let result = [];
			data.forEach(ruleList => {
					const item = {
						subCategory: ruleList.subCategory ,
						ruleDetailList: []
					}
          ruleList.tableData.forEach(rule => {
              const ruleItem = {
                logicOperator: rule.countries && rule.countries.length < 2 ? "" : rule.logic,
                conditions: []
              }
			  // unit 金额单位3种取值来源
				if(rule.reward !== undefined) {
					if(ruleCategory === 7 || ruleCategory === 8) {
						ruleItem.reward = {
							feeValue: rule.reward,
							unit: rule.feeExpression ? 3 : 1
						}
					}else{
						ruleItem.reward = {
							feeValue: rule.reward,
							unit: rule.feeExpression ? 3 : (ruleList.rewardType ? ruleList.rewardType : 1)
						}
					}
					if(rule.feeExpression) {
						ruleItem.reward.feeValue="";
						ruleItem.reward.feeExpression = rule.feeExpression;
					}
				}
				if(rule.deduce !== undefined) {
					ruleItem.deduce = {
						feeValue: rule.deduce,
						unit: ruleList.deductionType ? ruleList.deductionType : 2,
					}
					if(rule.feeExpression !== undefined && rule.feeExpression !== null) {
						ruleItem.deduce.feeValue="";
						ruleItem.deduce.feeExpression = rule.feeExpression;
					}
				}
				rule.countries.forEach((country , idx) => {
					let value = rule.countriesChild[idx];
					if(country === "teacherAttendTime" || country === "teacherLateArrivalTime" || country === "teacherLeaveEarlyTime") {
						value = value * 60;
					}
					if(country === "cancelTimeGapOfStart" || country === "leaveTimeGapOfStart") {
						value = value * 3600;
					}
					const i = {
						field: country ,
						relationalOperator: rule.operator[idx] ,
						value: Array.isArray(value) 
							? (() => {
								const arr = value;
								if (arr.length === 1) {
									return arr[0] + ',0,0';
								} else if (arr.length === 2) {
									return arr.join(',') + ',0';
								} else {
									return arr.join(',');
								}
							})()
							: value
					}
					ruleItem.conditions.push(i);
				});
				item.ruleDetailList.push(ruleItem);
			});
			result.push(item);
		});
			return result;
		} , 
		// 存储规则ID的方法
		storeRuleId(ruleCategory, id) {
			const idMapping = {
				1: 'jcRuleId', 
				2: 'bhqRuleId', 
				3: 'djRuleId', 
				4: 'teachRuleId', 
				5: 'specialRuleId', 
				6: 'trialLessonRuleId', 
				7: 'allRewardRuleId', 
				8: 'gradeRewardRuleId', 
				9: 'studentCancelRuleId', 
				10: 'teacherLeaveRuleId', 
				11: 'qualityTestRuleId', 
				12: 'complaintRuleId', 
			};
			const idKey = idMapping[ruleCategory];
			if (idKey && id) {
				this.ruleIds[idKey] = id;
			}
		},
		// 获取规则ID的方法
		getRuleId(ruleCategory) {
			const idMapping = {
				1: 'jcRuleId', 
				2: 'bhqRuleId', 
				3: 'djRuleId', 
				4: 'teachRuleId', 
				5: 'specialRuleId', 
				6: 'trialLessonRuleId', 
				7: 'allRewardRuleId', 
				8: 'gradeRewardRuleId', 
				9: 'studentCancelRuleId', 
				10: 'teacherLeaveRuleId', 
				11: 'qualityTestRuleId', 
				12: 'complaintRuleId', 
			};
			const idKey = idMapping[ruleCategory];
			return idKey ? this.ruleIds[idKey] : '';
		},
		// 通用方法：构建规则选项
		// type: 1 奖励课酬金额 2 扣除课酬金额
		buildRuleOption(ruleCategory, status, ruleForm = null, ruleList = null, type = 1) {
			const option = {
				id: this.getRuleId(ruleCategory), // 获取对应的ID，如果没有则为空字符串
				ruleCategory: ruleCategory,
				status: status
			};
			// console.log(ruleCategory,'-',status)			
			if (status === 0) {
				if([1,2].includes(ruleCategory)) {
					option.defaultRule = ruleForm.defaultRule;
					if (ruleForm.defaultRule === 1) {
						option.defaultReward = ruleForm.defaultReward;
					} else {
						option.customRuleList = this.doCalcData(ruleList, ruleCategory);
					}
				} else {
					option.customRuleList = this.doCalcData(ruleList, ruleCategory);
				}
			}
			// console.log(ruleList);
			return option;
		} , 
		// 回显数据方法
		doResetData(data) {
			switch (data.ruleCategory) {
				case 1:
					this.doResetDataList(data ,'jcRuleStatus' ,  'jcRuleForm' , 'jcRuleList');
					break;
				case 2:
					this.doResetDataList(data ,'bhqRuleStatus' ,  'bhqRuleForm' , 'bhqRuleList');
					break;
				case 3:
					this.doResetDataList(data ,'djRuleStatus' , null , 'djRuleList');
					break;
				case 4:
					// console.log('teachRuleList' , data);
					this.doResetDataList(data ,'teachRuleStatus' , null , 'teachRuleList');
					break;
				case 5:
					this.doResetDataList(data ,'specialRuleStatus' , null , 'specialRuleList');
					break;
				case 6:
					this.doResetDataList(data ,'trialLessonRuleStatus' , null , 'trialLessonRuleList');
					break;
				case 7:
					this.doResetDataList(data ,'allRewardRuleStatus' , null , 'allRewardRuleList');
					break;
				case 8:
					this.doResetDataList(data ,'gradeRewardRuleStatus' , null , 'gradeRewardRuleList');
					break;
				case 9:
					this.doResetDataList(data ,'studentCancelRuleStatus' , null , 'studentCancelRuleList');
					break;
				case 10:
					this.doResetDataList(data ,'teacherLeaveRuleStatus' , null , 'teacherLeaveRuleList');
					break;
				case 11:
					this.doResetDataList(data ,'qualityTestRuleStatus' , null , 'qualityTestRuleList');
					break;
				case 12:
					this.doResetDataList(data ,'complaintRuleStatus' , null , 'complaintRuleList');
					break;

			}
	
		} , 
		doResetDataList(data , categoryStatus , formName , ruleListName) {
			/**
			 * 参数说明：
			 * data：表示需要处理并回显的数据
			 * categoryStatus：表示每一个课酬的打开或关闭
			 * formName：表示是否有form以及对应form的名称；为null是表示不需要；例如：基础课酬、保护期课酬 这两个需要用到，其他就传 null
			 * ruleListName：表示有回显的数据名称；表示对应课酬的数据接收名称，如 jcRuleList , djRuleList 等等，
			 */
			// 存储ID值，用于编辑时提交
			this.storeRuleId(data.ruleCategory, data.id);
			this[categoryStatus] = data.status === 0 ;
			if(formName){
				this[formName].defaultRule = data.defaultRule ;
				this[formName].defaultReward = data.defaultReward;
			}
			if(data.defaultRule === 0 ) {
				const list = [];
				data.customRuleList.forEach((item , idx) => {
						const row = {
							subCategory: item.subCategory ,
							tableData: []
						}
						item.ruleDetailList.forEach(rule => {
						const rowItem = {
							logic: rule.logicOperator ? `${rule.logicOperator}` : '1',
							countries: [] ,
							operator: [] ,
							countriesChild: [] ,
						}
						if(rule.reward !== undefined && rule.reward !== null) {
							rowItem.reward = rule.reward.feeValue;
							row.rewardType = rule.reward.unit;
							// if([7 , 8].includes(data.ruleCategory) && rule.reward.feeExpression) {
								rowItem.feeExpression = rule.reward.feeExpression;
							// }
						}
						if(rule.deduce !== undefined && rule.deduce !== null) {
							rowItem.deduce = rule.deduce.feeValue;
							row.deductionType = rule.deduce.unit
							rowItem.feeExpression = rule.deduce.feeExpression;
						}

						rule.conditions.forEach(conditions => {
							
							rowItem.countries.push(conditions.field);
							rowItem.operator.push(conditions.relationalOperator);
							// console.log('针对地区课酬conditions--------前:', conditions.value);
							//针对地区课酬
							let value = typeof conditions.value === 'string' && conditions.value.includes(',') 
								? (() => {
									const numbers = conditions.value.split(',').map(item => Number(item));
									if (numbers.length === 3) {
										if (numbers[1] === 0 && numbers[2] === 0) {
											return [numbers[0]]; 
										} else if (numbers[2] === 0) {
											return [numbers[0], numbers[1]]; 
										} else {
											return numbers; 
										}
									} else {
										return numbers;
									}
								})()
								: conditions.value;
							
							// 回显数据时，将包含特定时间字段的countriesChild值分别除以60或3600
							if (conditions.field === "teacherAttendTime" || conditions.field === "teacherLateArrivalTime" || conditions.field === "teacherLeaveEarlyTime") {
								if (Array.isArray(value)) {
									value = value.map(item => Number(item) / 60);
								} else {
									value = Number(value) / 60;
								}
							} else if (conditions.field === "cancelTimeGapOfStart" || conditions.field === "leaveTimeGapOfStart") {
								if (Array.isArray(value)) {
									value = value.map(item => Number(item) / 3600);
								} else {
									value = Number(value) / 3600;
								}
							}
							// console.log('针对地区课酬conditions--------后:', value);
							rowItem.countriesChild.push(value);
						})
						row.tableData.push(rowItem);
						})						 
						list.push(row);
				});
				this[ruleListName] = list;
			}
		} , 
		async saveRule() {
			try {
				this.loading = true;
				this.submitData = [];
				switch (this.ruleType) {
					case 1:
						// 基础课酬
						await this.$refs.jcRule.validate();
						const jcOpt = this.buildRuleOption(1, this.jcRuleStatus ? 0 : 1, this.jcRuleForm, this.jcRuleList, 1);
						// 等级课酬
						await this.$refs.djRule.validate();
						const djOpt = this.buildRuleOption(3, this.djRuleStatus ? 0 : 1, null, this.djRuleList, 1);
						// 保护期课酬
						await this.$refs.bhqRule.validate();
						const bhqOpt = this.buildRuleOption(2, this.bhqRuleStatus ? 0 : 1, this.bhqRuleForm, this.bhqRuleList, 1);
						// 教学行为课酬
						//console.log('teachRuleList-----' , this.teachRuleList);
						await this.$refs.teachRule.validate();
						const teachOpt = this.buildRuleOption(4, this.teachRuleStatus ? 0 : 1, null, this.teachRuleList, 1);
						// 特殊补贴课酬
						await this.$refs.specialRule.validate();
						const specialOpt = this.buildRuleOption(5, this.specialRuleStatus ? 0 : 1, null, this.specialRuleList, 1);
						this.submitData.push(jcOpt);
						this.submitData.push(bhqOpt);
						this.submitData.push(djOpt);
						this.submitData.push(teachOpt);
						this.submitData.push(specialOpt);
						break;
					case 2:
						// 学生取消
						await this.$refs.studentCancelRule.validate();
						const studentCancelOpt = this.buildRuleOption(9, this.studentCancelRuleStatus ? 0 : 1, null, this.studentCancelRuleList, 1);
						// 教师请假
						// console.log('teacherLeaveRuleList-----' , this.teacherLeaveRuleList);
						await this.$refs.teacherLeaveRule.validate();
						const teacherLeaveOpt = this.buildRuleOption(10, this.teacherLeaveRuleStatus ? 0 : 1, null, this.teacherLeaveRuleList, 1);
						this.submitData.push(studentCancelOpt);
						this.submitData.push(teacherLeaveOpt);
						break;
					case 3:
						// 质检扣款
						await this.$refs.qualityTestRule.validate();
						const qualityTestOpt = this.buildRuleOption(11, this.qualityTestRuleStatus ? 0 : 1, null, this.qualityTestRuleList, 2);
						// 投诉扣款
						await this.$refs.complaintRule.validate();
						const complaintOpt = this.buildRuleOption(12, this.complaintRuleStatus ? 0 : 1, null, this.complaintRuleList, 2);
						this.submitData.push(qualityTestOpt);
						this.submitData.push(complaintOpt);
						break;
					case 4:
						// 试听课转化奖励
						await this.$refs.trialLessonRule.validate();
						const trialLessonOpt = this.buildRuleOption(6, this.trialLessonRuleStatus ? 0 : 1, null, this.trialLessonRuleList, 1);
						this.submitData.push(trialLessonOpt);
						break;
					case 5:
						// 全勤奖励
						// console.log('allRewardRuleList-----' , this.allRewardRuleList);
						await this.$refs.allRewardRule.validate();
						const allRewardOpt = this.buildRuleOption(7, this.allRewardRuleStatus ? 0 : 1, null, this.allRewardRuleList, 1);
						this.submitData.push(allRewardOpt);
						break;
					case 6:
						// 等级额外奖励
						await this.$refs.gradeRewardRule.validate();
						const gradeRewardOpt = this.buildRuleOption(8, this.gradeRewardRuleStatus ? 0 : 1, null, this.gradeRewardRuleList, 1);
						this.submitData.push(gradeRewardOpt);
						break;
				}	
				const params={
					...this.basicInfo,
					ruleList:this.submitData
				}
				const res = await saveLevelRule(params);
				if(res.status === 200 && res.data.code === 200) {
					this.$message.success('保存成功');
					this.$emit('cancel');
				}
			} catch (error) {
				console.log('error', error);
				if (error.message) {
					this.$message.error(error.message);
				} else {
					this.$message.error('保存失败，请检查表单数据');
				}
			}
			this.loading = false;
		},
	},
	mounted(){
		
	},
	watch: {
		basicInfo: {
			handler(newVal) {
				if (newVal) {
					this.ruleType = newVal.ruleType;
					this.ruleName = newVal.ruleName;
					this.currency = newVal.salaryCurrencyName; 
					this.subject = newVal.subjectType;
					this.salaryLabelId = newVal.salaryLabel; 
				}
			},
			deep: true,
			immediate: true 
		},
		ruleList: {
			handler(newVal, oldVal) {
				// console.log('ruleList changed:', newVal);
				this.jcRuleStatus = newVal.filter(item => item.ruleCategory === 1).length > 0 ;
				this.djRuleStatus = newVal.filter(item => item.ruleCategory === 3).length > 0;
				this.bhqRuleStatus = newVal.filter(item => item.ruleCategory === 2).length > 0 ;
				this.teachRuleStatus = newVal.filter(item => item.ruleCategory === 4).length > 0 ;
				this.specialRuleStatus = newVal.filter(item => item.ruleCategory === 5).length > 0 ;
				this.trialLessonRuleStatus = newVal.filter(item => item.ruleCategory === 6).length > 0 ;
				this.allRewardRuleStatus = newVal.filter(item => item.ruleCategory === 7).length > 0 ;
				this.gradeRewardRuleStatus = newVal.filter(item => item.ruleCategory === 8).length > 0 ;
				this.studentCancelRuleStatus = newVal.filter(item => item.ruleCategory === 9).length > 0 ;
				this.teacherLeaveRuleStatus = newVal.filter(item => item.ruleCategory === 10).length > 0 ;
				this.qualityTestRuleStatus = newVal.filter(item => item.ruleCategory === 11).length > 0 ;
				this.complaintRuleStatus = newVal.filter(item => item.ruleCategory === 12).length > 0 ;

				newVal.forEach(item => {
					this.doResetData(item);
				});
			},
			deep: true,
		}
	}
};
</script>
<style lang="scss">
.table-width{
	width: var(--table-width, 100%);
}
.rule-container-wrapper {
	padding-bottom: 20px;
}

.rule-top {
	font-size: 12px;
	padding: 30px 20px;
	color: #666;

	.rule-container-title {
		font-size: 16px;
		font-weight: bold;
		padding-right: 0px;
	}

	.rule-container-item {
		padding-right: 20px;
	}
}

.rule-container {
	border: 1px solid #e6e6e6;
	border-radius: 5px;
	margin: 0px 20px;
	padding: 20px;
	margin-bottom: 20px;

	.rule-container-title {
		font-size: 16px;
		font-weight: bold;
	}

	.rule-right {
		float: right;
	}
}

.rule-container-content .el-form {
	border-top: 1px solid #e6e6e6;
	padding-top: 20px;
	margin-top: 20px;
}

.rule-tab-content {
	border: 1px solid #e6e6e6;
	border-radius: 5px;
	padding: 10px;
	margin-bottom: 10px;
}

.rule-container-content .table-header {
	background-color: #f5f7fa;
}

.pl-100 {
	padding-left: 100px;
}
.ml-20 {
	margin-left: 20px;
}
.mt-10 {
	margin-top: 10px;
}

.tab-wrapper {
	display: flex;
	align-items: center;
}

.tab-operation {
	align-items: end;
	justify-content: center;
}

.tab-left {
	margin-right: 10px;
}

.tab-right {
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 4px;
}

.tab-line-left {
	margin-right: 10px;
	position: relative;

	&::after {
		content: '';
		position: absolute;
		right: -10px;
		top: 50%;
		width: 10px;
		height: 1px;
	}
}

.tab-line-right {
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 4px;
	position: relative;

	&::before {
		content: '';
		position: absolute;
		left: -8px;
		top: 17px;
		width: 1px;
		height: calc(100% - 33px);
		background-color: #DCDFE6;
		display: none;
	}

	&:has(div:nth-child(2)) {
		&::before {
			display: block;
		}
	}

	> div {
		position: relative;

		&::before {
			content: '';
			position: absolute;
			left: -7px;
			top: 50%;
			width: 8px;
			height: 1px;
			background-color: #DCDFE6;
		}
	}
}
.tab-line-right > div:only-of-type::before {
	display: none !important;
}

.rule-bottom {
	text-align: center;

	.el-button {
		width: 100px;
	}
}
</style>
