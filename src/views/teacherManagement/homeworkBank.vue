<template>
	<div class="homework-bank">
		<div class="head mb20">{{$t('题库')}}</div>
		<div class="choose-edition pl20">
			<span class="label mr10">{{$t('版本')}}{{$t('级别')}}</span>
			<el-cascader
				:placeholder="$t('my-home-Select')"
				v-model="editionAndLevel"
				:options="editionAndLevelInfo"
				@change="chooseEditionLevel">
			</el-cascader>
			<span class="label mr10 ml20" v-if="lessonSubjectData!==null">{{$t('my-home-Curriculum')}}</span>
			<el-select v-model="lessonId" :placeholder="$t('my-home-Select')" v-if="lessonSubjectData!==null">
				<el-option
					v-for="item in lessonSubjectData"
					:key="item.value"
					:label="item.lessonNo.toString()"
					:value="item.id">
				</el-option>
			</el-select>
			<img class="publish-icon" :src="publishIcon" alt="" srcset="" v-if="lessonId && hasPublishHomework">
		</div>
		<div class="operation-buttons pl20" v-if="lessonId!==null&&existOutlineInfo!==null">
			<el-button type="primary" @click="showNewOutline=true">{{$t('新建')}}</el-button>
			<el-button type="primary" v-if="hasDraftHomework" @click="preview">{{$t('预览')}}</el-button>
			<el-button type="primary" v-if="hasDraftHomework" @click="showKnowledge">{{$t('知识点大纲')}}</el-button>
			<el-button type="primary" v-if="hasDraftHomework && Per.handleButtonPer('teacherMT.homeworkBank.publishHomework')" :loading="publishLoading" @click="releaseHomework(1)">{{$t('发布')}}</el-button>
			<el-button type="primary" v-if="hasDraftHomework" @click="gotoMakeHomeworkPage">{{$t('修改')}}</el-button>
		</div>
		<!-- 制作大纲弹框 start -->
		<el-dialog :before-close="closeNewOutline" :close-on-click-modal="false" :visible.sync="showNewOutline" class="new-outline" title="新建作业">
			<div class="sub-title">请选择题目类型和题目数量</div>
			<div class="new-outline-body">
				<div class="oulines" v-for="(outlineItem, outlineIndex) in oulineData" :key="outlineIndex">
					<span class="mr5">{{outlineIndex+1}}.</span>
					<span>题目类型：</span>
					<el-select @change="chooseSubjectType(outlineIndex)" v-model="outlineItem.type" placeholder="请选择题型">
						<el-option
							v-for="item in subjects"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
					<span class="subject-number">题目数量：</span>
					<el-input v-if="outlineItem.type!==5&&outlineItem.type!==6" v-model="outlineItem.number" placeholder="请输入题目数量" type="number" min="0"></el-input>
					<el-input v-else value="1" placeholder="请输入题目数量" type="number" disabled=""></el-input>
				</div>
				<el-button type="primary" @click="addOneSubject">添加一道大题</el-button>
			</div>
			<div class="sureto-make-subject">
				<el-button type="primary" :loading="hasCreateOutline" @click="renderAllSubject">确定</el-button>
			</div>
		</el-dialog>
		<!-- 制作大纲弹框 end -->
		<!-- 知识点大纲 start -->
		<el-dialog :visible.sync="isShowKonwledge" class="set-knowledge" :center="true" title="设置知识点">
			<el-input
				type="textarea"
				:rows="5"
				placeholder="点击输入本节课考察内容"
				v-model="knowledgeContent"
				:before-close="closeKnowledgePoints"
			>
			</el-input>
			<div class="sureto-make-subject">
				<el-button type="primary" :loading="loading" class="mt20" @click="submitKnowledge">确定</el-button>
			</div>
		</el-dialog>
		<!-- 知识点大纲 end -->
		<PreviewDialog :isShowPreview="isShowPreview" :subjectData="subjectData" @closePreviewDialog="closePreviewDialog"></PreviewDialog>
	</div>
</template>

<script>
import PreviewDialog from './components/previewDialog'
import { Loading } from 'element-ui'
import publishIcon from '../../assets/publishIcon.png'
export default {
	name: 'homeworkBank',
	data() {
		return {
			publishIcon: publishIcon,
			editionAndLevelInfo: null,
			editionAndLevelOriginData: null,
			editionAndLevel: null,
			courseId: null,
			lessonId: null,
			hasDraftHomework: false,
			hasPublishHomework: false,
			showNewOutline: false,
			oulineData: [
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
			],
			subjects: [
				{
					value: 1,
					label: '选择题'
				},
				{
					value: 2,
					label: '填空题'
				},
				{
					value: 3,
					label: '连线题'
				},
				{
					value: 4,
					label: '排序题'
				},
				{
					value: 5,
					label: '阅读题'
				},
				{
					value: 6,
					label: '其他'
				}
			],
			existOutlineInfo: null,
			isShowKonwledge: false,
			knowledgeContent: null,
			loading: false,
			subjectData: null,
			isShowPreview: false,
			lessonSubjectData: null,
			choiceData: {
				"type": 1,
				"knowledgePointId": null,
				"remark": "",
				"remarkContent": "",
				"question": "",
				"questionImage": "",
				"options": [{"answer": "", "answerImage": ""},{"answer": "", "answerImage": ""},{"answer": "", "answerImage": ""},{"answer": "", "answerImage": ""}]
			},
			choiceOtherOption: {
				"answer": "",
				"answerImage": ""
			},
			fillBlankData: {
				"type": 2,
				"knowledgePointId": null,
				"remark": "",
				"remarkContent": "",
				"options": [{"sentence": "", "rightFlag": 0}, {"sentence": "", "rightFlag": 1}, {"sentence": "", "rightFlag": 0}]
			},
			fillBlankOptions: [{"sentence": "", "rightFlag": 0}, {"sentence": "", "rightFlag": 1}, {"sentence": "", "rightFlag": 0}],
			connectionData: {
				"type": 3,
				"knowledgePointId": 1,
				"remark": "",
				"remarkContent": "",
				"options": [{"head": "", "headImage": "", "tail": "", "tailImage": ""},{"head": "", "headImage": "", "tail": "", "tailImage": ""},{"head": "", "headImage": "", "tail": "", "tailImage": ""},{"head": "", "headImage": "", "tail": "", "tailImage": ""}]
			},
			sortData: {
				"type": 4,
				"knowledgePointId": 1,
				"remark": "",
				"remarkContent": "",
				"pre": "",
				"post": "",
				"options": [{"word": ""}, {"word": ""}, {"word": ""}, {"word": ""}]
			},
			sortOptions: {"word": ""},
			readData:	{
				"type":5,
				"knowledgePointId": 1,
				"remark": "",
				"remarkContent": "",
				"content":""
			},
			readChoiceSubjectData: {
				"type": 1,
				"name": "选择题",
				"remark": "请选择正确的选项",
				"quality": 1,
				"questionExtendResultList": [],
			},
			readFillBlankSubjectData: {
				"type": 2,
				"name": "填空题",
				"remark": "请在下划线处填上正确的答案",
				"quality": 1,
				"questionExtendResultList": [],
			},
			otherQuestionData: {
				"type": 6,
				"knowledgePointId": 1,
				"remark": "",
				"remarkContent": "",
				"content": {
					"fileUrl": "",
					"fileType": "",
				}
			},
			typeToName: {
				1: '选择题',
				2: '填空题',
				3: '连线题',
				4: '排序题',
				5: '阅读题',
				6: '其他'
			},
			typeToRemark: {
				1: '请选择正确的选项',
				2: '请在下划线处填上正确的答案',
				3: '点击汉字，选择它的拼音',
				4: '按照顺序点击下列内容',
				5: '阅读短文回答问题',
				6: '请完成之后拍照上传'
			},
			hasCreateOutline: false,
			publishLoading: false,
			checkData: false
		}
	},
	watch: {
		lessonId(newVal, oldVal) {
			if (newVal) this.getOutline(this.lessonId)
		},
		editionAndLevel(newVal, oldVal) {
			this.lessonId = null
			this.editionAndLevelOriginData.forEach(item => {
				if (item.editionId === newVal[0]) {
					item.courseLevelInfoList.forEach(course => {
						if (course.courseLevel === newVal[1]) {
							this.courseId = course.levelId
							return
						}
					})
				}
			})
		},
		courseId(newVal, oldVal) {
			this.lessonSubjectData = null
			this.$Api.teacherManagement.getAllLessons(newVal)
			.then(res => {
				this.lessonSubjectData = res.data.data
			})
		}
	},
	mounted() {
		this.$Api.base.courseEdition()
			.then(res => {
				if(res.status === 200) {
					this.editionAndLevelOriginData = res.data.data
					this.editionAndLevelInfo = []
					res.data.data.forEach((editionValue, editionIndex) => {
						this.editionAndLevelInfo[editionIndex] = {};
						this.editionAndLevelInfo[editionIndex]['value'] = editionValue.editionId;
						this.editionAndLevelInfo[editionIndex]['label'] = editionValue.editionNameZh;
						this.editionAndLevelInfo[editionIndex]['children'] = [];
						editionValue.courseLevelInfoList.forEach((levelValue, levelIndex) => {
							this.editionAndLevelInfo[editionIndex]['children'][levelIndex] = {}
							this.editionAndLevelInfo[editionIndex]['children'][levelIndex]['value'] = levelValue.courseLevel;
							this.editionAndLevelInfo[editionIndex]['children'][levelIndex]['label'] = levelValue.courseName;
						})
					})
				}
			})
	},
	methods: {
		closeKnowledgePoints() {
			this.isShowKonwledge = false
			this.knowledgeContent = ''
		},
		closeNewOutline() {
			this.resetOutline()
			this.showNewOutline = false
		},
		closePreviewDialog() {
			this.isShowPreview=false
		},
		generateSubjectData(item) {
			switch (item.type) {
				case 1:
					return this.choiceData
					return
					break;
				case 2:
					return this.fillBlankData
					break;
				case 3:
					return this.connectionData
					break;
				case 4:
					return this.sortData
					break;
				case 5:
					return this.readData
					break;
				case 6:
					return this.otherQuestionData
					break;
			}
		},
		combineSubject() {
			let uploadData = {
				lesson_id: this.lessonId,
				outline_id: this.subjectData[0].outline,
				outline_group: []
			}

			this.subjectData.forEach((outlineItem, outlineIndex) => {
				let outlineGroupItem = {
					outline_group_id: outlineItem.id,
					homework: []
				}
				outlineItem.homework_question.forEach((homeworkItem, homeworkIndex) => {
					let topic = {
						id: homeworkItem.id,
						knowledge_point_id: homeworkItem.knowledge_point_id,
						knowledge_point_remark: homeworkItem.knowledge_point_remark,
						knowledge_point_remark_content: homeworkItem.knowledge_point_remark_content,
					}
					switch (homeworkItem.type) {
						case (1||3): {
							topic['question'] = homeworkItem['question']
							topic['questionImage'] = homeworkItem['questionImage']
							topic['options'] = homeworkItem['options']
							break
						}
						case 2: {
							topic['options'] = homeworkItem['options']
							break
						}
						case 3: {

						}
						case 4: {
							topic['pre'] = homeworkItem['pre']
							topic['post'] = homeworkItem['post']
							topic['options'] = homeworkItem['options']
							break
						}
						case 5: {
							topic['htmlArticle'] = homeworkItem['content']
							topic['children'] = []
							homeworkItem.children.forEach((subReadSubject, subReadSubjectIndex) => {
								let typeTopic = {
									type: subReadSubject.type,
									outline_group_id: subReadSubject.id,
									outline_group_name: subReadSubject.name,
									outline_group_remark: subReadSubject.remark,
									children_question: []
								}
								subReadSubject.homework_question.forEach((topicItem, topicIndex) => {
									if (subReadSubject.type === 1) {
										typeTopic.children_question.push({
											question_id: topicItem.id,
											question: topicItem.content.question,
											questionImage: topicItem.content.questionImage,
											options: topicItem.content.options
										})
									} else {
										typeTopic.children_question.push({
											question_id: topicItem.id,
											options: topicItem.content.options
										})
									}
								})
								topic['children'].push(typeTopic)
							})
						}
						case 6: {

						}
					}
					outlineGroupItem.homework.push(topic)
				})
				uploadData.outline_group.push(outlineGroupItem)
			})

			return uploadData
		},
		releaseHomework() {
			// if (!this.subjectData) {
			// 	this.getSubject(this.lessonId, 'release', status)
			// } else {
				this.checkData = true
				this.getSubject(this.lessonId, 'release')
				// this.publishHomework()
			// }

		},
		publishHomework() {
			// if (this.subjectData.length === 0) {
			// 	this.$notify({
			// 		message: '没有题目哦~',
			// 		type: 'error'
			// 	})
			// 	return
			// }
      this.publishLoading = true
			this.$Api.teacherManagement.publishHomework(this.lessonId)
			.then(res => {
				if (res.status === 200) {
					if (res.data.code === 200) {
						this.$notify({
							message: '发布成功',
							type: 'success'
						})
						this.getOutline(this.lessonId)
					}
				}
				this.publishLoading = false
			})
			.catch(e => {
				this.publishLoading = false
			})
		},
		preview() {
			// if (this.existOutlineInfo.status !== 0) {
				this.checkData = false
				this.getSubject(this.lessonId, 'preview')
			// } else {
				this.isShowPreview = true
			// } else {
			// 	this.$notify({
			// 		type: 'warning',
			// 		message: '本节课没有作业'
			// 	})
			// }
		},
		setKnowledge() {

		},
		getSubject(lesson_id, operation) {
			this.$Api.teacherManagement.queryHomeworkInfo({lessonId: lesson_id, status: this.hasPublishHomework && operation === 'preview'?1:0})
				.then(res => {
					if (res.status === 200 && res.data.code === 200) {
						let lessonSubjectData = res.data.data
						if (operation === 'release') {
							// 检查是否所有大题下都有小题
							if (res.data.data.every(outlineItem => outlineItem.questionExtendResultList.length > 0)) {
								this.produceSubjectData(lessonSubjectData, operation)
							} else {
								this.$notify({
									type: 'warning',
									message: '本节课没有题目，不可发布'
								})
							}
						} else {
							this.produceSubjectData(lessonSubjectData, operation)
						}
					}
				}
			)
		},
		produceSubjectData(subjectData, operation) {
			subjectData.forEach(item => {
				item.name = item.name || this.typeToName[item.type]
				item.remark = item.remark || this.typeToRemark[item.type]
				if (item.questionExtendResultList.length === 0 || (item.type === 5 && item.outlineResultList === null)) {
					// 点击发布检查数据
					// if (this.checkData) {
					// 	this.$notify({
					// 		type: 'warning',
					// 		message: '请完整填写题目后发布'
					// 	})
					// } else {
						item.questionExtendResultList = []
						for (let i = 0; i < item.quality; i++) {
							item.type = Number(item.type)
							item.questionExtendResultList.push(JSON.parse(JSON.stringify(this.generateSubjectData(item))))
						}
						if (item.type === 5) {
							item.outlineResultList = []
							item.outlineResultList.push(JSON.parse(JSON.stringify(this.readChoiceSubjectData)))
							item.outlineResultList[0].questionExtendResultList.push(JSON.parse(JSON.stringify(this.choiceData)))
							item.outlineResultList.push(JSON.parse(JSON.stringify(this.readFillBlankSubjectData)))
							item.outlineResultList[1].questionExtendResultList.push(JSON.parse(JSON.stringify(this.fillBlankData)))
						}
					// }
				} else {
					let hasComplete = true
					if (item.type !== 5) {
						item.questionExtendResultList.forEach(homework => {
							homework = Object.assign(homework, homework.contentJson)
							if (!hasComplete) throw new Error("ending")

							// 发布前检查数据
							if (this.checkData) {
								switch (item.type) {
							// 		case 1: {
							// 			hasComplete = (homework.question !== '' || homework.questionImage !== '') && homework.options.every(item => item.answer !== '' || item.answerImage !== '')
							// 			console.log(hasComplete, '选择题')
							// 			if (!hasComplete) {
							// 				this.$notify({
							// 					type: 'warning',
							// 					message: '选择题未填写完整'
							// 				})
							// 			}
							// 			break
							// 		}
							// 		case 2: {
							// 			hasComplete = !homework.options.some(item => item.rightFlag === 1 && item.sentence === '')
							// 			console.log(hasComplete, '填空题')
							// 			if (!hasComplete) {
							// 				this.$notify({
							// 					type: 'warning',
							// 					message: '填空题未填写完整'
							// 				})
							// 			}
							// 			break
							// 		}
									case 3: {
										let headArr = [], tailArr = [], headUnit = false, taiUnit = false
										let hasCompleteConnection = homework.options.every(item => {
											headArr.push(item.head)
											tailArr.push(item.tail)
											return ((item.head !== '' || item.headImage !== '') && !(item.head !== '' && item.headImage !== '')) && ((item.tail !== '' || item.tailImage !== '') && !(item.tail !== '' && item.tailImage !== ''))
											// return (item.head !== '' || item.headImage !== '' && !(item.head !== '' && item.headImage !== '')) && (item.tail !== '' || item.tailImage !== '' && !(item.tail !== '' && item.tailImage !== ''))
										})
										if (hasCompleteConnection) {
											headUnit = headArr.every(item => (headArr[0] === '' ? item === '' : item !== ''))
											taiUnit = tailArr.every(item => (tailArr[0] === '' ? item === '' : item !== ''))
											if (!headUnit || !taiUnit) {
												hasComplete = false
												this.$notify({
													type: 'warning',
													message: '连线题未填写完整或填写不规范'
												})
											}
										} else {
											hasComplete = false
											if (!hasComplete) {
												this.$notify({
													type: 'warning',
													message: '连线题未填写完整或填写不规范'
												})
											}
										}
										if (!hasComplete) throw new Error("ending")
										break
									}
							// 		case 4: {
							// 			hasComplete = !(homework.pre === '' && homework.post === '') && homework.options.every(item => item.word !== '')
							// 					console.log(hasComplete, '排序题')
							// 			if (!hasComplete) {
							// 				this.$notify({
							// 					type: 'warning',
							// 					message: '排序题未填写完整'
							// 				})
							// 			}
							// 			break
							// 		}
							// 		case 6: {
							// 			hasComplete = homework.fileUrl !== ''
							// 					console.log(hasComplete, '其他题')
							// 			if (!hasComplete) {
							// 				this.$notify({
							// 					type: 'warning',
							// 					message: '其他题未上传文件'
							// 				})
							// 			}
							// 			break
							// 		}
								}
							}
						})
					} else if (item.outlineResultList !== null) {
						item.outlineResultList.forEach(typeSubject => {
							typeSubject.questionExtendResultList.forEach(smallTopic => {
								smallTopic = Object.assign(smallTopic, smallTopic.contentJson)

								// if (!hasComplete) throw new Error('ending')
								// 发布前检查数据
								// if (this.checkData) {
								// 	switch (smallTopic.type) {
								// 		case 1: {
								// 			hasComplete = (smallTopic.question !== '' || smallTopic.questionImage !== '') && smallTopic.options.every(item => item.answer !== '' || item.answerImage !== '')
								// 					console.log(hasComplete, '阅读题下的选择题')
								// 			if (!hasComplete) {
								// 				this.$notify({
								// 					type: 'warning',
								// 					message: '阅读题下的选择题未填写完整'
								// 				})
								// 			}
								// 			break
								// 		}
								// 		case 2: {
								// 			hasComplete = !smallTopic.options.some(item => item.rightFlag === 1 && item.sentence === '')
								// 					console.log(hasComplete, '阅读题下的填空题')
								// 			if (!hasComplete) {
								// 				this.$notify({
								// 					type: 'warning',
								// 					message: '阅读题下的填空题未填写完整'
								// 				})
								// 			}
								// 			break
								// 		}
								// 	}
								// }
							})
						})
					}
				}
			})
			this.subjectData = subjectData
			if (operation === 'preview') {
				this.isShowPreview = true
			} else {
				this.publishHomework()
			}
		},
		checkPublishData() {
			// this.subjectData
		},
		// produceSubjectData(subjectData, operation) {
		// 	subjectData.forEach(item => {
		// 		item.name = item.name || this.typeToName[item.type]
		// 		item.remark = item.remark || this.typeToRemark[item.type]
		// 		if (item.homework_question.length === 0) {
		// 			for (let i = 0; i < item.quality; i++) {
		// 				item.type = Number(item.type)
		// 				item.homework_question.push(JSON.parse(JSON.stringify(this.generateSubjectData(item))))
		// 			}
		// 		} else {
		// 			item.homework_question.forEach(homework => {
		// 				if (homework.type !== 5) {
		// 					homework = Object.assign(homework, homework.content)
		// 				}
		// 			})
		// 		}
		// 	})
		// 	this.subjectData = subjectData
		// 	if (operation === 'preview') {
		// 		this.isShowPreview = true
		// 	} else {
		// 		this.publishHomework()
		// 	}
		// },
		showKnowledge() {
			this.isShowKonwledge = true
		},
		chooseEditionLevel () {},
		search () {},
		getOutline (newVal) {
			this.existOutlineInfo = null
			this.$Api.teacherManagement.getNewOutline({lessonId: newVal})
				.then(res => {
					if (res.status === 200 && res.data.code === 200) {
						this.existOutlineInfo = res.data.data
						this.knowledgeContent = this.existOutlineInfo.draftInspectionContent
						this.hasDraftHomework = this.existOutlineInfo.draftFlag
						this.hasPublishHomework = this.existOutlineInfo.publicFlag
					}
				}
			)
		},
		addOneSubject () {
			if (this.oulineData.length >= 20) {
				this.$notify({
					message: '你的题目好多',
					type: 'error'
				})
			} else {
				this.oulineData.push({
					type: null,
					number: 0
				})
			}
		},
		renderAllSubject () {
			let hasMoreSubject = false
			let outlineData = JSON.parse(JSON.stringify(this.oulineData))
			outlineData = outlineData.filter(item => item.number > 0)
			for (let i = 0; i < outlineData.length; i++) {
				if (outlineData[i].number > 0) {
					if (outlineData[i].number > 20) {
						this.$notify({
							message: '您的题目过多，无法生成',
							type: 'error'
						})
						hasMoreSubject = true
						break
					}
				}
			}
			if (!hasMoreSubject) {
				if (outlineData.length === 0) {
					this.$notify({
						message: '大纲中没有题目',
						type: 'error'
					})
					this.showNewOutline = false
				} else {
					if (this.hasPublishHomework) {
						this.$confirm('课程中已经有作业了，如果新建之后上传会覆盖原来的作业，是否确定新建？', '', {
							confirmButtonText: '生成',
							cancelButtonText: '暂不新建',
							type: 'warning'
						}).then(() => {
							this.newOutline(outlineData)
						}).catch(() => {
							this.showNewOutline = false
							this.resetOutline()
						})
					} else {
						this.newOutline(outlineData)
					}
				}
			}
		},
		newOutline(outlineData) {
			if (this.hasCreateOutline) return
			this.hasCreateOutline = true

			let outline = {}
			outline.lessonId = this.lessonId
			outline.outlineId = this.existOutlineInfo.draftOutlineId || null
			outline.types = []
			outline.qualitys = []
			outlineData.forEach(item => {
				outline.types.push(Number(item.type))
				outline.qualitys.push(Number(item.number))
			})
			this.$Api.teacherManagement.newOutline(outline)
			.then(res => {
				if (res.status === 200 && res.data.code === 200) {
					this.$set(this.existOutlineInfo, 'status', 0)
					this.gotoMakeHomeworkPage()
				}
				this.hasCreateOutline = false
			})
			.catch(e => {
				this.hasCreateOutline = false
			})
		},
		gotoMakeHomeworkPage() {
			this.showNewOutline = false
			let oulineInfo = {
				existOutlineInfo: this.existOutlineInfo
			}
			window.sessionStorage.setItem('outline', JSON.stringify(oulineInfo))
			this.$router.push({
				path: '/teacherManagement/makeHomework',
				query: {
					lessonId: this.lessonId,
					status: 0,
					outlineId: this.existOutlineInfo.draftOutlineId
				}}
			)
		},
		resetOutline() {
			this.oulineData = [
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
				{
					type: 1,
					number: 0
				},
			]
		},
		chooseSubjectType(outlineIndex) {
			this.oulineData[outlineIndex].number = 1
		},
		submitKnowledge() {
			if (!this.knowledgeContent) {
				this.$notify({
					type: 'warning',
					message: '请输入考查知识点'
				})
				return
			}
			if (this.loading) return
			this.loading = true
			this.$Api.teacherManagement.setNewKnowledge({
				inspectionContent: this.knowledgeContent||'',
				outlineId: this.existOutlineInfo.draftOutlineId})
			.then(res => {
				if (res.status === 200 && res.data.code === 200) {
					this.$set(this.existOutlineInfo, 'draftInspectionContent', this.knowledgeContent)
				} else {
					this.$notify({
						message: '保存失败',
						type: 'success'
					})
				}
				this.loading = false
				this.isShowKonwledge = false
			})
		}
	},
	components: {
		PreviewDialog
	}
}
</script>

<style>
.new-outline .el-dialog .new-outline-body{
	max-height: 400px;
	overflow: scroll;
}
.new-outline .el-dialog__body {
	padding: 0;
	padding-bottom: 20px;
}
.el-cascader {
	width: 240px;
}
</style>

<style lang="scss" scoped>
.homework-bank {
	padding-left: 15px;
	.publish-icon {
		width: 100px;
		margin-left: 20px;
	}
	.head {
		line-height: 44px;
		color: #99a9bf;
		font-size: 14px;
	}
	.choose-edition {
		height: 52px;
		line-height: 52px;
		display: flex;
		align-items: center;
	}
	.label {
		line-height: 32px;
    text-align: right;
    font-size: 12px;
		color: #666;
	}
}
.operation-buttons {
	margin-top: 20px;
}
.new-outline {
	text-align: center;
	.sub-title {
		margin-bottom: 10px;
	}
	.new-outline-body {
		text-align: left;
		padding-left: 20px;
		.oulines {
			display: flex;
			text-align: left;
			margin-bottom: 10px;
			align-items: center;
			.el-input.el-input--small {
				width: auto;
			}
			.subject-number {
				margin-left: 20px;
				margin-right: 10px;
			}
			>span {
				font-size: 12px;
				color: #666;
			}
		}
		.sureto-make-subject {
			margin-top: 10px;
			text-align: center;
		}
	}
}

.set-knowledge {
	.sureto-make-subject {
		text-align: center;
	}
}
</style>

