<template>
	<div class="make-homework">
		<div class="coperation-btns flex-wrapper" :style="{left: fixedBtnLeft}">
			<div class="coperation-btns-content flex1">
				<el-button type="primary" :loading="saveBeforeAdjustloading" @click="adjustSort">调整</el-button>
				<el-button type="primary" @click="showPreview">预览</el-button>
				<!-- <el-button type="primary" @click="uploadSubject(1)">上传</el-button> -->
				<el-button :loading="saveLoading && !saveBeforeAdjustloading" type="primary" @click="uploadSubject(0)">保存</el-button>
				<div class="bb20"></div>
			</div>
			<div class="fill-empty" :style="{width: fillWidth}"></div>
		</div>
		<!-- <div class="make-homework-body"> -->
			<div class="make-content" v-if="subjectData!==null">
				<div v-for="(subjectItem, subjectIndex) in subjectData" :key="subjectIndex">
					<!-- 每个大题的题目头 start -->
					<div class="header flex-wrapper mb30 sbn" v-if="!subjectItem.hidden">
						<div class="content flex1">
							<span class="name" v-html="subjectItem.name || typeToName[subjectItem.type]"></span>
							<span class="ml10 mr10">|</span>
							<span class="description" v-html="subjectItem.remark||typeToRemark[subjectItem.type]"></span>
						</div>
						<div class="operation">
							<el-button size="mini" @click="setFontFamily(subjectItem, subjectIndex)" type="primary">字体设置</el-button>
							<el-button size="mini" @click="edit(subjectItem, subjectIndex)" type="primary">编辑</el-button>
							<el-button size="mini" :loading="deleteSubjectLoading && deleteSubjectIndex === subjectIndex" @click="deleteSubject(subjectItem, subjectIndex)" type="primary">删除大题</el-button>
						</div>
					</div>
					<!-- 每个大题的题目头 end -->
					<ChoiceQuestion
						v-if="subjectItem.type===1"
						@deleteOneTopic="deleteOneTopic"
						@changeChoiceImageData="changeChoiceImageData"
						@deleteStemImage="deleteChoiceStemImage"
						@deleteChoiceOptions="deleteChoiceOptions"
						@addOptions="addOptions"
						@showKnowledge="showKnowledge"
						:choiceData="subjectItem"
						:subjectIndex="subjectIndex"
						class="ml20"
					></ChoiceQuestion>
					<FillBlankQuestion
						v-if="subjectItem.type===2"
						@deleteOneTopic="deleteOneTopic"
						@addOneGroup="addOneGroup"
						@showKnowledge="showKnowledge"
						@deleteOneGroupFillBlank="deleteOneGroupFillBlank"
						:fillBlankData="subjectItem"
						:subjectIndex="subjectIndex"
						class="ml20"
					></FillBlankQuestion>
					<ConnectionQuestion
						v-if="subjectItem.type===3"
						@deleteOneTopic="deleteOneTopic"
						@changeConnectionImage="changeConnectionImage"
						@deleteConnectionImage="deleteConnectionImage"
						@deleteOneGroupConnection="deleteOneGroupConnection"
						@showKnowledge="showKnowledge"
						:subjectIndex="subjectIndex"
						:connectionData="subjectItem"
						class="ml20"
					></ConnectionQuestion>
					<SortQuestion
						v-if="subjectItem.type===4"
						@deleteOtherOption="deleteOtherOption"
						@addSort="addSort"
						@deleteOneTopic="deleteOneTopic"
						@showKnowledge="showKnowledge"
						:sortData="subjectItem"
						:subjectIndex="subjectIndex"
						class="ml20"
					></SortQuestion>
					<ReadQuestion
						v-if="subjectItem.type===5"
						@deleteOneTopic="deleteOneTopic"
						@changeSubjectInfo="changeReadSubjectInfo"
						@changeReadSubjectNumber="changeReadSubjectNumber"
						@deleteOneSmallTopic="deleteOneSmallTopic"
						@deleteChoiceOptions="deleteReadChoiceOptions"
						@addReadChoiceOptions="addReadChoiceOptions"
						@addReadFillBlankOneGroup="addReadFillBlankOneGroup"
						@changeReadChoiceImage="changeReadChoiceImage"
						@deleteReadChoiceImage="deleteReadChoiceImage"
						@changeHtmlText="changeHtmlText"
						@showKnowledge="showKnowledge"
						@deleteReadOneGroupFillBlank="deleteReadOneGroupFillBlank"
						:readData="subjectItem"
						:subjectIndex="subjectIndex"
						class="ml20"
					></ReadQuestion>
					<OtherQuestion
						v-if="subjectItem.type===6"
						@changeOtherFileInfo="changeOtherFileInfo"
						@deleteFile="deleteFile"
						:otherData="subjectItem"
						:subjectIndex="subjectIndex"
					></OtherQuestion>
				</div>
			</div>
			<el-dialog title="修改大题信息" :center="true" :visible.sync="isShowEdit">
				<div class="edit-subject-info" v-if="editDialogInfo">
					<div class="type-choice flex-wrapper mb20">
						<span>类型选择：</span><el-input class="w500" placeholder="点击输入" v-model="editDialogInfo.name"></el-input>
					</div>
					<div class="type-description flex-wrapper mb20">
						<span>类型描述：</span><el-input class="w500" placeholder="点击输入" v-model="editDialogInfo.remark"></el-input>
					</div>
					<div class="item-number flex-wrapper mb20" v-if="editDialogInfo.type!==5&&editDialogInfo.type!==6">
						<span>题目数量：</span><el-input-number v-model="editDialogInfo.quality" :min="1" :max="20" label=""></el-input-number>
					</div>
					<div class="item-number flex-wrapper mb20" v-else>
						<span>题目数量：</span><el-input-number disabled v-model="editDialogInfo.quality" :min="1" :max="20" label=""></el-input-number>
					</div>
					<el-button type="primary" @click="changeSubjectInfo">确认修改</el-button>
				</div>
			</el-dialog>
			<el-dialog title="知识点设置" :center="true" :visible.sync="isShowKnowledge" width="800px">
				<div class="knowledge-subject-info" v-if="knowledgeDialogInfo">
					<div class="type-choice flex-wrapper mb20">
						<div class="title">题目类型：</div><span>{{typeToName[knowledgeDialogType]}}</span>
					</div>
					<div class="type-choice flex-wrapper mb20">
						<div class="flex-wrapper knowledge_content mr20 w200">
							<!-- {{knowledgeDialogInfo.knowledge_point_id}} -->
							<div class="title">考查内容：</div>
							<el-select class="flex1" v-model="knowledgeDialogInfo.knowledge_point_id" placeholder="请选择">
								<el-option
									v-for="item in knowledge_points"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</div>
						<div class="flex-wrapper knowledge_content flex1">
							<div class="title">类型描述：</div><el-input class="flex1" placeholder="点击输入" v-model="knowledgeDialogInfo.knowledge_point_remark"></el-input>
						</div>
					</div>
					<div class="item-number mb20 pt20">
						<el-input
							type="textarea"
							:rows="2"
							placeholder="请输入考查内容"
							v-model="knowledgeDialogInfo.knowledge_point_remark_content">
						</el-input>
					</div>
					<el-button type="primary" @click="setKnowledge">确认修改</el-button>
				</div>
			</el-dialog>
			<el-dialog title="题目调整" @close="closeAdjustDialog" :close-on-click-modal="false" :center="true" :visible.sync="isShowAdjust" width="800px" class="adjust-dialog">
				<div class="subject flex-wrapper sbn mb10" v-for="(subjectItem, subjectIndex) in subjectData" :key="subjectIndex">
					<template v-if="subjectItem.id">
						<div class="description">
							<span class="mr20">{{typeToName[subjectItem.type]}}</span>
							<span>{{subjectItem.quality}}道</span>
						</div>
						<div class="operation-btns">
							<el-button size="mini" @click="moveUpSubject(subjectIndex)">上移</el-button>
							<el-button size="mini" @click="moveDownSubject(subjectIndex)">下移</el-button>
							<el-button size="mini" v-if="subjectData.length<20" @click="addSubject(subjectIndex)">添加</el-button>
							<el-button size="mini" @click="deleteOutlineSubject(subjectItem, subjectIndex)">删除</el-button>
						</div>
					</template>
					<template v-else>
						<div class="description flex-wrapper">
							<el-select @change="checkoutIfReadSubject(subjectItem)" v-model="subjectItem.type" placeholder="请选择题型" style="width: 100px" class="mr10">
								<el-option
									v-for="item in typeToNameLabel"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
							<el-input placeholder="点击输入" v-if="subjectItem.type!=='5'&&subjectItem.type!=='6'" type="number" min="0" max="20" v-model="subjectItem.quality" style="width: 100px"></el-input>
							<el-input placeholder="点击输入" v-else type="number" min="0" max="20" value="1" style="width: 100px" disabled=""></el-input>
						</div>
						<div class="operation-btns">
							<el-button size="mini" @click="moveUpSubject(subjectIndex)">上移</el-button>
							<el-button size="mini" @click="moveDownSubject(subjectIndex)">下移</el-button>
							<el-button size="mini" v-if="subjectData.length<20" @click="addSubject(subjectIndex)">添加</el-button>
							<el-button size="mini" @click="deleteOutlineSubject(subjectItem, subjectIndex)">删除</el-button>
						</div>
					</template>
				</div>
				<div class="sure-to-change">
					<el-button type="primary" :loading="adjustLoading" @click="changeOutline">确认修改</el-button>
				</div>
			</el-dialog>
			<el-dialog title="字体设置" :visible.sync="fontFamilyDialog" width="80%" class="font-family-dialog" :close-on-click-modal="false">
				<div id="editor-name" class="mb20"></div>
				<div id="editor-remark"></div>
				<div class="center pt20">
					<el-button type="primary" @click="closeFontFamilyDialog">确认修改</el-button>
				</div>
			</el-dialog>
			<PreviewDialog :isShowPreview="isShowPreview" :subjectData="subjectData" @closePreviewDialog="isShowPreview=false"></PreviewDialog>
		<!-- </div> -->
	</div>
</template>

<script>
import ChoiceQuestion from './components/choiceQuestion'
import FillBlankQuestion from './components/fillBlankQuestion'
import ConnectionQuestion from './components/connectionQuestion'
import SortQuestion from './components/sortQuestion'
import ReadQuestion from './components/readQuestion'
import OtherQuestion from './components/otherQuestion'
import PreviewDialog from './components/previewDialog'
import { Loading } from 'element-ui'
import { mapGetters } from 'vuex'
import wangeditor from 'wangeditor'
import { replacePStyleLastBr, replaceFontFace, replaceSpanClass } from '@/utils/handleData'
export default {
	name: 'makeHomework',
	data() {
		return {
			saveBeforeAdjustloading: false,
			adjustLoading: false,
			saveLoading: false,
			deleteSubjectLoading: false,
			deleteSubjectIndex: null,
			subjectData: null,
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
			addSubjectItem: {
				type: "1",
				quality: 1,
				questionExtendResultList: [],
				hidden: 1
			},
			allSubjectType: [
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
			isShowEdit: false,
			editDialogInfo: null,
			editDialogIndex: null,
			typeToName: {
				1: '选择题',
				2: '填空题',
				3: '连线题',
				4: '排序题',
				5: '阅读题',
				6: '其他'
			},
			typeToNameLabel: [
				{
					value: "1",
					label: '选择题'
				},
				{
					value: "2",
					label: '填空题'
				},
				{
					value: "3",
					label: '连线题'
				},
				{
					value: "4",
					label: '排序题'
				},
				{
					value: "5",
					label: '阅读题'
				},
				{
					value: "6",
					label: '其他'
				}
			],
			typeToRemark: {
				1: '请选择正确的选项',
				2: '请在下划线处填上正确的答案',
				3: '点击汉字，选择它的拼音',
				4: '按照顺序点击下列内容',
				5: '阅读短文回答问题',
				6: '请完成之后拍照上传'
			},
			typeToSubject: {},
			isShowKnowledge: false,
			knowledgeTopicSubjectIndex: null,
			knowledgeTopicIndex: null,
			knowledgeDialogInfo: null,
			knowledgeDialogType: null,
			knowledge_points: [
			],
			isShowAdjust: false,
			isShowPreview: false,
			previewData: null,
			hasCreatNewOutline: false,
			delOutlineGroupIds: [],
			del_outline_group_indexs: [],
			outlineId: null,
			delGroupIdList: [],
			delQuestionIdList: [],
			fontFamilyDialog: false,
			fontFamilyEditorArr: [],
		}
	},
	computed: {
		fixedBtnLeft() {
			return this.opened?'195px':'75px'
		},
		fillWidth() {
			return this.opened?'200px':'80px'
		},
		...mapGetters([
			'opened'
		])
	},
	watch: {
		subjectData: {
			handler() {
				// console.log(this.delGroupIdList)
				// console.log(this.delQuestionIdList)
			},
			deep: true
		}
	},
	mounted() {
		this.getKnowledgePoints()

		this.getSubject()

		this.typeToSubject = {
			1: this.choiceData,
			2: this.fillBlankData,
			3: this.connectionData,
			4: this.sortData,
			5: this.readData,
			6: null
		}
	},
	methods: {
		changeFontFamily() {

		},
		closeFontFamilyDialog() {
			this.fontFamilyEditorArr.forEach((item, index) => {
				if (index === 0) {
					this.editDialogInfo.name = replaceFontFace(replacePStyleLastBr(item.txt.html(), false))
				} else {
					this.editDialogInfo.remark = replaceFontFace(replacePStyleLastBr(item.txt.html(), false))
				}
				item.destroy()
			})
 			this.fontFamilyEditorArr.length = 0
			this.fontFamilyDialog = false
			this.changeSubjectInfo()
		},
		setFontFamily(subjectItem, subjectIndex) {
			this.editDialogIndex = subjectIndex
			this.editDialogInfo = JSON.parse(JSON.stringify(subjectItem))
			let name = subjectItem.name, remark = subjectItem.remark
			this.fontFamilyDialog = true
			this.$nextTick(() => {
				let nameEditor = new wangeditor("#editor-name")
				nameEditor.config.menus = [
					'fontName'
				]
				nameEditor.config.showFullScreen = false
				nameEditor.config.fontNames = ['fzkt', 'fzktpy01', 'fzktpy02', 'fzktpy03', 'fzktpy04', 'fzktpy05', 'fzktpy06', 'simhei']
				nameEditor.config.height = 50
				// nameEditor.config.zIndex = 100001
				nameEditor.config.focus = false
				nameEditor.create()
				nameEditor.txt.html(replaceSpanClass(name))
				this.fontFamilyEditorArr.push(nameEditor)

				let remarkEditor = new wangeditor("#editor-remark")
				remarkEditor.config.menus = [
					'fontName'
				]
				remarkEditor.config.showFullScreen = false
				remarkEditor.config.fontNames = ['fzkt', 'fzktpy01', 'fzktpy02', 'fzktpy03', 'fzktpy04', 'fzktpy05', 'fzktpy06', 'simhei']
				remarkEditor.config.height = 50
				remarkEditor.config.zIndex = 9999
				remarkEditor.config.focus = false
				remarkEditor.create()
				remarkEditor.txt.html(replaceSpanClass(remark))
				this.fontFamilyEditorArr.push(remarkEditor)
			})
		},
		showPreview() {
			this.isShowPreview = true
		},
		getKnowledgePoints() {
			this.$Api.teacherManagement.getKnowledgePoint()
			.then(res => {
				if (res.status === 200 && res.data.code === 200) {
					let points = []
					Object.keys(res.data.data).forEach(index => {
						points.push({
							label: res.data.data[index],
							value: Number(index)
						})
					})
					this.knowledge_points = points
				}
			})
		},
		checkoutIfReadSubject(item) {
			if (item.type === "5") {
				item.quality = 1
			}
		},
		closeAdjustDialog() {
			this.subjectData.forEach((subjectItem, subjectIndex) => {
				if (!subjectItem.id) {
					this.subjectData.splice(subjectIndex, 1)
				}
			})
			if (this.delOutlineGroupIds.length > 0) {
				this.delOutlineGroupIds.forEach((item, index) => {
					this.subjectData.splice(item, 0, this.del_outline_group_indexs[index])
				})
				this.delOutlineGroupIds.length = 0
				this.del_outline_group_indexs.length = 0
			}
		},
		changeOutline() {
			if (this.hasCreatNewOutline) return
			let toBeSavedOutline = {
				lessonId: this.$route.query.lessonId,
				outlineGroupIds: [],
				outlineId: this.outlineId,
				qualitys: [],
				types: [],
				delOutlineGroupIds: this.delOutlineGroupIds
			}

			this.subjectData.forEach((subjectItem, subjectIndex) => {
				if (subjectItem.id) {
					toBeSavedOutline.outlineGroupIds.push(String(subjectItem.id))
				} else {
					toBeSavedOutline.outlineGroupIds.push('add')
				}
				toBeSavedOutline.qualitys.push(subjectItem.quality>20?20:Number(subjectItem.quality))
				toBeSavedOutline.types.push(Number(subjectItem.type))
			})


			this.hasCreatNewOutline = true

			this.adjustLoading = true
			this.$Api.teacherManagement.adjustOutline(toBeSavedOutline)
			.then((res) => {
				if (res.status === 200) {
					if (res.data.code === 200) {
						this.isShowAdjust = false
						this.getSubject()
					}
				}
				this.hasCreatNewOutline = false
				this.adjustLoading = false
			})
			.catch( e => {
				this.hasCreatNewOutline = false
			})
		},
		moveUpSubject(subjectIndex) {
			if (subjectIndex !== 0) {
				this.subjectData.splice(subjectIndex-1, 0, this.subjectData.splice(subjectIndex, 1)[0]);
			}
		},
		moveDownSubject(subjectIndex) {
			if (subjectIndex !== this.subjectData.length-1) {
				this.subjectData.splice(subjectIndex+1, 0, this.subjectData.splice(subjectIndex, 1)[0]);
			}
		},
		addSubject(subjectIndex) {
			this.subjectData.splice(subjectIndex+1, 0, JSON.parse(JSON.stringify(this.addSubjectItem)))
		},
		showKnowledge(knowledgeDialogInfo) {
			this.isShowKnowledge = true
			this.knowledgeTopicSubjectIndex = knowledgeDialogInfo.subjectIndex
			this.knowledgeTopicIndex = knowledgeDialogInfo.topicIndex
			this.knowledgeDialogInfo = knowledgeDialogInfo.knowledge_point
			this.knowledgeDialogType = knowledgeDialogInfo.questionType
		},
		setKnowledge() {
			this.subjectData[this.knowledgeTopicSubjectIndex]['questionExtendResultList'][this.knowledgeTopicIndex]['knowledgePointId'] = this.knowledgeDialogInfo.knowledge_point_id
			this.subjectData[this.knowledgeTopicSubjectIndex]['questionExtendResultList'][this.knowledgeTopicIndex]['remark'] = this.knowledgeDialogInfo.knowledge_point_remark
			this.subjectData[this.knowledgeTopicSubjectIndex]['questionExtendResultList'][this.knowledgeTopicIndex]['remarkContent'] = this.knowledgeDialogInfo.knowledge_point_remark_content
			this.isShowKnowledge = false
		},
		getSubject() {
			this.outlineId = this.$route.query.outlineId
			this.$Api.teacherManagement.queryHomeworkInfo({lessonId: this.$route.query.lessonId, status: this.$route.query.status})
				.then(res => {
					if (res.status === 200 && res.data.code === 200) {
						let subjectData = res.data.data
						this.delQuestionIdList = []
						this.delGroupIdList = []
						if (subjectData.length > 0) {
							this.outlineId = subjectData[0].outlineId
						}
						this.produceSubjectData(subjectData)
					}
				}
			)
		},
		produceSubjectData(subjectData) {
			subjectData.forEach(item => {
				item.name = item.name || this.typeToName[item.type]
				item.remark = item.remark || this.typeToRemark[item.type]
				if (item.questionExtendResultList.length === 0) {
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
				} else {
					if (item.type !== 5) {
						item.questionExtendResultList.forEach(homework => {
							// homework.content = homework.content.replace(/'/g, '"')
							homework = Object.assign(homework, homework.contentJson)
						})
					} else if (item.outlineResultList !== null) {
						item.outlineResultList.forEach(typeSubject => {
							typeSubject.questionExtendResultList.forEach(smallTopic => {
								// smallTopic.content = smallTopic.content.replace(/'/g, '"')
								smallTopic = Object.assign(smallTopic, smallTopic.contentJson)
							})
						})
					}
				}
			})
			// console.log(subjectData, 1111111)
			this.subjectData = subjectData
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
		edit(editDialogInfo, editDialogIndex) {
			this.isShowEdit = !this.isShowEdit
			this.editDialogInfo = JSON.parse(JSON.stringify(editDialogInfo))
			this.editDialogIndex = editDialogIndex
		},
		changeSubjectInfo() {
			let originData = this.subjectData[this.editDialogIndex]
			if (this.editDialogInfo.name !== originData.name || this.editDialogInfo.remark !== originData.remark) {
				this.$Api.teacherManagement.changeSubjectInfo({
					subjectId: this.editDialogInfo.id,
					subjectInfo: {
						name: this.editDialogInfo.name,
						remark: this.editDialogInfo.remark
					}
				}).then(res => {
					if (res.status === 200) {
						originData.name = res.data.data.name
						originData.remark = res.data.data.remark
					}
				})
			}
			if (this.editDialogInfo.quality > 20) {
				this.editDialogInfo.quality = 20
			}
			if (this.editDialogInfo.quality != originData.quality) {
				if (this.editDialogInfo.quality > originData.quality) {
					for (let i = originData.quality; i < this.editDialogInfo.quality; i++) {
						originData.questionExtendResultList.push(JSON.parse(JSON.stringify(this.typeToSubject[this.editDialogInfo.type])))
					}
				} else {
					for (let i = originData.quality; i > this.editDialogInfo.quality; i--) {
						originData.questionExtendResultList.pop()
					}
				}
				originData.quality = Number(this.editDialogInfo.quality)
			}
			this.isShowEdit = false
		},
		deleteSubject(subjectItem, subjectItemIndex) {
			if (this.subjectData.length === 1) {
				this.$notify({
					type: 'warning',
					message: '不能删除全部题目'
				})
				return
			}
			if (subjectItem.id) {
				this.delGroupIdList.push(subjectItem.id)
			}
			this.subjectData.splice(subjectItemIndex, 1)
		},
		deleteOutlineSubject(subjectItem, subjectItemIndex) {
			if (this.subjectData.length === 1) {
				this.$notify({
					type: 'warning',
					message: '不能删除全部题目'
				})
				return
			}
			let delSubjectItem = this.subjectData.splice(subjectItemIndex, 1)[0]
			if (delSubjectItem.id) {
				this.delOutlineGroupIds.push(delSubjectItem.id?delSubjectItem.id:'del')
				this.del_outline_group_indexs.push(subjectItemIndex)
			}
		},
		// 删除小题
		deleteOneTopic({subjectIndex, topicIndex, callback}) {
			if (this.subjectData.length === 1 && this.subjectData[0].questionExtendResultList.length === 1) {
				this.$notify({
					type: 'warning',
					message: '不能删除全部题目'
				})
				callback()
				return
			}
			let topic = this.subjectData[subjectIndex].questionExtendResultList[topicIndex]
			if (topic.id) {
				this.deleteOneTopicFromServer(topic.id, subjectIndex, topicIndex, callback)
			} else {
				this.subjectData[subjectIndex].questionExtendResultList.splice(topicIndex, 1)
				this.subjectData[subjectIndex].quality--
				if (this.subjectData[subjectIndex].questionExtendResultList.length === 0) {
					if (this.subjectData[subjectIndex].id) {
						this.delGroupIdList.push(this.subjectData[subjectIndex].id)
					}
					this.subjectData.splice(subjectIndex, 1)
				}
			}
		},
		deleteOneTopicFromServer(topicId, subjectIndex, topicIndex, callback) {
			this.delQuestionIdList.push(topicId)
			// this.$Api.teacherManagement.deleteTopic(topicId)
			// .then(res => {
			// 	if (res.status === 200 || res.data.code === 200) {
					this.subjectData[subjectIndex].questionExtendResultList.splice(topicIndex, 1)
					this.subjectData[subjectIndex].quality--
					if (this.subjectData[subjectIndex].questionExtendResultList.length === 0) {
						this.subjectData.splice(subjectIndex, 1)
					}
					if (callback) callback()
			// 	}
			// })
		},
		changeChoiceImageData({imageUrl, subjectIndex, topicIndex, topicKey, optionIndex}) {
			if (topicKey === 'answerImage') {
				this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex].options[optionIndex].answerImage = imageUrl
			} else {
				this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex].questionImage = imageUrl
			}
		},
		deleteChoiceStemImage({subjectIndex, topicIndex, topicKey, optionsIndex}) {
			if (topicKey === 'answerImage') {
				this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex].options[optionsIndex].answerImage = ""
			} else {
				this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex].questionImage = ""
			}
		},
		deleteChoiceOptions({subjectIndex, topicIndex, optionsIndex}) {
			this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex]['options'].splice(optionsIndex, 1)
		},
		addOptions({subjectIndex, topicIndex}) {
			this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex]['options'].push(JSON.parse(JSON.stringify(this.choiceOtherOption)))
		},
		// 填空
		addOneGroup({subjectIndex, topicIndex}) {
			let newOptions = this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex]['options'].concat(JSON.parse(JSON.stringify(this.fillBlankOptions)))
			this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex]['options'] = newOptions
		},
		deleteOneGroupFillBlank({subjectIndex, topicIndex, index}) {
			for (let i = 0; i < 3; i++) {
				this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex]['options'].splice((index-1)*3, 1)
			}
		},
		// 连线
		changeConnectionImage({imageUrl, subjectIndex, topicIndex, optionsIndex, optionKey}) {
			this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex]['options'][optionsIndex][optionKey] = imageUrl
		},
		deleteConnectionImage({subjectIndex, topicIndex, optionsIndex, optionKey}) {
			this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex]['options'][optionsIndex][optionKey] = ""
		},
		deleteOneGroupConnection({subjectIndex, topicIndex, optionsIndex}) {
			this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex]['options'].splice(optionsIndex, 1)
		},
		deleteOtherOption({subjectIndex, topicIndex, optionsIndex}) {
			this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex]['options'].splice(optionsIndex, 1)
		},
		addSort({subjectIndex, topicIndex}) {
			this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex]['options'].push(JSON.parse(JSON.stringify(this.sortOptions)))
		},
		changeReadSubjectInfo({subjectIndex, typeIndex, editDialogInfo}) {
			this.subjectData[subjectIndex]['outlineResultList'][typeIndex]['name'] = editDialogInfo.name
			this.subjectData[subjectIndex]['outlineResultList'][typeIndex]['remark'] = editDialogInfo.remark
		},
		changeReadSubjectNumber({subjectIndex, topicIndex, typeIndex, quality}) {
			// 改逻辑后topicIndex没用了
			let thisSmallSubject = this.subjectData[subjectIndex]['outlineResultList'][typeIndex]
			if (thisSmallSubject.quality > quality) {
				for (let i = thisSmallSubject.quality; i > quality; i--) {
					thisSmallSubject['questionExtendResultList'].pop()
				}
			} else {
				for (let i = thisSmallSubject.quality ; i < quality; i++) {
					thisSmallSubject['questionExtendResultList'].push(JSON.parse(JSON.stringify(thisSmallSubject.type===1?this.choiceData:this.fillBlankData)))
				}
			}
			thisSmallSubject['quality'] = quality
		},
		deleteOneSmallTopic({subjectIndex, topicIndex, typeTopicIndex, callback}) {
			if (this.subjectData.length === 1 && this.subjectData[0].outlineResultList.length === 1 && this.subjectData[0].outlineResultList[0].questionExtendResultList.length === 1) {
				this.$notify({
					type: 'warning',
					message: '不能删除全部题目'
				})
				callback()
				return
			}
			let smallSubject = this.subjectData[subjectIndex]['outlineResultList'][topicIndex]
			if (smallSubject['questionExtendResultList'][typeTopicIndex].id) {
				this.delQuestionIdList.push(smallSubject['questionExtendResultList'][typeTopicIndex].id)
				this.changeReadDataAfterDelete(subjectIndex, topicIndex, typeTopicIndex, smallSubject)
				callback()
			} else {
				this.changeReadDataAfterDelete(subjectIndex, topicIndex, typeTopicIndex, smallSubject)
			}
		},
		changeReadDataAfterDelete(subjectIndex, topicIndex, typeTopicIndex, smallSubject) {
			smallSubject['questionExtendResultList'].splice(typeTopicIndex, 1)
			smallSubject['quality']--
			if (smallSubject['quality'] === 0) {
				if (smallSubject.id) {
					this.delGroupIdList.push(smallSubject.id)
				}
				this.subjectData[subjectIndex]['outlineResultList'].splice(topicIndex, 1)
				if (this.subjectData[subjectIndex]['outlineResultList'].length === 0) {
					if (this.subjectData[subjectIndex].id) {
						this.delGroupIdList.push(this.subjectData[subjectIndex].id)
					}
					this.subjectData.splice(subjectIndex, 1)
				}
			}
		},
		deleteReadChoiceOptions({subjectIndex, typeIndex, typeTopicIndex, optionsIndex}) {
			this.subjectData[subjectIndex]['outlineResultList'][typeIndex]['questionExtendResultList'][typeTopicIndex]['options'].splice(optionsIndex, 1)
		},
		addReadChoiceOptions({subjectIndex, typeIndex, typeTopicIndex}) {
			this.subjectData[subjectIndex]['outlineResultList'][typeIndex]['questionExtendResultList'][typeTopicIndex]['options'].push(JSON.parse(JSON.stringify(this.choiceOtherOption)))
		},
		addReadFillBlankOneGroup({subjectIndex, typeIndex, typeTopicIndex}) {
			this.subjectData[subjectIndex]['outlineResultList'][typeIndex]['questionExtendResultList'][typeTopicIndex]['options'] = this.subjectData[subjectIndex]['outlineResultList'][typeIndex]['questionExtendResultList'][typeTopicIndex]['options'].concat(JSON.parse(JSON.stringify(this.fillBlankOptions)))
		},
		changeReadChoiceImage({imageUrl, subjectIndex, typeIndex, typeTopicIndex, imageType, optionIndex}) {
			if (imageType==='answerImage') {
				this.subjectData[subjectIndex]['outlineResultList'][typeIndex]['questionExtendResultList'][typeTopicIndex]['options'][optionIndex]['answerImage'] = imageUrl
			} else {
				this.subjectData[subjectIndex]['outlineResultList'][typeIndex]['questionExtendResultList'][typeTopicIndex]['questionImage'] = imageUrl
			}
		},
		deleteReadChoiceImage({subjectIndex, typeIndex, typeTopicIndex, imageType, optionIndex}) {
			if (imageType==='answerImage') {
				this.subjectData[subjectIndex]['outlineResultList'][typeIndex]['questionExtendResultList'][typeTopicIndex]['options'][optionIndex]['answerImage'] = ""
			} else {
				this.subjectData[subjectIndex]['outlineResultList'][typeIndex]['questionExtendResultList'][typeTopicIndex]['questionImage'] = ""
			}
		},
		changeHtmlText({subjectIndex, topicIndex, html}) {
			this.subjectData[subjectIndex]['questionExtendResultList'][topicIndex]['content'] = html
		},
		adjustSort() {
			this.saveBeforeAdjustloading = true
			this.uploadSubject(0, true)
			// this.isShowAdjust = true
		},
		uploadSubject(status, isAdjustOutline) {
			if (this.subjectData.length === 0) {
				this.$notify({
					message: '没有题目哦~',
					type: 'error'
				})
				return
			}
			let data = this.combineSubject()
			if (!data.canUpload) {
				this.$notify({
					type: 'warning',
					message: '排序题输入不能超过四个字'
				})
				return
			}
			data.status = status
			data.delGroupIdList = this.delGroupIdList
			data.delQuestionIdList = this.delQuestionIdList
			// console.log(JSON.stringify(data), '保存题目')
			this.saveLoading = true
			this.$Api.teacherManagement.saveHomework(data)
			.then(res => {
				if (res.status === 200) {
					if (res.data.code === 200) {
						if (isAdjustOutline) {
							this.saveBeforeAdjustloading = false
							this.isShowAdjust = true
						} else {
							this.$notify({
								message: '保存成功',
								type: 'success'
							})
							this.getSubject()
						}
					}
					this.saveLoading = false
				}
			})
		},
		combineSubject() {
			let uploadData = {
				lessonId: this.$route.query.lessonId,
				outlineId: this.outlineId,
				outlineGroupList: [],
				canUpload: true
			}

			this.subjectData.forEach((outlineItem, outlineIndex) => {
				let outlineGroupItem = {
					outlineGroupId: outlineItem.id,
					type: outlineItem.type,
					homework: []
				}
				outlineItem.name = replaceFontFace(outlineItem.name)
				outlineItem.remark = replaceFontFace(outlineItem.remark)

				if (outlineItem.type === 5 && outlineItem.outlineResultList !== null) {
					outlineGroupItem['children'] = []
					outlineItem.outlineResultList.forEach((readTopicItem, readTopicIndex) => {
						let obj = {}
						obj['outlineGroupId'] = readTopicItem.id || null
						obj['type'] = readTopicItem.type
						obj['outlineGroupName'] = replaceFontFace(readTopicItem.name)
						obj['outlineGroupRemark'] = replaceFontFace(readTopicItem.remark)
						obj['homework']	= []
						readTopicItem.questionExtendResultList.forEach((item, index) => {
							if (item.type === 1) {
								item.options.forEach(option => option.answer = replaceFontFace(option.answer))
							} else {
								item.options.forEach(option => option.sentence = replaceFontFace(option.sentence))
							}
							obj['homework'].push({
								id: item.id || null,
								question: replaceFontFace(item.question),
								questionImage: item.questionImage,
								options: item.options
							})
						})
						outlineGroupItem['children'].push(obj)
					})
				}
				outlineItem.questionExtendResultList.forEach((homeworkItem, homeworkIndex) => {
					let topic = {
						id: homeworkItem.id || null,
						knowledgePointId: homeworkItem.knowledgePointId,
						knowledgePointRemark: homeworkItem.remark,
						knowledgePointRemarkContent: homeworkItem.remarkContent,
					}
					switch (homeworkItem.type) {
						case 1: {
							topic["question"] = replaceFontFace(homeworkItem["question"])
							topic["questionImage"] = homeworkItem["questionImage"]
							homeworkItem["options"].forEach(option => option.answer = replaceFontFace(option.answer))
							topic["options"] = homeworkItem["options"]
							break
						}
						case 2: {
							homeworkItem["options"].forEach(option => option.sentence = replaceFontFace(option.sentence))
							topic["options"] = homeworkItem["options"]
							break
						}
						case 3: {
							homeworkItem["options"].forEach(option => {
								option.head = replaceFontFace(option.head)
								option.tail = replaceFontFace(option.tail)
							})
							topic["options"] = homeworkItem["options"]
							break
						}
						case 4: {
							topic["pre"] = replaceFontFace(homeworkItem["pre"])
							topic["post"] = replaceFontFace(homeworkItem["post"])
							homeworkItem["options"].forEach(option => {
								// 排序题排序项不能超过4个字
								if (/<|>/g.test(option.word)) {
									if (option.word.match(/(?<=>)[^<>]+(?=<)/g) !== null && option.word.match(/(?<=>)[^<>]+(?=<)/g).join('').length > 4) {
										uploadData.canUpload = false
									}
								} else {
									if (option.word.length > 4) {
										uploadData.canUpload = false
									}
								}
								option.word = replaceFontFace(option.word)
							})
							topic["options"] = homeworkItem["options"]
							break
						}
						case 5: {
							topic["htmlArticle"] = homeworkItem["content"]
							break
						}
						case 6: {
							topic["fileUrl"] = homeworkItem.fileUrl
							topic["fileType"] = homeworkItem.fileType
							break
						}
					}
					outlineGroupItem.homework.push(topic)
				})
				uploadData.outlineGroupList.push(outlineGroupItem)
			})
			return uploadData
		},
		changeOtherFileInfo({subjectIndex, fileUrl, fileType, id}) {
			this.$set(this.subjectData[subjectIndex]["questionExtendResultList"][0], 'fileUrl', fileUrl)
			this.$set(this.subjectData[subjectIndex]["questionExtendResultList"][0], 'fileType', fileType)
		},
		deleteFile(subjectIndex) {
			this.$set(this.subjectData[subjectIndex]["questionExtendResultList"][0], 'fileUrl', '')
			this.$set(this.subjectData[subjectIndex]["questionExtendResultList"][0], 'fileType', '')
		},
		deleteReadOneGroupFillBlank({subjectIndex, typeIndex, typeTopicIndex, optionsIndex}) {
			for (let i = 0; i < 3; i++) {
				this.subjectData[subjectIndex]['outlineResultList'][typeIndex]['questionExtendResultList'][typeTopicIndex]['options'].splice((optionsIndex-1)*3, 1)
			}
		}
	},
	components: {
		ChoiceQuestion,
		FillBlankQuestion,
		ConnectionQuestion,
		SortQuestion,
		ReadQuestion,
		PreviewDialog,
		OtherQuestion
	}
}
</script>

<style lang="scss" scoped>
.flex1 {
	flex: 1;
}
.sbn {
	justify-content: space-between;
	align-items: center;
}
.make-homework {
	display: flex;
	flex-direction: column;
	padding: 15px;
	.coperation-btns {
		margin-bottom: 20px;
		position: fixed;
		top: 80px;
		width: 100%;
		z-index: 200;
		padding-top: 15px;
		background: #f4f4f4;
		transition: all 0.28s;
		.coperation-btns-content {
			padding-bottom: 10px;
			background: white;
			margin-right: 10px;
			padding-top: 15px;
			padding-left: 10px;
		}
		.bb20 {
			border-top: 1px solid #eee;
			height: 10px;
			margin-top: 10px;
		}
		.fill-empty {
			transition: all 0.28s;
		}
	}
	.make-content {
		flex: 1;
		padding-top: 65px;

		.header {
			height: 60px;
			background: #f3efef;
			padding: 0 10px;
			.content {
				display: flex;
				align-items: center;
				.name {
					color: #34364D;
					// font-size: 26px;
				}
				.description {
					color: #34364D;
					// font-size: 22px;
				}
			}
		}
	}
}
.edit-subject-info {
	text-align: center;
	>div {
		align-items: center;
		span {
			white-space: nowrap;
		}
	}
}
.knowledge-subject-info {
	text-align: center;
	.type-choice {
		align-items: center;
		.title {
			width: 75px;
		}
		.knowledge_content {
			align-items: center;
			.title {
				width: 70px;
				text-align: left;
			}
			.flex1 {
				flex: 1;
				flex-shrink: 0;
			}
		}
	}
	.item-number {
		border-top: 1px solid #f3efef;
		text-align: center;
	}
}
.font-family-dialog {
	.center {
		text-align: center;
	}
}
.adjust-dialog {
	text-align: center;
	.subject {
		height: 30px;
		background: #f3efef;
		padding: 25px 15px;
		border-radius: 5px;
	}
	.sure-to-change {
		text-align: center;
	}
}
.subject-preview {
	.subject-title {
		font-size: 16px;
		color: #303133;
		background: #DCDFE6;
		padding: 5px 6px;
		border-radius: 6px;
		font-weight: 500;
		display: inline-block;
	}
	.choice-subject-preview {
		.choice-option-preview-body {
			display: flex;
			flex-wrap: wrap;
		}
		.choice-option-preview {
			display: inline-block;
			width: 40%;
		}
	}
	.fill-blank-subject-preview {
		padding-top: 10px;
		.fill-blank-item {
			display: inline-block;
		}
		.fill-blank-item-answer {
			// padding: 0 10px;
			border-bottom: 1px solid #8a8484;
			margin: 0 5px;
		}
	}

	.connection-subject-preview {
		.connection-item {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
	}

	.sort-subject-preview {
		.sort-question-title {
			.border-bottom-box {
				width: 100px;
				border-bottom: 1px solid #8a8484;
			}
		}
	}
	.read-subject-preview {
		.choice-option-preview-body {
			display: flex;
			flex-wrap: wrap;
			.choice-option-preview {
				display: inline-block;
				width: 40%;
			}
		}
	}
}
</style>
