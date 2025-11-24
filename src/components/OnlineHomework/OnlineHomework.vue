<template>
  <div class="online-homework">
    <HomeworkResult :result="result"></HomeworkResult>
    <div v-for="(outlineItem, outlineIndex) in ouline" :key="outlineIndex">
      <div class="outline-title mb30">
        <span class="mr20 fs24" v-html="outlineItem.title"></span>
        <span v-if="outlineItem.remark">|</span>
        <span class="ml20 fs18" v-html="outlineItem.remark"></span>
      </div>
      <template v-if="outlineItem.type == 1">
        <ChoiceQuestion v-for="(childItem, childIndex) in outlineItem.childList" :key="childIndex" :data="childItem" :index="childIndex" :status="childItem.status"></ChoiceQuestion>
      </template>
      <template v-if="outlineItem.type == 2">
        <FillBlankQuestion v-for="(childItem, childIndex) in outlineItem.childList" :key="childIndex" :jIndex="childIndex" :content="childItem.contentJson.options" :isFinished="true" :status="childItem.status" :rightAnswer="childItem.answer0" :studentAnswer="childItem.answer1"></FillBlankQuestion>
      </template>
      <template v-if="outlineItem.type == 3">
        <div v-for="(childItem, childIndex) in outlineItem.childList" :key="childIndex">
          <ConnectionQuestion :data="childItem" :index="childIndex" :isFinished="true" :studentAnswer="childItem.answer1" :rightAnswer="childItem.answer0" :iIndex="outlineIndex" :jIndex="childIndex"></ConnectionQuestion>
          <ConnectionQuestionResult :content="childItem.contentJson" :isFinished="true"  :rightAnswer="childItem.answer0" :studentAnswer="childItem.answer1" :iIndex="outlineIndex" :jIndex="childIndex"></ConnectionQuestionResult>
        </div>
      </template>
      <template v-if="outlineItem.type == 4">
        <SortQuestion v-for="(childItem, childIndex) in outlineItem.childList" :key="childIndex" :content="childItem.contentJson" :jIndex="childIndex" :isFinished="true" :status="childItem.status" :rightAnswer="childItem.answer0" :studentAnswer="childItem.answer1"></SortQuestion>
      </template>
      <template  v-if="outlineItem.type == 5">
        <div class="read-item" >
          <div v-html="outlineItem.content"></div>
        </div>
        <div class="modelItem" v-for="(modelItem, modelIndex) in outlineItem.modelList" :key="modelIndex">
          <div class="outline-title mb30">
            <span class="mr20 fs24">{{modelItem.title}}</span>
            <span v-if="modelItem.remark">|</span>
            <span class="ml20 fs18">{{modelItem.remark}}</span>
          </div>
          <template v-if="modelItem.type == 1">
            <ChoiceQuestion v-for="(childItem, childIndex) in modelItem.childList" :key="childIndex" :data="childItem" :index="childIndex" :status="childItem.status"></ChoiceQuestion>
          </template>
          <template v-if="modelItem.type == 2">
            <FillBlankQuestion v-for="(childItem, childIndex) in modelItem.childList" :key="childIndex" :jIndex="childIndex" :content="childItem.contentJson.options" :isFinished="true" :status="childItem.status" :rightAnswer="childItem.answer0" :studentAnswer="childItem.answer1"></FillBlankQuestion>
          </template>
        </div>
      </template>
      <template v-if="outlineItem.type == 6">
        <WritingQuestion v-for="(childItem, childIndex) in outlineItem.childList" :key="childIndex" :myImg="childItem.contentJson.fileType == 2 ? childItem.questionImage : null" :myFile="childItem.contentJson.fileType == 3 ? childItem.questionImage : null" ref="qWriting" :jIndex="childIndex" :isFinished="true" :status="childItem.status" :studentAnswer="childItem.answer1"></WritingQuestion>
      </template>
    </div>
  </div>
</template>

<script>
import ChoiceQuestion from './onlineHomeworkComponents/ChoiceQuestion'
import ConnectionQuestion from './onlineHomeworkComponents/ConnectionQuestion'
import ConnectionQuestionResult from './onlineHomeworkComponents/ConnectionQuestionResult'
import FillBlankQuestion from './onlineHomeworkComponents/FillBlankQuestion'
import SortQuestion from './onlineHomeworkComponents/SortQuestion'
import WritingQuestion from './onlineHomeworkComponents/WritingQuestion'
import HomeworkResult from './onlineHomeworkComponents/HomeworkResult'

export default {
  components: {
    ChoiceQuestion,
    ConnectionQuestion,
    ConnectionQuestionResult,
    FillBlankQuestion,
    SortQuestion,
    WritingQuestion,
    HomeworkResult
  },
  props: {
    ouline: {type: Array, default:  () => ([])},
  },
  data() {
    return {
      result: [],
      list: []
    }
  },
  mounted() {
    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    this.ouline.length && this.ouline.forEach((outlineItem, outlineIndex) => {
      if (outlineItem.type == 5) {
        let splitStrArr = outlineItem.content.split('</p>')
        splitStrArr.forEach(async (strItem, strIndex) => {
          if (strItem.includes('img')) {
            splitStrArr[strIndex] = strItem.replace(/<p>/g, "<p style='text-align: center'>")
          } else {
            splitStrArr[strIndex] = strItem.replace(/<p>/g, "<p style='text-indent: 2em'>")
          }
        })
        outlineItem.content = splitStrArr.join('</p>')  
        outlineItem.modelList.forEach(j => {
          if (j.type == 1) {
            j.childList.forEach(async k => {
              if (k.questionImage) this.pictureNumber++;
              k.contentJson.map(async (l, lIndex) => {
                Vue.set(l, 'letter', letters[lIndex]);
              });
            });
          }
        })
      }
    })
		this.resultProcessing()
		this.processResultTem()
  },
  methods: {
    processResultTem() {
      this.ouline.forEach((listItem, listIndex) => {
        if (listItem.type != 5) {
          listItem.childList.forEach((childItem, childIndex) => {
            if (!childItem.answer1) {
              childItem.answer1 = [];
            };
            let studentAnswer = childItem.answer1 ?? [];
            // status 1作对 2做错
            if (childItem.type == 1) {
              if (studentAnswer.length == 0) {
                childItem.status = 0;
              } else {
                if (childItem.status != 0) {
                  childItem.status = studentAnswer[0].answer == childItem.answer0[0].answer && studentAnswer[0].answerImage == childItem.answer0[0].answerImage ? 1 : 2
                } 
              }
            } else if (childItem.type == 2) {
              if (studentAnswer.length < childItem.answer0.length) {
                childItem.status = 0;
              } else {
                let rightAnswer = true
                for (let i = 0; i < studentAnswer.length; i++) {
                  if (studentAnswer[i].toLowerCase() != childItem.answer0[i].toLowerCase()) {
                    rightAnswer = false
                  }
                }
                childItem.status = rightAnswer ? 1 : 2;
              }
            } else if (childItem.type == 3) {
              if (studentAnswer.length < childItem.answer0.length) {
                childItem.status = 0;
              } 
              let rightAnswer = true;
              childItem.answer0.forEach((originAnswerItem, originAnswerIndex) => {
                let stAnswer = studentAnswer.filter(item => {
                  return (item.head == originAnswerItem.head && item.headImage == originAnswerItem.headImage)
                });
                if (stAnswer.length > 0) {
                  if (originAnswerItem.tail != stAnswer[0].tail || originAnswerItem.tailImage != stAnswer[0].tailImage) {
                    rightAnswer = false
                  }
                }
              })
              childItem.status = rightAnswer && (childItem.answer1?.length == childItem.answer0?.length) ? 1 : 2;
            } else if (childItem.type == 4) {
              if (studentAnswer.length == 0) {
                childItem.status = 0;
              } else {
                let rightAnswer = true;
                for (let i = 0; i < childItem.answer0.length; i++) {
                  if (childItem.answer0[i] != studentAnswer[i]) {
                    rightAnswer = false
                  }
                }
                childItem.status = rightAnswer ? 1 : 2
              }
            } else if (childItem.type == 6) {
              if (studentAnswer.length > 0) {
                childItem.status = 1
              }
            }
          })
        } else {
          listItem.modelList.forEach((modelItem, modelIndex) => {
            modelItem.childList.forEach((childItem, childIndex) => {
              let studentAnswer = childItem.answer1;
              if (childItem.type == 1) {
                if (studentAnswer.length == 0) {
                  childItem.status = 0
                } else {
                  if (childItem.status != 0) {
                    childItem.status = studentAnswer[0].answer == childItem.answer0[0].answer && studentAnswer[0].answerImage == childItem.answer0[0].answerImage ? 1 : 2
                  } 
                  // childItem.answer1 = [];
                  // let item = {
                  //   answer: studentAnswer[0].answer,
                  //   answerImage: studentAnswer[0].answerImage
                  // };
                  // childItem.answer1.push(item);
                }
              } else if (childItem.type == 2) {
                if (studentAnswer.length < childItem.answer0.length) {
                  childItem.status = 0
                } else {
                  let rightAnswer = true
                  for (let i = 0; i < studentAnswer.length; i++) {
                    if (studentAnswer[i].toLowerCase() != childItem.answer0[i].toLowerCase()) {
                      rightAnswer = false
                    }
                  }
                  childItem.status = rightAnswer ? 1 : 2
                }
              }
            })
          })
        }
			})
    },
    // 加结果
    resultProcessing() {
      this.result.length = 0;
      this.list = JSON.parse(JSON.stringify(this.ouline));
      this.list.forEach(i => {
        let currentGroup = {};
        currentGroup.title = i.title;
        currentGroup.type = i.type;
        if (i.type == 5) {
          currentGroup.childList = [];
          currentGroup.childList2 = [];
          i.modelList.forEach(j => {
            if (j.type == 1) {
              j.childList.forEach(k => {
                currentGroup.childList.push(k.status);
              });
            } else if (j.type == 2) {
              j.childList.forEach(k => {
                currentGroup.childList2.push(k.status);
              });
            }
          });
        } else {
          currentGroup.childList = [];
          i.childList.forEach(j => {
            currentGroup.childList.push(j.status);
          });
        }
        this.result.push(currentGroup);
      });
    },
  },

}
</script>

<style lang="scss" scoped>
.online-homework {
  padding: 20px 20px 0 20px;
  .fs24 {
    font-size: 24px;
  }
  .fs18 {
    font-size: 18px;
  }
  .outline-title {
    height: 48px;
    background: #DDDDDD;
    padding-left: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .read-item{
    line-height: 1.5;
    font-size: 26px;
  }
}
</style>