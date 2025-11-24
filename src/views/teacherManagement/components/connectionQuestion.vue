<template>
  <div class="connection-question">
    <input type="file" ref="uploadImage" accept="image/*" @change="uploadImage">
    <div class="body mb20" v-for="(connectionItem, connectionIndex) in connectionData.questionExtendResultList"
         :key="connectionIndex">
      <div v-for="i in connectionItem.options.length" :key="i">
        <div class="standard-box flex-wrapper sbn mb10" :class="{mb20: i===connectionItem.options.length}" :key="i">
          <div class="content flex-wrapper sbn">
            <div class="title">{{ i === 1 ? connectionIndex + 1 + '.' : null }}</div>
            <el-input placeholder="点击输入" v-model.trim="connectionItem.options[i-1].head"></el-input>
            <el-button size="mini" class="ml10 mr10" @click="triggerUpload(connectionIndex, i-1, 'headImage')">上传图片
            </el-button>
            <div class="answer-title mr10">正确答案：</div>
            <el-input placeholder="点击输入" v-model.trim="connectionItem.options[i-1].tail"></el-input>
            <el-button size="mini" class="ml20" @click="triggerUpload(connectionIndex, i-1, 'tailImage')">上传图片
            </el-button>
            <el-button class="delete-topic" size="mini" v-if="connectionItem.options.length>2"
                       @click="deleteOneGroupConnection(connectionIndex, i-1)">删除连线
            </el-button>
          </div>
          <div class="operation flex-wrapper">
            <el-button class="knowledge" v-if="i===1" size="mini"
                       @click="setFontFamily(connectionItem, connectionIndex)">字体设置
            </el-button>
            <el-button size="mini" v-if="i===1" class="ml20" @click="setKnowledge(connectionItem, connectionIndex)">
              知识点设置
            </el-button>
            <el-button :loading="deleteLoading && connectionIndex === deleteLoadingIndex" class="delete-topic"
                       size="mini" v-if="i===1" type="primary" @click="deleteOneTopic(connectionIndex, connectionItem)">
              删除小题
            </el-button>
          </div>
        </div>
        <div class="connection-image mb10 flex-wrapper"
             v-if="connectionItem.options[i-1].headImage||connectionItem.options[i-1].tailImage">
          <div class="flex1 ml20 flex-wrapper aic">
            <img class="mr10" v-if="connectionItem.options[i-1].headImage" :src="connectionItem.options[i-1].headImage"
                 alt="" srcset="">
            <el-button size="mini" v-if="connectionItem.options[i-1].headImage"
                       @click="deleteConnectionImage(connectionIndex, i-1, 'headImage')">删除图片
            </el-button>
          </div>
          <div class="flex1 flex-wrapper aic">
            <img class="mr10" v-if="connectionItem.options[i-1].tailImage" :src="connectionItem.options[i-1].tailImage"
                 alt="" srcset="">
            <el-button v-if="connectionItem.options[i-1].tailImage" size="mini"
                       @click="deleteConnectionImage(connectionIndex, i-1, 'tailImage')">删除图片
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="上传文件" :center="true" :visible.sync="isShowHiddenImage" width="800px" class="check-image-px"
               :show-close="false" :close-on-click-modal="false">
      <div v-loading="isShowHiddenImage" class="align-box">
        <img style="max-width: 800px; min-width: 100px" class="hiddenImage" ref="hiddenImage" :src="checkImageUrl"
             alt="">
      </div>
      <p>图片上传中...</p>
    </el-dialog>
    <setFontFamily :setFontFamilyVisibility="setFontFamilyVisibility" :data="setFontFamilyData"
                   @closeDialog="setFontFamilyVisibility=false"></setFontFamily>
  </div>
</template>

<script>
import {Loading} from 'element-ui'
import SetFontFamily from './setFontFamily'

export default {
  props: {
    connectionData: {
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
      topicIndex: null,
      optionIndex: null,
      optionKey: null,
      checkImageUrl: null,
      isShowHiddenImage: false,
      deleteLoading: false,
      deleteLoadingIndex: null,
      setFontFamilyVisibility: false,
      setFontFamilyData: null,
    }
  },
  mounted() {
  },
  methods: {
    setFontFamily(choiceItem, choiceIndex) {
      this.setFontFamilyData = choiceItem
      this.setFontFamilyVisibility = true
    },
    setKnowledge(connectionItem, connectionIndex) {
      this.$emit('showKnowledge', {
        questionType: connectionItem.type,
        knowledge_point: {
          knowledge_point_id: connectionItem.knowledgePointId,
          knowledge_point_remark: connectionItem.remark,
          knowledge_point_remark_content: connectionItem.remarkContent,
        },
        subjectIndex: this.subjectIndex,
        topicIndex: connectionIndex
      })
    },
    uploadImage(fileEvent) {
      let file = fileEvent.target.files[0]
      if (file.size / 1024 > 500) {
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

          image.onload = () => {
            let width = image.width
            let height = image.height

            if (width > 200 || height > 200) {
              this.$notify({
                message: '图片大小应小于200X200像素',
                type: 'error'
              })
              fileEvent.target.value = ''
              this.checkImageUrl = null
              return;
            } else {
              let imageData = new FormData();
              imageData.append('file', file);
              imageData.append('category', 'homework');
              this.isShowHiddenImage = true

              this.$Api.base.uploadImage(imageData)
                .then(res => {
                  if (res.status === 200) {
                    if (res.data.code == 200) {
                      this.$emit('changeConnectionImage', {
                        imageUrl: res.data.data,
                        subjectIndex: this.subjectIndex,
                        topicIndex: this.topicIndex,
                        optionsIndex: this.optionsIndex,
                        optionKey: this.optionKey
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
            }
          }
          this.checkImageUrl = data
        })
      }
    },
    triggerUpload(topicIndex, optionsIndex, optionKey) {
      this.topicIndex = topicIndex
      this.optionsIndex = optionsIndex
      this.optionKey = optionKey
      this.$refs.uploadImage.click()
    },
    deleteOneGroupConnection(topicIndex, optionsIndex) {
      this.$emit('deleteOneGroupConnection', {
        subjectIndex: this.subjectIndex,
        topicIndex: topicIndex,
        optionsIndex: optionsIndex
      })
    },
    deleteOneTopic(topicIndex, connectionItem) {
      if (connectionItem.id) {
        this.deleteLoading = true
        this.deleteLoadingIndex = topicIndex
      }
      this.$emit('deleteOneTopic', {
        subjectIndex: this.subjectIndex,
        topicIndex: topicIndex,
        callback: () => {
          this.deleteLoading = false
          this.deleteLoadingIndex = null
        }
      })
    },
    deleteConnectionImage(topicIndex, optionsIndex, optionKey) {
      this.$emit('deleteConnectionImage', {
        subjectIndex: this.subjectIndex,
        topicIndex: topicIndex,
        optionsIndex: optionsIndex,
        optionKey: optionKey
      })
    }
  },
  components: {
    SetFontFamily
  }
}
</script>

<style lang="scss" scoped>
.connection-question {
  font-size: 14px;

  .aic {
    align-items: center;
  }

  > input {
    display: none;
  }

  .sbn {
    justify-content: space-between;
    align-items: center;
  }

  .flex1 {
    flex: 1;
  }

  .body {
    border-bottom: 1px dotted #d5d6de;;
  }

  .standard-box {

    .content {
      width: 730px;
      color: #34364D;

      .title, .answer-title {
        width: 20px;
        white-space: nowrap;
        flex-shrink: 0;
        font-size: 13px;
      }

      .answer-title {
        width: 60px;
      }
    }

    .operation {
      .delete-topic {
        margin-left: 15px;
      }
    }
  }

  .connection-image {
    padding-left: 18px;
    width: 850px;

    img {
      max-width: 150px;
      min-width: 100px;
    }
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
</style>
