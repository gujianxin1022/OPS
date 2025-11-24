<!-- question-sort -->
<template>
  <div class="question-sort-container">
    <div>
      <div class="item">
        <div class="icon-container">
          <img src="@/assets/homework/right.png" v-if="status == 1">
          <img src="@/assets/homework/wrong.png" v-if="status == 2">
        </div>
        <div class="start">{{jIndex + 1}}、</div>
        <div class="start" v-for="(k, i) in content.pre" :key="i" v-html="k"></div>
        <div class="sort">
          <!-- 没做 -->
          <div v-if="status == 0" class="wrong-text right-color" :style="{'width': inputWidthStyle}" v-html="rightAnswerStr"></div>
          <div v-else>
            <div v-if="status == 1">
              <div class="wrong-text right-color" :style="{'width': inputWidthStyle}" v-html="studentAnswerStr"></div>
            </div>
            <span v-if="status == 2">
              <div class="wrong-text" :style="{'width': inputWidthStyle}"><span v-for="(i, index) in studentAnswerDetail" :key="index" :class="{'wrong-color': !i.isRight}" class="right-color" v-html="i.value"></span></div>
            </span>
          </div>
        </div>
        <div class="end" v-for="(k, i) in content.post" :key="i" v-html="k"></div>
        <div class="hw-no-work" v-if="status == 0">[未做]</div>
      </div>
      <div class="item" v-if="status == 2">
        <div class="icon-container"></div>
        <div class="start">{{jIndex + 1}}、</div>
        <div class="start" v-for="(k, i) in content.pre" :key="i" v-html="k"></div>
        <div class="sort">
          <div class="wrong-text right-color" :style="{'width': inputWidthStyle}" v-html="rightAnswerStr"></div>
        </div>
        <div class="end" v-for="(k, i) in content.post" :key="i" v-html="k"></div>
        <div class="hw-no-work" v-if="status == 0">[未做]</div>
      </div>
      <!-- 选项 -->
      <div class="tag">
        <div v-for="(t,tIndex) in content.options" :key="tIndex">
          <div class="tag-item" :class="{'tag-item-active': t.selected}" v-html="t.word">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { dealRichText, splitChineseWord } from '@/utils/homework_fun.js';

export default {
  name: 'question-sort',
  data() {
    return {
      value: '',
      valueArray: [],
      optionsSelected: 'no',
      inputValue: ''
    }
  },
  props: {
    content: {},
    jIndex: null,
    status: null,
    rightAnswer: null,
    studentAnswer: null,
    isFinished: null
  },
  watch: {
    value() {
      this.inputValue = splitChineseWord(this.value)
    }
  },
  computed: {
    inputWidthStyle() {
      let value = '';
      this.content.options.map(i => {
        value += splitChineseWord(i.word);
      });
      return (value.length + 1) * 26 + 'px';
    },
    studentAnswerStr() {
      let str = '';
      this.studentAnswer.forEach(i => {
        str += i;
      });
      return str;
    },
    rightAnswerStr() {
      let str = '';
      this.rightAnswer.forEach(i => {
        str += i;
      });
      
      return str;
    },
    studentAnswerDetail() {
      let arr = []
      this.studentAnswer.forEach((i, index) => {
        arr.push({
          value: i,
          isRight: this.studentAnswer[index] == this.rightAnswer[index]
        });
      });
      return arr;
    }
  },
  created() {
    if (Object.prototype.toString.call(this.content.pre) !== '[object Array]') {
      this.content.pre = this.content.pre.split('&nbsp;').join(' ')
    }
    this.content.pre = dealRichText(this.content.pre)
    if (Object.prototype.toString.call(this.content.post) !== '[object Array]') {
      this.content.post = this.content.post.split('&nbsp;').join(' ')
    }
    this.content.post = dealRichText(this.content.post)
  },
  mounted() {
    let count = 0;
    if (this.studentAnswer) {
      this.content.options.map(i => {
        this.studentAnswer.forEach(j => {
          if (i.word == j) {
            i.selected = true;
            count++;
          } else {
            // i.selected = false;
          }
        });
      });
      this.studentAnswer.forEach(j => {
        this.valueArray.push(j);
      });
      if (count == 0) {
        this.optionsSelected = 'no'
      } else if (count == this.content.options.length) {
        this.optionsSelected = 'all'
      } else {
        this.optionsSelected = 'any'
      }
      this.studentAnswer.forEach(i => {
        this.value += i;
      });
    }
  },
  methods: {
    // 点击tag
    onClickTag(item, index) {
      if (this.optionsSelected != 'all') {
        if (!this.content.options[index].selected) {
          this.content.options[index].selected = true;
          this.value += item.word;
          this.valueArray.push(item.word);
        }
      } else {
        this.resetTags();
        this.content.options[index].selected = true;
        this.value += item.word;
        this.valueArray.push(item.word);
      }
      this.optionsSelected = this.optionsSelectedComputed();
    },
    // 重置tag
    resetTags() {
      this.content.options.map(i => {
        i.selected = false;
      });
      this.value = '';
      this.valueArray = [];
      this.optionsSelected = 'no';
    },
    // 选项选择计算
    optionsSelectedComputed() {
      let count = 0;
      this.content.options.map(i => {
        if (i.selected) {
          count++;
        }
      });
      if (count == 0) {
        return 'no'
      } else {
        if (count == this.content.options.length) {
          return 'all';
        } else {
          return 'any';
        }
      }
    }
  }
}

</script>
<style lang="scss" >
.question-sort-container {
  box-sizing: border-box;
  padding-bottom: 20px;

  .item {
    position: relative;
    padding-left: 40px;
    color: #34364d;
    font-size: 26px;
    display: flex;
    flex-wrap: wrap;
    line-height: 1.8;
    margin-bottom: 40px;

    .simhei, .fzkt, .fzktpy01, .fzktpy02, .fzktpy03, .fzktpy04, .fzktpy05, .fzktpy06 {
      display: inline-block;
      min-width: 13px;
    }

    .start {
      flex-shrink: 0;
    }

    input {
      border: none;
      border-bottom: 1px solid #34364d;
      padding: 0 5px;
      width: 50px;
      font-size: 16px;
      line-height: 22px;
      color: #34364d;
      text-align: center;
      background: none !important;

      &.right-input {
        color: #56BECD;
      }

      &.wrong-input {
        color: #EB532F;
      }
    }

    .wrong-text {
      border: none;
      border-bottom: 1px solid #34364d;
      padding: 0 5px;
      width: 50px;
      font-size: 24px;
      line-height: 1.8;
      height: 36px;
      color: #34364d;
      text-align: center;

      .right-color {
        color: #56BECD;
      }

      &.right-color {
        color: #56BECD;
      }

      .wrong-color {
        color: #EB532F;
      }
    }

    .sort {
      margin: 0 8px;
    }

    .icon-container {
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      width: 24px;
      height: 24px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.tag {
  display: flex;
  width: 800px;
  margin-left: 40px;
  flex-wrap: wrap;

  .tag-item {
    flex-shrink: 0;
    box-sizing: border-box;
    width: 120px;
    height: 40px;
    margin-bottom: 20px;
    background: #f4f4f4;
    color: #fff;
    line-height: 40px;
    text-align: center;
    margin-right: 80px;
    cursor: pointer;
    color: #34364D;
    border-radius: 20px;
    font-size: 26px;
    text-align: center;
  }

  .tag-item-active {
    background: #6E70A0;
    color: #fff;
  }
}

</style>
