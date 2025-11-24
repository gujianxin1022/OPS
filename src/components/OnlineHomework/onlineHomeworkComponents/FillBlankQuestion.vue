<!-- question-fill -->
<template>
  <div class="question-fill-container">
    <!-- 试卷状态 -->
    <!-- 结果状态 -->
    <template>
      <div class="item">
        <!-- <div class="judge"> -->
          <template class="right-icon" v-if="status == 1">
            <img class="img judge" src="@/assets/homework/right.png">
          </template>
          <template class="wrong-icon" v-if="status == 2">
            <img class="img judge" src="@/assets/homework/wrong.png">
          </template>
          <template class="wrong-icon" v-if="status == 0">
            <img class="img judge">
          </template>
        <!-- </div> -->
        <span class="start">{{jIndex + 1}}、</span>
        <template>
          <template v-for="(item, index) in newContentSplit" class="flex">
            <template v-if="Object.prototype.toString.call(item) == '[object Array]'">
              <span v-for="(splitItem, splitIndex) in item" :key="splitIndex" v-html="splitItem.sentence"></span>
            </template>
            <template v-else>
              <input
                :key="index"
                :class="{'wrong-input': status == 2, 'mr10': true}" class="right-input" 
                :style="{'width': ((status == 0 ? item.rightAnswer : item.studentAnswer).length + 2) * 26 + 'px'}" 
                type="text" 
                name="" 
                :value="status == 0 ? item.rightAnswer : item.studentAnswer" 
                disabled="true"
              >
            </template>
          </template>
        </template>
        <div class="hw-no-work" v-if="status == 0">[未做]</div>
      </div>
      <!-- 做错的话多显示一行正确的答案 -->
      <div class="item" v-if="status == 2">
        <div class="judge"></div>
        <span class="start">{{jIndex + 1}}、</span>
        <template v-for="(i,index) in newContentSplit" class="flex">
          <template v-if="Object.prototype.toString.call(i) == '[object Array]'">
            <span v-for="(splitItem, splitIndex) in i" :key="splitIndex" v-html="splitItem.sentence"></span>
          </template>
          <template v-else>
            <input :key="index" class="right-input mr10" :style="{'width': (i.rightAnswer.length + 2) * 26 + 'px'}" type="text" name="" :value="i.rightAnswer" disabled="true">
          </template>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import { dealRichText, splitChineseWord } from '@/utils/homework_fun.js'
export default {
  name: 'question-fill',
  data() {
    return {
      value: [],
      contentSplit: [],
      newContentSplit: []
    }
  },
  props: {
    content: {},
    jIndex: null,
    status: null,
    rightAnswer: null,
    studentAnswer: null,
    isFinished: null,
    no: null
  },
  computed: {
    valueResult() {
      var arr = []
      this.value.forEach((i, index) => {
        //TODO:更改逻辑
        // if (index % 3 == 0) {
        //   arr.push(i);
        // }
        if (i == '' || i) {
          arr.push(i);
        }
      });
      return arr;
    }
  },
  created() {
    this.content.forEach(i => {
      if (i.rightFlag == 0 && i.sentence) {
        i.sentence = i.sentence.replace(/&nbsp;/g, ' ')
        let arr = dealRichText(i.sentence)
        arr.forEach((item, index) => {
          this.contentSplit.push({
            rightFlag: 0,
            sentence: item
          });
        })
      } else if (i.rightFlag == 1) {
        this.contentSplit.push(i);
      }
    });
  },
  mounted() {
    if (this.studentAnswer) {
      let count = 0;
      this.contentSplit.forEach((contentItem, contentIndex) => {
        if (contentItem.rightFlag == 1) {
          this.$set(this.value, contentIndex, this.studentAnswer[count])
          count++;
        }
      })
    } else {
      this.contentSplit.forEach((contentItem, contentIndex) => {
        if (contentItem.rightFlag == 1) {
          this.$set(this.value, contentIndex, '')
        } else {
          this.$set(this.value, contentIndex, undefined)
        }
      })
    }
    if (this.isFinished) {
      this.resetContentSplit()
    }
  },
  methods: {
    splitChineseWord,
    isObject(o) {
      return o.toString() === '[object Object]'
    },
    dealStr(str) {
      let arr = str.split('</span>')
      arr.forEach((item, index) => {
        if (item.includes('<span')) {
          let obj = {}
              let className = /(?<=class=')[^>]*(?=')/.exec(item)
              obj[className] = arr[index].replace(/<span[^<]*>([^<>]*)/, '$1')
              arr[index] = obj
        }
      })
      return arr
    },
    resetContentSplit() {
      let flag = 0;
      let newContentSplit = [];
      let sameContentArr = [];
      let count = 0;
      this.contentSplit.forEach((content, index) => {
        if (content.rightFlag != flag) {
          newContentSplit.push(sameContentArr);
          newContentSplit.push({
            studentAnswer: this.status == 0 ? '' : (this.studentAnswer[count]?this.studentAnswer[count]:''),
            rightAnswer: this.rightAnswer[count]
          });
          count++;
          sameContentArr = [];
        } else if (index == this.contentSplit.length - 1) {
          sameContentArr.push(content);
          newContentSplit.push(sameContentArr);
          count++;
          sameContentArr = [];
        } else { 
          sameContentArr.push(content);
        }
      })
      this.newContentSplit = newContentSplit
    }
  }
}

</script>
<style lang="scss">
.question-fill-container {
  .flex {
    display: flex;
  }

  .item {
    color: #34364d;
    font-size: 26px;
    display: flex;
    flex-wrap: wrap;
    line-height: 1.8;
    margin-bottom: 40px;
    align-items: center;

    .simhei, .fzkt, .fzktpy01, .fzktpy02, .fzktpy03, .fzktpy04, .fzktpy05, .fzktpy06 {
      display: inline-block;
      min-width: 13px;
    }

    .start {
      flex-shrink: 0;
    }

    .judge {
      width: 28px;
      flex-shrink: 0;
      margin-right: 12px;
    }

    .hw-no-work {
      color: #EB532F;
    }

    .right-icon,
    .wrong-icon {
      img {
        width: 28px;
        height: 28px;
        margin: 0 auto;
      }
    }

    input {
      border: none;
      border-bottom: 1px solid #34364d;
      padding: 0 5px;
      width: 30px;
      font-size: 26px;
      line-height: 25px;
      color: #34364d;
      text-align: center;

      &.right-input {
        color: #56BECD;
      }

      &.wrong-input {
        color: #EB532F;
      }
    }

    .fill {
      margin: 0 8px;
    }
  }
}

</style>
