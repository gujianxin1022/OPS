<template>
  <div class="other-question mb20" v-if="otherData">
    <div class="has-not-file" v-if="!otherData.questionExtendResultList[0].fileUrl">
      <input type="file" accept="image/*, application/pdf" class="hidden-file-input" ref="uploadFile" @change="uploadFile">
      <el-button size="mini" @click="chooseFile">选择文件</el-button>
    </div>
    <div class="show-file" v-else>
      <div v-if="otherData.questionExtendResultList[0].fileType===2">
        <img style="max-width: 80%" :src="otherData.questionExtendResultList[0].fileUrl" alt="" srcset="" class="mb20">
        <div><el-button size="mini" @click="deleteFile">删除文件</el-button></div> 
      </div> 
      <div style="{width:100%}" v-else>
        <iframe :src="otherData.questionExtendResultList[0].fileUrl" frameborder="0"></iframe>
        <div><el-button size="mini" @click="deleteFile">删除文件</el-button></div> 
      </div>
    </div>
  <el-dialog title="上传文件" :center="true" :visible.sync="isShowHiddenImage" width="800px" class="check-image-px" :show-close="false" :close-on-click-modal="false">
    <div v-loading="isShowHiddenImage" class="align-box">
      <img style="max-width: 800px; min-width: 100px" class="hiddenImage" ref="hiddenImage" :src="checkImageUrl" alt="">
    </div>
  </el-dialog>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
export default {
  props: {
    otherData: {
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
      checkImageUrl: null,
      isShowHiddenImage: false
    }
  },
  methods: {
    chooseFile() {
      this.$refs.uploadFile.click()
    },
    uploadFile(inputEvent) {
      let file = inputEvent.target.files[0],
          fileType;
      if (file.type !== "application/pdf") {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
          let data = e.target.result
          this.isShowHiddenImage = true

          this.$nextTick(() => {
            let image = this.$refs.hiddenImage
            image.onload = () => {
              let width = image.width
              let height = image.height

              if (width > 900){
                this.$notify({
                  message: '图片宽度应小于900像素',
                  type: 'error'
                })
                inputEvent.target.value = ''
                this.isShowHiddenImage = false
                this.checkImageUrl = null
                return;
              } else {
                let imageData = new FormData();
                imageData.append('file', file);
                imageData.append('category', 'homework');
                this.$Api.base.uploadImage(imageData)
                .then(res => {
                  if (res.status === 200) {
                    if (res.data.code == 200) {
                      fileType = 2
                      this.$emit('changeOtherFileInfo', {
                        subjectIndex: this.subjectIndex,
                        fileUrl: res.data.data,
                        fileType: fileType,
                        id: this.otherData.id
                      })
                    } else {
                      this.$notify({
                        message: '上传文件失败',
                        type: 'error'
                      })
                      inputEvent.target.value = ''
                    }
                  } else {
                    this.$notify({
                      message: '上传文件失败',
                      type: 'error'
                    })
                    inputEvent.target.value = ''
                  }
                  inputEvent.target.value = ''
                  this.isShowHiddenImage = false
                  this.checkImageUrl = null
                })
              }
            }
            this.checkImageUrl = data
          })
        }
      } else {
        let imageData = new FormData();
        imageData.append('file', file);
        imageData.append('category', 'homework');
        let loadingInstance = Loading.service({text: '文件上传中', background: 'rgba(255, 255, 255, 0.4)'})
        this.$Api.base.uploadImage(imageData)
        .then(res => {
          if (res.status === 200) {
            if (res.data.code == 200) {
              fileType = 3
              this.$emit('changeOtherFileInfo', {
                subjectIndex: this.subjectIndex,
                fileUrl: res.data.data,
                fileType: fileType,
                id: this.otherData.id
              })
            } else {
              this.$notify({
                message: '上传文件失败',
                type: 'error'
              })
              inputEvent.target.value = ''
            }
          } else {
            this.$notify({
              message: '上传文件失败',
              type: 'error'
            })
            inputEvent.target.value = ''
          }
          loadingInstance.close()
          inputEvent.target.value = ''
          this.isShowHiddenImage = false
          this.checkImageUrl = null
        })
        .catch(e => {
          loadingInstance.close()
          this.$notify({
            message: '上传文件失败',
            type: 'error'
          })
          inputEvent.target.value = ''
          this.checkImageUrl = null
        })
      }
    },
    deleteFile() {
      this.$emit('deleteFile', this.subjectIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
.other-question {
  .aic {
    align-items: center;
  }
  .hidden-file-input {
    display: none;
  }
  .show-file {
    iframe {
      width: 100%;
      height: 600px;
    }
  }
  .check-image-px {
    .align-box {
      text-align: center;
      >img {
        max-width: 100%;
      }
    }
    p {
      text-align: center;
    }
  }
}
</style>