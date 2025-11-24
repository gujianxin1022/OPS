<template>
  <div class="read-question" v-if="readData!==null">
    <input type="file" ref="uploadImage" accept="image/*" @change="uploadImage">
    <!-- <div v-for="(readItem, readIndex) in readData.questionExtendResultList" :key="readIndex"> -->
    <div class="standard-box flex-wrapper sbn mb10">
      <div class="content flex-wrapper sbn">
        <div class="title">1.短文：</div>
      </div>
      <div class="operation ml20 flex-wrapper">
        <el-button size="mini" class="ml20" @click="setKnowledge(readData['questionExtendResultList'][0], 0)">知识点设置</el-button>
      </div>
    </div>
    <div :id="'editor'+subjectIndex" class="mb20"></div>
    <el-button size="mini" @click="uploadReadImage()" class="mb20" :disabled="hasImage">上传图片</el-button>
    <!-- 类型题 -->
    <div v-for="(typeTopicItem, typeTopicIndex) in readData['outlineResultList']" :key="typeTopicIndex">
      <!-- {{typeTopicItem.questionExtendResultList}} -->
      <!-- 选择题的题目头 start -->
      <div class="header flex-wrapper mb30 sbn" v-if="typeTopicItem.type===1">
        <div class="content flex1">
          <span class="name" v-html="typeTopicItem['name'] || typeToName[typeTopicItem.type]"></span>
          <span class="description" v-html="typeTopicItem['remark'] || typeToRemark[typeTopicItem.type]"></span>
        </div>
        <div class="operation">
          <el-button class="knowledge" size="mini" @click="setTitleFontFamily(typeTopicItem, typeTopicIndex)">字体设置</el-button>
          <el-button size="mini" @click="edit(typeTopicItem, typeTopicIndex)" type="primary">编辑</el-button>
        </div>
      </div>
      <!-- 选择题的题目头 end -->

      <!-- 选择题 start -->
      <template v-if="typeTopicItem.type===1">
        <!-- 选择题的小题 -->
        <div class="body" v-for="(item, index) in (typeTopicItem.questionExtendResultList)" :key="index+'choice'">
          <div class="standard-box flex-wrapper sbn mb10">
            <div class="content flex-wrapper sbn">
              <div class="title">{{index+1}}.题干：</div>
              <el-input :placeholder="item.questionImage?'请选择符合图片的描述':'点击输入'" v-model.trim="item.question"></el-input>
              <el-button size="mini" @click="triggerUploadImage(typeTopicIndex, index, 'questionImage')" class="ml20">上传图片</el-button>
            </div>
            <div class="operation ml20 flex-wrapper">
              <el-button class="knowledge" size="mini" @click="setFontFamily(item, index)">字体设置</el-button>
              <el-button class="delete-topic" :loading="deleteLoading && deleteLoadingIndex === (index+typeTopicIndex)" size="mini" @click="deleteOneSmallTopic(typeTopicIndex, typeTopicIndex, index, item)" type="primary">删除小题</el-button>
            </div>
          </div>

          <div class="mb10 image-box flex-wrapper aic" v-if="item.questionImage">
            <img class="stem-image mr10" :src="item.questionImage" alt="" srcset="">
            <el-button size="mini" @click="deleteImage(typeTopicIndex, index, 'questionImage')">删除图片</el-button>
          </div>
          <!-- 小题的options -->
          <div class="other-answer" v-for="(oaItem, oaIndex) in item.options" :key="oaIndex">
            <div class="standard-box flex-wrapper" :class="oaIndex===0?'mb30':'mb10'">
              <div class="content flex-wrapper sbn">
                <div class="title">{{oaIndex===0?'正确答案':'其他答案'}}：</div>
                <el-input placeholder="点击输入" v-model.trim="oaItem.answer" v-if="oaIndex===0"></el-input>
                <el-input placeholder="点击输入" v-model.trim="oaItem.answer" v-else></el-input>
                <el-button size="mini" @click="triggerUploadImage(typeTopicIndex, index, 'answerImage', oaIndex)" class="ml20">上传图片</el-button>
              </div>
              <div class="operation ml20">
                <el-button size="mini" v-if="item.options.length>2&&oaIndex>=2" @click="deleteChoiceOptions(typeTopicIndex, index, oaIndex)">删除选项</el-button>
              </div>
            </div>

            <div class="mb10 image-box flex-wrapper aic" v-if="oaItem.answerImage">
              <img class="stem-image mr10" :src="oaItem.answerImage" alt="" srcset="">
              <el-button size="mini" @click="deleteImage(typeTopicIndex, index, 'answerImage', oaIndex)">删除图片</el-button>
            </div>
          </div>

          <div class="other-answer">
            <div class="standard-box flex-wrapper sbn mb20">
              <div class="content flex-wrapper">
                <div class="title"></div>
                <el-button v-if="item.options.length<6" @click="addOptions(typeTopicIndex, index)">添加选项</el-button>
              </div>
              <div class="operation ml20">
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- 选择题 end -->

      <!-- 填空题的题目头 start -->
      <div class="header flex-wrapper mb30 sbn" v-if="typeTopicItem.type===2">
        <div class="content flex1">
          <span class="name" v-html="typeTopicItem['name'] || typeToName[typeTopicItem.type]"></span>
          <span class="description" v-html="typeTopicItem['remark'] || typeToRemark[typeTopicItem.type]"></span>
        </div>
        <div class="operation">
          <el-button class="knowledge" size="mini" @click="setTitleFontFamily(typeTopicItem, typeTopicIndex)">字体设置</el-button>
          <el-button size="mini" @click="edit(typeTopicItem, typeTopicIndex)" type="primary">编辑</el-button>
        </div>
      </div>
      <!-- 填空题的题目头 end -->

      <!-- 填空题 start -->
      <template v-if="typeTopicItem.type===2">
        <div class="body mb20" v-for="(fillBlankItem, fillBlankIndex) in typeTopicItem.questionExtendResultList" :key="fillBlankIndex+'fill'">
          <template v-for="i in fillBlankItem.options.length/3">
            <div class="standard-box flex-wrapper sbn mb10" :key="i+'f'">
              <div class="content flex-wrapper sbn">
                <div class="title">{{i===1?fillBlankIndex+1+'.':null}}前句：</div>
                <el-input class="flex1" placeholder="点击输入" v-model.trim="fillBlankItem.options[3*i-3].sentence"></el-input>
                <div class="fill-display"></div>
              </div>
              <div class="operation ml20 flex-wrapper">
                <el-button class="knowledge" size="mini" @click="setFontFamily(fillBlankItem, fillBlankIndex)">字体设置</el-button>
                <el-button v-if="i===1" class="delete-topic" :loading="deleteLoading && deleteLoadingIndex === (fillBlankIndex+typeTopicIndex)" size="mini" @click="deleteOneSmallTopic(typeTopicIndex, typeTopicIndex, fillBlankIndex, fillBlankItem)" type="primary">删除小题</el-button>
              </div>
            </div>
            <div class="standard-box flex-wrapper sbn mb10" :key="i+'r'">
              <div class="content flex-wrapper sbn">
                <div class="title">正确答案：</div>
                <el-input class="flex1" placeholder="点击输入" v-model.trim="fillBlankItem.options[3*i-2].sentence"></el-input>
                <div class="fill-display"></div>
              </div>
              <div class="operation ml20 flex-wrapper">
              </div>
            </div>
            <div class="standard-box flex-wrapper sbn mb10" :key="i+'b'">
              <div class="content flex-wrapper sbn">
                <div class="title">后句：</div>
                <el-input class="flex1" placeholder="点击输入" v-model.trim="fillBlankItem.options[3*i-1].sentence"></el-input>
                <el-button v-if="i>1" class="delete-topic ml20" size="mini" @click="deleteReadOneGroupFillBlank(typeTopicIndex, fillBlankIndex, i)">删除一组填空</el-button>
                <div v-else class="fill-display"></div>
              </div>
              <div class="operation ml20 flex-wrapper">
              </div>
            </div>
          </template>
          <div class="standard-box flex-wrapper sbn mb10" v-if="fillBlankItem.options.length/3<=5">
            <div class="content flex-wrapper">
              <div class="title"></div>
              <el-button  @click="addOneGroup(typeTopicIndex, fillBlankIndex)">添加</el-button>
            </div>
            <div class="operation ml20 flex-wrapper">
            </div>
          </div>
        </div>
      </template>
      <!-- 填空题 end -->
    </div>
    <!-- </div> -->
    <el-dialog title="修改" :center="true" :visible.sync="isShowEdit">
      <div class="edit-subject-info" v-if="editDialogInfo">
        <div class="type-choice flex-wrapper mb20">
          <span>类型名称：</span><el-input class="w500" placeholder="点击输入" v-model="editDialogInfo.name"></el-input>
        </div>
        <div class="type-description flex-wrapper mb20">
          <span>类型描述：</span><el-input class="w500" placeholder="点击输入" v-model="editDialogInfo.remark"></el-input>
        </div>
        <div class="item-number flex-wrapper mb20">
          <span>题目数量：</span><el-input-number v-model="editDialogInfo.quality" :min="0" label=""></el-input-number>
        </div>
        <el-button type="primary" @click="changeSubjectInfo">确认修改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="上传文件" :center="true" :visible.sync="isShowHiddenImage" width="800px" class="check-image-px" :show-close="false" :close-on-click-modal="false">
      <div v-loading="isShowHiddenImage" class="align-box">
        <img style="max-width: 800px; min-width: 100px" class="hiddenImage" ref="hiddenImage" :src="checkImageUrl" alt="">
      </div>
      <p>图片上传中...</p>
    </el-dialog>
    <setFontFamily :setFontFamilyVisibility="setFontFamilyVisibility" :data="setFontFamilyData" @closeDialog="setFontFamilyVisibility=false"></setFontFamily>
    <el-dialog title="字体设置" :visible.sync="fontFamilyDialog" width="800px" class="font-family-dialog">
      <div id="editor-name-read" class="mb20"></div>
      <div id="editor-remark-read"></div>
      <div style="text-align: center" class="mt20">
        <el-button type="primary" @click="closeFontFamilyDialog">确认修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import wangEditor from 'wangeditor'
import { Loading } from 'element-ui'
import { replacePStyleLastBr, replaceFontFace, replaceSpanClass } from '@/utils/handleData'
import SetFontFamily from './setFontFamily'
export default {
  props: {
    readData: {
      type: Object,
      default: null
    },
    subjectIndex: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      fontFamilyEditorArr: [],
      fontFamilyDialog: false,
      setFontFamilyVisibility: false,
      setFontFamilyData: null,
      isShowEdit: false,
      editDialogInfo: null,
      editDialogInfoIndex: null,
      timer: null,
      isShowHiddenImage: false,
      checkImageUrl: null,
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
      typeIndex: null,
      typeTopicIndex: null,
      imageType: null,
      deleteLoading: false,
      deleteLoadingIndex: null,
      editor: null,
      hasImage: false
    }
  },
  mounted() {
    let that = this
    this.editor = new wangEditor(`#editor${this.subjectIndex}`)
    this.editor.config.menus = ['fontName']
    this.editor.config.fontNames = ['fzkt', 'fzktpy01', 'fzktpy02', 'fzktpy03', 'fzktpy04', 'fzktpy05', 'fzktpy06', 'simhei']
    this.editor.config.onchange = function(html)  {
      if (that.timer) {
        clearTimeout(that.timer)
      }
      that.hasImage = /img/g.test(html)
      that.timer = setTimeout(() => {
        that.$emit('changeHtmlText', {
          subjectIndex: that.subjectIndex,
          topicIndex: 0,
          html: replaceFontFace(replacePStyleLastBr(html, true)),
        })
      }, 2000)
    }
    this.editor.config.showFullScreen = false
    this.editor.config.zIndex = 100
    this.editor.config.focus = false
    this.editor.create()
    if (this.readData.questionExtendResultList[0].content) this.editor.txt.html(replaceSpanClass(this.readData.questionExtendResultList[0].content))
    this.hasImage = /img/g.test(this.readData.questionExtendResultList[0].content)
  },
  methods: {
    uploadReadImage() {
      this.imageType = 'readImage'
      this.$refs.uploadImage.click()
    },
		closeFontFamilyDialog() {
			this.fontFamilyEditorArr.forEach((item, index) => {
				if (index === 0) {
					this.editDialogInfo.name = replacePStyleLastBr(item.txt.html(), false)
				} else {
					this.editDialogInfo.remark = replacePStyleLastBr(item.txt.html(), false)
				}
				item.destroy()
			})
 			this.fontFamilyEditorArr.length = 0
			this.fontFamilyDialog = false
		},
    setFontFamily(item, index) {
      this.setFontFamilyData = item
      this.setFontFamilyVisibility = true
    },
		setTitleFontFamily(subjectItem, subjectIndex) {
			this.editDialogIndex = subjectIndex
			this.editDialogInfo = subjectItem
			let name = subjectItem.name, remark = subjectItem.remark
			this.fontFamilyDialog = true
			this.$nextTick(() => {
				let nameEditor = new wangEditor("#editor-name-read")
				nameEditor.config.menus = [
					'fontName'
				]
				nameEditor.config.showFullScreen = false
				nameEditor.config.fontNames = ['fzkt', 'fzktpy01', 'fzktpy02', 'fzktpy03', 'fzktpy04', 'fzktpy05', 'fzktpy06', 'simhei']
				nameEditor.config.height = 50
				// nameEditor.config.zIndex = 100001
				nameEditor.config.focus = false
				nameEditor.create()
				nameEditor.txt.html(name)
				this.fontFamilyEditorArr.push(nameEditor)

				let remarkEditor = new wangEditor("#editor-remark-read")
				remarkEditor.config.menus = [
					'fontName'
				]
				remarkEditor.config.showFullScreen = false
				remarkEditor.config.fontNames = ['fzkt', 'fzktpy01', 'fzktpy02', 'fzktpy03', 'fzktpy04', 'fzktpy05', 'fzktpy06', 'simhei']
				remarkEditor.config.height = 50
				remarkEditor.config.zIndex = 9999
				remarkEditor.config.focus = false
				remarkEditor.create()
				remarkEditor.txt.html(remark)
				this.fontFamilyEditorArr.push(remarkEditor)
			})
		},
    deleteReadOneGroupFillBlank(typeIndex, typeTopicIndex, optionsIndex) {
      this.$emit('deleteReadOneGroupFillBlank', {
        subjectIndex: this.subjectIndex,
        typeIndex: typeIndex,
        typeTopicIndex: typeTopicIndex,
        optionsIndex: optionsIndex
      })
    },
    setKnowledge(readItem, readIndex) {
      this.$emit('showKnowledge', {
        questionType: readItem.type,
        knowledge_point: {
          knowledge_point_id: readItem.knowledgePointId,
          knowledge_point_remark: readItem.remark,
          knowledge_point_remark_content: readItem.remarkContent,
        },
        subjectIndex: this.subjectIndex,
        topicIndex: readIndex
      })
    },
    edit(editDialogInfo, editDialogInfoIndex) {
      this.isShowEdit = !this.isShowEdit
      this.editDialogInfo = JSON.parse(JSON.stringify(editDialogInfo))
      this.editDialogInfoIndex = editDialogInfoIndex
    },
    deleteImage(typeIndex, typeTopicIndex, imageType, optionIndex) {
      this.$emit('deleteReadChoiceImage', {
        subjectIndex: this.subjectIndex,
        typeIndex: typeIndex,
        typeTopicIndex: typeTopicIndex,
        imageType: imageType,
        optionIndex: optionIndex
      })
    },
    triggerUploadImage(typeIndex, typeTopicIndex, imageType, optionIndex) {
      this.typeIndex = typeIndex
      this.typeTopicIndex = typeTopicIndex
      this.imageType = imageType
      this.optionIndex = optionIndex
      this.$refs.uploadImage.click()
    },
    changeSubjectInfo() {
      let smallSubject = this.readData['outlineResultList'][this.editDialogInfoIndex]
      if (this.editDialogInfo.name !== smallSubject.name || this.editDialogInfo.remark !== smallSubject.remark) {
        this.$emit('changeSubjectInfo', {
          subjectIndex: this.subjectIndex,
          typeIndex: this.editDialogInfoIndex,
          editDialogInfo: this.editDialogInfo
        })
      }

      if (this.editDialogInfo.quality !== smallSubject.quality) {
        if (this.editDialogInfo.quality > 20) this.editDialogInfo.quality = 20
        this.$emit('changeReadSubjectNumber', {
          subjectIndex: this.subjectIndex,
          typeIndex: this.editDialogInfoIndex,
          quality: this.editDialogInfo.quality
        })
      }
      this.isShowEdit = false
    },
    deleteOneSmallTopic(topicIndex, typeIndex, typeTopicIndex, item) {
      if (item.id) {
        this.deleteLoading = true
        this.deleteLoadingIndex = typeIndex+typeTopicIndex
      }
      this.$emit('deleteOneSmallTopic', {
        subjectIndex: this.subjectIndex,
        topicIndex: topicIndex,
        // typeIndex: typeIndex,
        typeTopicIndex: typeTopicIndex,
        callback: () => {
          this.deleteLoading = false
          this.deleteLoadingIndex = null
        }
      })
    },
    deleteChoiceOptions(typeIndex, typeTopicIndex, optionsIndex) {
      this.$emit('deleteChoiceOptions', {
        subjectIndex: this.subjectIndex,
        typeIndex: typeIndex,
        typeTopicIndex: typeTopicIndex,
        optionsIndex: optionsIndex
      })
    },
    addOptions(typeIndex, typeTopicIndex) {
      this.$emit('addReadChoiceOptions', {
        subjectIndex: this.subjectIndex,
        typeIndex: typeIndex,
        typeTopicIndex: typeTopicIndex
      })
    },
    addOneGroup(typeIndex, typeTopicIndex) {
      this.$emit('addReadFillBlankOneGroup', {
        subjectIndex: this.subjectIndex,
        typeIndex: typeIndex,
        typeTopicIndex: typeTopicIndex
      })
    },
    uploadImage(fileEvent) {
      let file = fileEvent.target.files[0]
      let size = this.imageType === 'readImage' ? 1024 : 500
      if (file.size/1024 > size) {
        this.$notify({
					message: `图片应小于${size}k`,
					type: 'error'
        })
        fileEvent.target.value = ''
        return;
      }

      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        let data = e.target.result

        this.$nextTick(() => {
          let image = new Image()
          image.src = data

          image.onload = () => {
            let width = image.width
            let height = image.height

            if (this.imageType === 'readImage' && (width > 1000 || height > 1000)) {
              this.$notify({
                message: '图片大小应小于1000x1000像素',
                type: 'error'
              })
              e.target.value = ''
              this.checkImageUrl = null
            } else if (this.imageType === 'questionImage' && (width > 600 || height > 300)){
              this.$notify({
                message: '图片大小应小于600X300像素',
                type: 'error'
              })
              e.target.value = ''
              this.checkImageUrl = null
              return;
            } else if (this.imageType === 'answerImage' && (width > 200 || height > 200)){
              this.$notify({
                message: '图片大小应小于200x200像素',
                type: 'error'
              })
              e.target.value = ''
              this.checkImageUrl = null
              return;
            } else {
              this.isShowHiddenImage = true
              let imageData = new FormData();
              imageData.append('file', file);
              imageData.append('category', 'homework');

              this.$Api.base.uploadImage(imageData)
              .then(res => {
                if (res.status === 200) {
                  if (res.data.code == 200) {
                    if (this.imageType === 'readImage') {
                      this.editor.txt.html(this.readData.questionExtendResultList[0].content+`<p><img src=${res.data.data}></p>`)
                    } else {
                      this.$emit('changeReadChoiceImage', {
                        imageUrl: res.data.data,
                        subjectIndex: this.subjectIndex,
                        typeIndex: this.typeIndex,
                        typeTopicIndex: this.typeTopicIndex,
                        imageType: this.imageType,
                        optionIndex: this.optionIndex
                      })
                    }
                  } else {
                    this.$notify({
                      message: '图片上传失败',
                      type: 'error'
                    })
                    fileEvent.target.value = ''
                    this.isShowHiddenImage = false
                    this.checkImageUrl = null
                  }
                } else {
                  this.$notify({
                    message: '图片上传失败',
                    type: 'error'
                  })
                  fileEvent.target.value = ''
                  this.isShowHiddenImage = false
                  this.checkImageUrl = null
                }
                fileEvent.target.value = ''
                this.isShowHiddenImage = false
                this.checkImageUrl = null
              })
              .catch(e => {
                this.$notify({
                  message: '图片上传失败',
                  type: 'error'
                })
                fileEvent.target.value = ''
                this.isShowHiddenImage = false
                this.checkImageUrl = null
              })
            }
          }
          this.checkImageUrl = data
        })
      }
    },
  },
  components: {
    SetFontFamily
  }
}
</script>

<style>
.w-e-toolbar >div {
  z-index: 100 !important;
}
.w-e-text-container {
  z-index: 98 !important;
}
</style>

<style lang="scss" scoped>
.read-question {
  font-size: 14px;

  >input {
    display: none;
  }

  .el-dialog__wrapper {
    z-index: 10001 !important;
  }

  .aic {
    align-items: center;
  }

  .sbn {
    justify-content: space-between;
    align-items: center;
  }
  .flex1 {
    flex: 1;
  }
  .body {

    .content {
      .title {
        font-size: 13px;
        color: #303133;
      }
    }
  }

  .image-box {
    padding-left: 70px;
    .stem-image {
      max-width: 330px;
      min-width: 100px;
    }
  }

  .standard-box {

    .content {
      width: 600px;

      .title {
        width: 70px;
        white-space: nowrap;
        flex-shrink: 0;
        font-size: 13px;
        color: #303133;
      }

      .fill-display {
        width: 124px;
      }
    }
    .operation {
      .delete-topic {
        margin-left: 15px;
      }
    }
  }

  .header {
    height: 40px;
    background: #f3efef;
    padding: 0 10px;
  }

  .check-image-px {
    .align-box {
      text-align: center;
    }
    p {
      text-align: center;
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
</style>
