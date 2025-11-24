<template>
  <div class="choice-question">
    <div class="question">
      <span style="font-size: 26px; color: #34364d;">{{index+1}}.</span> <span style="font-size: 26px; color: #34364d;" v-html="data.questionText"></span><span class="hw-no-work" v-if="status == 0"> [未做]</span>
    </div>
    <div class="options mb20">
      <div class="section-img ml40" v-if="data.questionImage">
        <div class="row-box" v-if="imgShowType == 'row'">
          <img :src="data.questionImage">
        </div>
        <div class="column-box" v-if="imgShowType == 'column'">
          <img :src="data.questionImage">
        </div>
      </div>
    </div>
    <div class="options-container">
      <div class="item-box" v-for="(i,iIndex) in data.contentJson" :key="iIndex">
        <div class="item" :style="{'width': splitChineseWord(i.answer).length > 10 ? '100%' : '50%'}" v-if="!i.answerImage">
          <div class="right-icon" v-if="data.answer0[0].answer == i.answer && data.answer0[0].answerImage == i.answerImage">
            <img class="img" src="@/assets/homework/right.png">
          </div>
          <div class="wrong-icon" v-if="status == 2 && data.answer1[0].answer == i.answer && data.answer1[0].answerImage == i.answerImage">
            <img class="img" src="@/assets/homework/wrong.png">
          </div>
          <div class="s-letter" :class="{'s-letter-right': data.answer0[0].answer == i.answer && data.answer0[0].answerImage == i.answerImage, 's-letter-wrong': status == 2 && data.answer1[0].answer == i.answer && data.answer1[0].answerImage == i.answerImage}">{{i.letter}}</div>
          <div class="s-content" v-html="i.answer"></div>
        </div>
        <!-- 选项带图片 -->
        <div class="item item-img" v-else>
          <div class="right-icon" v-if="data.answer0[0].answer == i.answer && data.answer0[0].answerImage == i.answerImage">
            <img class="img" src="@/assets/homework/right.png">
          </div>
          <div class="wrong-icon" v-if="status == 2 && data.answer1[0].answer == i.answer && data.answer1[0].answerImage == i.answerImage">
            <img class="img" src="@/assets/homework/wrong.png">
          </div>
          <div class="s-letter" :class="{'s-letter-right': data.answer0[0].answer == i.answer && data.answer0[0].answerImage == i.answerImage, 's-letter-wrong': status == 2 && data.answer1[0].answer == i.answer && data.answer1[0].answerImage == i.answerImage}">{{i.letter}}</div>
          <div class="s-img">
            <img :src="i.answerImage">
            <span v-if="i.answer" class="item-img-content" v-html="i.answer"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { splitChineseWord } from '@/utils/homework_fun.js';
export default {
  props: ['data', 'index', 'status'],
  data() {
    return {
      imgInfo: {},
      imgShowType: null
    }
  },
  created() {
    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    this.data.contentJson.map((k, kIndex) => {
      this.$set(k, 'letter', letters[kIndex]);
    });
    if (this.data.questionImage) this.getImgInfo()
  },
  methods: {
    splitChineseWord,
    // 获取图片信息
    getImgInfo() {
      let img = new Image();
      img.src = this.data.questionImage;
      const vm = this;
      img.onload = function() {
        vm.$set(vm.imgInfo, 'width', img.width);
        vm.$set(vm.imgInfo, 'height', img.height);
      }
      this.imgType();
    },
    // 判断图片横竖展示   
    // 竖着 column 横着 row
    imgType() {
      this.imgShowType = this.imgInfo.width / this.imgInfo.height >= 800 / 360 ? 'row' : 'column';
    }
  }
}
</script>

<style lang="scss" scoped>
.choice-question {
  .question {
    margin-bottom: 19px;
    .hw-no-work {
      color: #EB532F;
      font-size: 26px;
    }
  }
  .options-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    font-size: 26px;

    .item-box {
      min-height: 28px;
      width: 50%;
    }

    .item {
      position: relative;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      // min-height: 28px;
      // width: 50%;
      margin-bottom: 20px;
      padding-left: 40px;
      cursor: pointer;
      color: #34364D;
      box-sizing: border-box;

      .s-letter {
        height: 36px;
        width: 36px;
        background: #f4f4f4;
        border-radius: 50%;
        text-align: center;
        line-height: 36px;
        margin-right: 10px;
        flex-shrink: 0;

        &.s-letter-select {
          background: #6E70A0;
          color: #fff;
        }

        &.s-letter-right {
          background: #56BECD;
          color: #fff;
        }

        &.s-letter-wrong {
          background: #EB532F;
          color: #fff;
        }
      }

      .right-icon,
      .wrong-icon {
        position: absolute;
        left: 0;

        .img {
          width: 28px;
          height: 28px;
          border: 0px;
        }
      }

      .s-content {
        font-size: 26px;
        line-height: 36px;
      }
    }

    .item-img {
      height: 120px;

      .item-img-content {
        position: absolute;
        top: 50px;
        left: 220px;
      }

      img {
        width: 120px;
        height: 120px;
        border: 1px solid #bababa;
      }

      .right-icon,
      .wrong-icon {
        position: absolute;
        top: 46px;
        left: 0;

        .img {
          width: 28px;
          height: 28px;
          border: 0px;
        }
      }
    }
  }
  .options {
    /*顶部的题干图片*/
    .section-img {
      margin-bottom: 20px;
      margin-left: 40px;

      /*横屏展示*/
      .row-box {
        max-width: 800px;

        img {
          width: 100%;
        }
      }

      /*纵屏展示*/
      .column-box {
        max-height: 360px;

        img {
          height: 100%;
        }
      }
    }
  }
}
</style>