<template>
  <el-dialog
    :before-close="close"
    title="预览"
    :center="true"
    :visible.sync="isShowPreview"
    width="1000px"
  >
    <div
      class="subject-preview mt10"
      v-for="(subjectItem, subjectIndex) in previewData"
      :key="subjectIndex"
    >
      <div class="subject-title">{{toChinesNum(subjectIndex+1)}}、 <span
          v-html="subjectItem.name"
        ></span> <span v-html="subjectItem.remark"></span></div>
      <template v-if="subjectItem.type===1">
        <div
          class="choice-subject-preview"
          v-for="(choiceItem, choiceIndex) in subjectItem.questionExtendResultList"
          :key="choiceIndex"
        >
          <div class="mt20 mb15 ml5">{{choiceIndex+1}}. <span
              v-html="choiceItem.question"
            ></span></div>
          <div
            v-if="choiceItem.questionImage"
            class="ml20"
          ><img
              class="mb10"
              :src="choiceItem.questionImage"
            /></div>
          <div class="choice-option-preview-body">
            <div
              class="choice-option-preview ml20 mb10"
              v-for="(optionItem, optionIndex) in choiceItem.options"
              :key="optionIndex"
            >
              <div
                class="mb10"
                :class="{'right-answer-chioce': optionItem.rightAnswer}"
              ><strong>{{optionName(optionIndex)}}.</strong> <span
                  v-html="optionItem.answer"
                ></span></div>
              <div v-if="optionItem.answerImage"><img
                  :src="optionItem.answerImage"
                  alt=""
                ></div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="subjectItem.type===2">
        <div
          class="fill-blank-subject-preview"
          v-for="(fillBlankItem, fillBlankIndex) in subjectItem.questionExtendResultList"
          :key="fillBlankIndex"
        >
          <span class="mr10 ml5">{{fillBlankIndex+1}}.</span>
          <div
            class="fill-blank-item mb10"
            :class="{'fill-blank-item-answer':optionItem.rightFlag===1}"
            v-for="(optionItem, optionIndex) in fillBlankItem.options"
            :key="optionIndex"
            v-html="optionItem.sentence"
          ></div>
        </div>
      </template>
      <template v-if="subjectItem.type===3">
        <div
          class="connection-subject-preview mt10 flex-wrapper"
          v-for="(connectionItem, connectionIndex) in subjectItem.questionExtendResultList"
          :key="connectionIndex"
        >
          <span class="mr10 ml5">{{connectionIndex+1}}.</span>
          <div class="head-preview ml10 flex1">
            <div class="connection-item mb10 flex-wrapper">
              <div
                class="mb50 flex1"
                v-for="(optionItem, optionIndex) in connectionItem.options.headArr"
                :key="optionIndex"
              >
                <p
                  v-html="optionItem.head"
                  v-if="optionItem.content !== 'image'"
                ></p>
                <img
                  v-if="optionItem.headImage && optionItem.content !== 'text'"
                  :src="optionItem.headImage"
                  alt=""
                  srcset=""
                >
              </div>
            </div>
            <div class="connection-item mb10 flex-wrapper">
              <div
                class="mb50 flex1"
                v-for="(optionItem, optionIndex) in connectionItem.options.tailArr"
                :key="optionIndex"
              >
                <p
                  v-html="optionItem.tail"
                  v-if="optionItem.content !== 'image'"
                ></p>
                <img
                  v-if="optionItem.tailImage && optionItem.content !== 'text'"
                  :src="optionItem.tailImage"
                  alt=""
                  srcset=""
                >
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="subjectItem.type===4">
        <div
          class="sort-subject-preview mt10"
          v-for="(sortItem, sortIndex) in subjectItem.questionExtendResultList"
          :key="sortIndex"
        >
          <div class="sort-question-title flex-wrapper mb10">
            <span class="mr10 ml5">{{sortIndex+1}}.</span>
            <span
              class="mr10"
              v-html="sortItem.pre"
            ></span>
            <div
              class="border-bottom-box mr10"
              v-html="sortItem.answer"
            ></div>
            <span
              class="mr10"
              v-html="sortItem.post"
            ></span>
          </div>
          <div class="options pl20">
            <div
              class="mb10"
              v-for="(wordItem, wordIndex) in sortItem.options"
              :key="wordIndex"
            >{{sortArr[wordIndex]}}. <span v-html="wordItem.word"></span></div>
          </div>
        </div>
      </template>
      <template v-if="subjectItem.type===5">
        <div
          class="article"
          v-html="subjectItem.questionExtendResultList[0].content"
        ></div>
        <div
          class="read-subject-preview mt10"
          v-for="(readItem, readIndex) in subjectItem.outlineResultList"
          :key="readIndex"
        >
          <template v-if="readItem.type === 1">
            <div class="mt10 mb10">1. <span v-html="readItem.name"></span> <span
                v-html="readItem.remark"
              ></span></div>
            <div
              class="choice-subject-preview"
              v-for="(choiceItem, choiceIndex) in readItem.questionExtendResultList"
              :key="choiceIndex"
            >
              <div class="ml20 mb10">{{choiceIndex+1}}. <span
                  v-html="choiceItem.question"
                ></span></div>
              <div class="ml20 mb10"><img
                  v-if="choiceItem.questionImage"
                  :src="choiceItem.questionImage"
                /></div>
              <div class="choice-option-preview-body flex-wrapper">
                <div
                  class="choice-option-preview ml30 mb10"
                  v-for="(optionItem, optionIndex) in choiceItem.options"
                  :key="optionIndex"
                >
                  <div
                    class="mb10"
                    :class="{'right-answer-chioce': optionItem.rightAnswer}"
                  ><strong>{{optionName(optionIndex)}}.</strong> <span
                      v-html="optionItem.answer"
                    ></span></div>
                  <img
                    class="ml10 preview-option-image"
                    v-if="optionItem.answerImage"
                    :src="optionItem.answerImage"
                    alt=""
                  >
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="mt10 mb10">2. <span v-html="readItem.name"></span> <span
                v-html="readItem.remark"
              ></span></div>
            <div
              class="fill-blank-subject-preview"
              v-for="(fillBlankItem, fillBlankIndex) in readItem.questionExtendResultList"
              :key="fillBlankIndex+'container'"
            >
              <span class="mr10 ml20">{{fillBlankIndex+1}}.</span>
              <div
                class="fill-blank-item mb10"
                :class="{'fill-blank-item-answer':optionItem.rightFlag===1}"
                v-for="(optionItem, optionIndex) in fillBlankItem.options"
                :key="optionIndex+'word'"
                v-html="optionItem.sentence"
              ></div>
            </div>
          </template>
        </div>
      </template>
      <template v-if="subjectItem.type===6">
        <div class="mt20">
          <img
            v-if="subjectItem.questionExtendResultList[0].fileType==2"
            :src="subjectItem.questionExtendResultList[0].fileUrl"
            alt=""
            srcset=""
            class="mb20"
          />
          <iframe
            v-if="subjectItem.questionExtendResultList[0].fileType==3"
            :src="subjectItem.questionExtendResultList[0].fileUrl"
            frameborder="0"
          ></iframe>
        </div>
      </template>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isShowPreview: {
      type: Boolean,
      default: false
    },
    subjectData: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      letters26: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      sortArr: ['①', '②', '③', '④', '⑤', '⑥', '⑦']
    }
  },
  computed: {
    previewData () {
      if (this.isShowPreview) {
        let newData = JSON.parse(JSON.stringify(this.subjectData))
        newData && newData.forEach((subjectItem, subjectIndex) => {
          switch (subjectItem.type) {
            case 1: {
              subjectItem.questionExtendResultList.forEach((topicItem, topicIndex) => {
                if (topicItem.options.length > 0) {
                  topicItem.options[0]['rightAnswer'] = true
                }
                topicItem.options = this.shuffle(topicItem.options)
              })
              break
            }
            case 3: {
              subjectItem.questionExtendResultList.forEach((topicItem, topicIndex) => {
                topicItem.options = topicItem.options.filter(item => (item.head !== '' || item.headImage !== '' || item.tail !== '' || item.tailImage !== ''))
                topicItem.options.headArr = []
                topicItem.options.tailArr = []

                topicItem.options.forEach((item, index) => {
                  topicItem.options.headArr.push({
                    head: item.head,
                    headImage: item.headImage,
                    content: item.head && !item.headImage ? 'text' : !item.head && item.headImage ? 'image' : ''
                  })
                  topicItem.options.tailArr.push({
                    tail: item.tail,
                    tailImage: item.tailImage,
                    content: item.tail && !item.tailImage ? 'text' : !item.tail && item.tailImage ? 'image' : ''
                  })
                })
                topicItem.options.headArr = topicItem.options.headArr
                topicItem.options.tailArr = topicItem.options.tailArr
              })
              break
            }
            case 4: {
              subjectItem.questionExtendResultList.forEach((topicItem, topicIndex) => {
                topicItem.answer = topicItem.options.reduce((a, b) => a + b.word, '')
                topicItem.options = this.shuffle(topicItem.options)
              })
              break
            }
            case 5: {
              subjectItem.questionExtendResultList.forEach((readItem, readIndex) => {
                let splitStrArr = readItem.content.split('</p>')
                splitStrArr.forEach((strItem, strIndex) => {
                  if (strItem.includes('img')) {
                    splitStrArr[strIndex] = strItem.replace(/<p>/g, "<p style='text-align: center'>")
                  } else {
                    splitStrArr[strIndex] = strItem.replace(/<p>/g, "<p style='text-indent: 2em'>")
                  }
                })
                readItem.content = splitStrArr.join('</p>')
              })
              subjectItem.outlineResultList.forEach((topicItem, topicIndex) => {
                topicItem.questionExtendResultList.forEach((typeTopicItem, typeTopicIndex) => {
                  if (typeTopicItem.type === 1) {
                    if (typeTopicItem.options.length > 0) {
                      typeTopicItem.options[0]['rightAnswer'] = true
                    }
                    typeTopicItem.options = this.shuffle(typeTopicItem.options)
                  }
                })
              })
              break
            }
          }
        })
        return newData
      }
    }
  },
  methods: {
    toChinesNum (num) {
      let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = "零"
      let unit = ["", "十", "百", "千", "万"];
      num = parseInt(num);
      let getWan = (temp) => {
        let strArr = temp.toString().split("").reverse();
        let newNum = "";
        for (var i = 0; i < strArr.length; i++) {
          newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
        }
        return newNum;
      }
      let overWan = Math.floor(num / 10000);
      let noWan = num % 10000;
      if (noWan.toString().length < 4) noWan = "0" + noWan;
      return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
    },
    close () {
      this.$emit('closePreviewDialog')
    },
    optionName (index) {
      if (index <= 25) {
        return this.letters26[index]
      } else {
        return this.letters26[(index % 25) - 1]
      }
    },
    shuffle (arr) {
      for (let i = arr.length - 1; i >= 0; i--) {
        let rIndex = Math.floor(Math.random() * (i + 1));
        let temp = arr[rIndex];
        arr[rIndex] = arr[i];
        arr[i] = temp;
      }
      return arr;
    }
  }
}
</script>

<style lang="scss" scoped>
.flex1 {
  flex: 1;
}
.right-answer-chioce {
  color: rgb(126, 189, 204);
}
.subject-preview {
  .subject-title {
    font-size: 26px;
    color: #303133;
    background: #dcdfe6;
    padding: 5px 6px;
    font-weight: 500;
    display: inline-block;
  }
  .choice-subject-preview {
    font-size: 22px;
    .choice-option-preview-body {
      display: flex;
      flex-wrap: wrap;
    }
    .choice-option-preview {
      display: inline-block;
      width: 40%;
      > div {
        > img {
          max-width: 80%;
          min-width: 30%;
        }
      }
      .preview-option-image {
        min-width: 20%;
        max-width: 50%;
      }
    }
    > div {
      > img {
        max-width: 30%;
        min-width: 10%;
      }
    }
  }
  .fill-blank-subject-preview {
    font-size: 22px;
    padding-top: 10px;
    .fill-blank-item {
      display: inline-block;
    }
    .fill-blank-item-answer {
      padding: 0 10px;
      border-bottom: 1px solid #8a8484;
      margin: 0 5px;
    }
  }

  .connection-subject-preview {
    font-size: 22px;
    .connection-item {
      > div {
        padding-right: 15px;
        text-align: center;
        > p {
          padding: 5px;
          background-color: #e1e4ea;
          border-radius: 5px;
        }
        > img {
          min-width: 50%;
          max-width: 80%;
        }
      }
    }
  }

  .sort-subject-preview {
    font-size: 22px;
    .sort-question-title {
      .border-bottom-box {
        // width: 100px;
        padding: 0 10px;
        border-bottom: 1px solid #8a8484;
      }
    }
  }

  .article {
    font-size: 22px;
  }

  .read-subject-preview {
    font-size: 22px;
    .choice-option-preview-body {
      display: flex;
      flex-wrap: wrap;
      .choice-option-preview {
        display: inline-block;
        width: 40%;
      }
    }
  }
  iframe {
    width: 100%;
    height: 700px;
  }
}
</style>
