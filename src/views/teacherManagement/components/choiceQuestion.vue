<template>
  <div class="choice-Question" v-if="choiceData!==null">
    <input type="file" ref="uploadImage" accept="image/*" @change="uploadImage">
    <div class="body mb30" v-for="(item, index) in (choiceData.questionExtendResultList)" :key="index">
      <div class="standard-box flex-wrapper sbn mb10">
        <div class="content flex-wrapper sbn">
          <div class="title">{{index+1}}. 题干：</div>
          <el-input :placeholder="item.questionImage?'请选择符合图片的描述':'点击输入'" v-model.trim="item.question"></el-input>
          <el-button size="mini" @click="uploadStemImage(index, 'questionImage')" class="ml20">点击上传</el-button>
        </div>
        <div class="operation ml20 flex-wrapper">
          <el-button class="knowledge" size="mini" @click="setFontFamily(item, index)">字体设置</el-button>
          <el-button class="knowledge" size="mini" @click="setKnowledge(item, index)">知识点设置</el-button>
          <el-button class="delete-topic" :loading="deleteLoading && deleteLoadingIndex === index" size="mini" @click="deleteOneTopic(index, item)" type="primary">删除小题</el-button>
        </div>
      </div>
      <div class="mb10 flex-wrapper aic" v-if="item.questionImage">
        <img class="stem-image mr10" :src="item.questionImage" alt="" srcset="">
        <el-button size="mini" @click="deleteStemImage(index, 'questionImage')">删除图片</el-button>
      </div>
      <div class="other-answer" v-for="(oaItem, oaIndex) in item.options" :key="oaIndex">
        <div class="standard-box flex-wrapper" :class="oaIndex===0?'mb30':'mb10'">
          <div class="content flex-wrapper sbn">
            <div class="title">{{oaIndex===0?'正确答案':'其他答案'}}：</div>
            <el-input placeholder="点击输入" v-model.trim="oaItem.answer"></el-input>
            <el-button size="mini" @click="uploadStemImage(index, 'answerImage', oaIndex)" class="ml20">上传图片</el-button>
          </div>
          <div class="operation ml20">
            <el-button size="mini" v-if="item.options.length>2&&oaIndex>=2" @click="deleteChoiceOptions(index, oaIndex)">删除选项</el-button>
          </div>
        </div>
        <div class="mb10 flex-wrapper aic" v-if="oaItem.answerImage">
          <img class="stem-image mr10" :src="oaItem.answerImage" alt="" srcset="">
          <el-button size="mini" @click="deleteStemImage(index, 'answerImage', oaIndex)">删除图片</el-button>
        </div>
      </div>
      <div class="other-answer">
        <div class="standard-box flex-wrapper sbn mb20">
          <div class="content flex-wrapper">
            <div class="title"></div>
            <el-button v-if="item.options.length<6" @click="addOptions(index)">添加选项</el-button>
          </div>
          <div class="operation ml20">
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="上传文件" :center="true" :visible.sync="isShowHiddenImage" width="800px" class="check-image-px" :show-close="false" :close-on-click-modal="false">
      <div v-loading="isShowHiddenImage" class="align-box">
        <img style="max-width: 800px; min-width: 100px" class="hiddenImage" ref="hiddenImage" :src="checkImageUrl" alt="">
      </div>
    </el-dialog>

    <setFontFamily :setFontFamilyVisibility="setFontFamilyVisibility" :data="setFontFamilyData" @closeDialog="setFontFamilyVisibility=false"></setFontFamily>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import SetFontFamily from './setFontFamily'
export default {
  props: {
    choiceData: {
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
      fileList: [],
      topicIndex: null,
      topicImageKey: null,
      optionsIndex: null,
      checkImageUrl: null,
      isShowHiddenImage: false,
      deleteLoading: false,
      deleteLoadingIndex: null,
      setFontFamilyVisibility: false,
      setFontFamilyData: null
    }
  },
  methods: {
    setFontFamily(choiceItem, choiceIndex) {
      this.setFontFamilyData = choiceItem
      this.setFontFamilyVisibility = true
    },
    setKnowledge(choiceItem, choiceIndex) {
      this.$emit('showKnowledge', {
        questionType: choiceItem.type,
        knowledge_point: {
          knowledge_point_id: choiceItem.knowledgePointId,
          knowledge_point_remark: choiceItem.remark,
          knowledge_point_remark_content: choiceItem.remarkContent,
        },
        subjectIndex: this.subjectIndex,
        topicIndex: choiceIndex
      })
    },
    addOptions(topicIndex) {
      if (this.choiceData.questionExtendResultList[topicIndex].options.length < 6) {
        this.$emit('addOptions', {
          subjectIndex: this.subjectIndex,
          topicIndex: topicIndex
        })
      }
    },
    deleteOneTopic(index, item) {
      if (item.id) {
        this.deleteLoading = true
        this.deleteLoadingIndex = index
      }
      this.$emit("deleteOneTopic", {subjectIndex: this.subjectIndex, topicIndex: index, callback: () => {
        this.deleteLoading = false
        this.deleteLoadingIndex = null
      }})
    },
    uploadStemImage(data, topicImageKey, optionsIndex) {
      this.$refs.uploadImage.click()
      this.topicIndex = data
      this.topicImageKey = topicImageKey
      this.optionsIndex = optionsIndex
    },
    handleExceed() {

    },
    uploadImage(fileEvent) {
      let file = fileEvent.target.files[0]
      if (file.size/1024 > 500) {
        this.$notify({
					message: '图片应小于500k',
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

          // let image = this.$refs.hiddenImage
          image.onload = () => {
            let width = image.width
            let height = image.height

            if (this.topicImageKey === 'questionImage' && (width > 600 || height > 300)){
              this.$notify({
                message: '图片大小应小于600X300像素',
                type: 'error'
              })
              fileEvent.target.value = ''
              this.checkImageUrl = null
              return;
            } else if (this.topicImageKey === 'answerImage' && (width > 200 || height > 200)) {
              this.$notify({
                message: '图片大小应小于200x200像素',
                type: 'error'
              })
              fileEvent.target.value = ''
              this.checkImageUrl = null
            } else {
              this.isShowHiddenImage = true
              let imageData = new FormData();
              imageData.append('file', file);
              imageData.append('category', 'homework');
              
              this.$Api.base.uploadImage(imageData)
              .then(res => {
                if (res.status === 200) {
                  if (res.data.code == 200) {
                    this.$emit('changeChoiceImageData', {
                      imageUrl: res.data.data,
                      subjectIndex: this.subjectIndex,
                      topicIndex: this.topicIndex, 
                      topicKey: this.topicImageKey,
                      optionIndex: this.topicImageKey==='answerImage' ? this.optionsIndex : null
                    })
                  } else {
                    this.$notify({
                      message: '图片上传失败',
                      type: 'error'
                    })
                    fileEvent.target.value = ''
                  }
                } else {
                  this.$notify({
                    message: '图片上传失败',
                    type: 'error'
                  })
                  fileEvent.target.value = ''
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
              .finally(() => {
              })
            }
          }
          this.checkImageUrl = data
        })
      }
    },
    deleteStemImage(topicIndex, topicKey, optionsIndex) {
      this.$emit('deleteStemImage', {
        subjectIndex: this.subjectIndex,
        topicIndex: topicIndex, 
        topicKey: topicKey,
        optionsIndex: optionsIndex
      })
    },
    deleteChoiceOptions(topicIndex, optionIndex) {
      this.$emit('deleteChoiceOptions', {
        subjectIndex: this.subjectIndex, 
        topicIndex: topicIndex,
        optionsIndex: optionIndex
      })
    }
  },
  components: {
    SetFontFamily
  }
}
</script>

<style lang="scss" scoped>
.choice-Question {
  font-size: 14px;
  >input {
    display: none;
  }
  .sbn {
    justify-content: space-between;
    align-items: center;
  }
  .aic {
    align-items: center;
  }
  .flex1 {
    flex: 1;
  }
  .body {
    border-bottom: 1px dotted #d5d6de;;
    .standard-box {
      .content {
        color: #34364D;
        .title {
          width: 70px;
          white-space: nowrap;
          flex-shrink: 0;
          font-size: 13px;
        }
        width: 500px;
      }
      .operation {
        .delete-topic {
          margin-left: 15px;
        }
      }
    }
    .stem-image {
      margin-left: 80px;
      max-width: 330px;
      min-width: 100px;
    }
  }
  .check-image-px {
    .align-box {
      text-align: center;
      img {
        max-width: 100%;
      }
    }
  }
}
</style>