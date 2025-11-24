<!-- question-matching -->
<template>
  <div class="line-container mb20">
    <span style="font-size: 26px; color: #34364d;">{{index+1}}.</span>
    <div style="padding-left: 20px;">
      <div class="groupA" v-if="groupAType != 'text'">
        <div v-for="(q,qIndex) in question.groupA" :key="qIndex">
          <div class="item" :class="{'item-active': currentItem == q}">
            <span v-html="q.name"></span> 
            <div class="hw-no-work" v-if="!drawLineCompleted[qIndex] && renderComplete && drawComplete">[未做]</div>
          </div>
        </div>
      </div>
      <div class="groupA groupA-img" v-else>
        <div v-for="(q,qIndex) in question.groupA" :key="qIndex">
          <div class="item img-item" :class="{'img-item-active': currentItem == q}">
            <img v-if="q" :src="q.imgUrl">
            <div class="hw-no-work" v-if="!drawLineCompleted[qIndex] && renderComplete && drawComplete">[未做]</div>
          </div>
        </div>
      </div>
      <div>
        <canvas :id="'canvasLine' + iIndex + jIndex"></canvas>
      </div>
      <div class="groupB" v-if="groupBType != 'text'">
        <div v-for="(q, i) in question.groupB" :key="i">
          <div class="item" :class="{'item-active': currentItem == q}" v-html="q.name">
          </div>
        </div>
      </div>
      <div class="groupB groupB-img" v-else>
        <div v-for="(q, i) in question.groupB" :key="i">
          <div class="item img-item" :class="{'img-item-active': currentItem == q}">
            <img v-if="q" :src="q.imgUrl">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'question-matching',
  data() {
    return {
      groupAType: 'text',
      groupBType: 'text',
      // 存放canvas线条组
      canvasLineGroup: [],
      // 存放当前高亮项
      currentItem: null,
      // 存放题目
      question: {
        groupA: [],
        groupB: []
      },
      // 检查是否连接
      drawLineCompleted: [false, false, false, false],
      drawComplete: false
    }
  },

  props: {
    content: {},
    iIndex: null,
    jIndex: null,
    status: null,
    rightAnswer: null,
    studentAnswer: null,
    isFinished: null,
    data: null,
    index: null
  },

  computed: {
    outputValue() {
      let arr = [];
      this.canvasLineGroup.forEach(i => {
        arr.push({
          head: i[0].name,
          tail: i[1].name,
          headImage: i[0].imgUrl,
          tailImage: i[1].imgUrl
        });
      });
      return arr;
    },
 
    renderComplete() {
      return (this.question.groupA.length == this.data.contentJson.head.length && this.question.groupB.length == this.data.contentJson.tail.length && this.data.contentJson.head.length > 0 && this.data.contentJson.tail.length > 0)
    }
  },

  created() {

  },

  mounted() {
    this.initData();
  },

  methods: {

    // 将图片变为base64
    changeImageData(i, index, headOrTail, headOrTailImage, windowGroupType, groupName, questionGroup) {
      let item1 = i;
      if (windowGroupType === 'text') {
        item1['originImage'] = item1[headOrTailImage].toString()
      }
      let item = {};
      item.id = index + (headOrTail === 'head' ? 1 : 5);
      item.name = item1[headOrTail];
      item.imgUrl = item1[headOrTailImage];
      item.group = groupName;
      item.coordinate = {
        x: index * 210 + 85,
        y: headOrTail === 'head' ? 0 : 100
      }
      this.$set(this.question[questionGroup], index, item)

      if (this.renderComplete) {
        if (this.studentAnswer) {
          this.question.groupA.forEach((i, iIndex) => {
            this.question.groupB.forEach((j, jIndex) => {
              this.studentAnswer.forEach((k, kIndex) => {
                if (i.name == k.head && i.imgUrl == k.headImage && j.name == k.tail && j.imgUrl == k.tailImage) {
                  let arr = [];
                  arr.push(i);
                  arr.push(j);
                  this.canvasLineGroup.push(arr);
                }
              })
            })
          });
          setTimeout(() => {
            this.drawLine();
          }, 1000);
        }
      }
    },

    // 处理初始数据
    initData() {
      if (this.data.contentJson.head[0].head) {
        this.groupAType = 'image'
      }
      if (this.data.contentJson.tail[0].tail) {
        this.groupBType = 'image'
      }
      this.data.contentJson.head.forEach(async (i, index) => {
        let item = i,
          itemIndex = index;
        this.changeImageData(item, itemIndex, 'head', 'headImage', this.groupAType, 'A', 'groupA')
      });
      this.data.contentJson.tail.forEach((i, index) => {
        let item = i,
          itemIndex = index;
        this.changeImageData(item, itemIndex, 'tail', 'tailImage', this.groupBType, 'B', 'groupB')
      });
    },

    onClickItem(q) {
      // 之前没有选中状态
      if (!this.currentItem) {
        this.currentItem = q;
      } else {
        // 如果同组替换 || 如果不同组就连线
        if (this.currentItem.group == q.group) {
          this.currentItem = q;
        } else {
          let arr = [];
          if (this.currentItem.group == 'A') {
            arr[0] = this.currentItem;
            arr[1] = q;
          } else {
            arr[0] = q;
            arr[1] = this.currentItem;
          }
          this.checkedLineStatus(this.currentItem.id);
          this.checkedLineStatus(q.id);
          this.canvasLineGroup.push(arr);
          this.drawLine();
          this.currentItem = null;
        }
      }
    },

    // 划线
    drawLine() {
      // 拿到canvas
      let targetCanvas = document.getElementById('canvasLine' + this.iIndex + this.jIndex);
      if (!targetCanvas) return;
      // 设置宽高
      targetCanvas.width = 720;
      targetCanvas.height = 100;
      // 拿到上下文
      let context = targetCanvas.getContext('2d');
      // 设置线条的宽度
      context.lineWidth = 4;
      // 绘制直线
      if (!this.isFinished) {
        context.beginPath();
        this.canvasLineGroup.forEach(item => {
          context.strokeStyle = '#6E70A0';
          context.moveTo(item[0].coordinate.x, item[0].coordinate.y);
          context.lineTo(item[1].coordinate.x, item[1].coordinate.y);
        });
        context.closePath();
        context.stroke();
      } else {
        // 设置颜色
        let lineArray = []
        this.canvasLineGroup.forEach((item, iIndex) => {
          lineArray.push(false);
          this.rightAnswer.forEach(jItem => {
            if (jItem.head == item[0].name && jItem.headImage == item[0].imgUrl && jItem.tail == item[1].name && jItem.tailImage == item[1].imgUrl) {
              lineArray[iIndex] = true;
            }
          });
        });

        lineArray.forEach((q, qIndex) => {
          if (q) {
            context.beginPath();
            context.strokeStyle = '#56becd';
            context.moveTo(this.canvasLineGroup[qIndex][0].coordinate.x, this.canvasLineGroup[qIndex][0].coordinate.y);
            context.lineTo(this.canvasLineGroup[qIndex][1].coordinate.x, this.canvasLineGroup[qIndex][1].coordinate.y);
            context.closePath();
            context.stroke();
          } else {
            context.beginPath();
            context.strokeStyle = '#eb532f';
            context.moveTo(this.canvasLineGroup[qIndex][0].coordinate.x, this.canvasLineGroup[qIndex][0].coordinate.y);
            context.lineTo(this.canvasLineGroup[qIndex][1].coordinate.x, this.canvasLineGroup[qIndex][1].coordinate.y);
            context.closePath();
            context.stroke();
          }
        });
      }

      this.canvasLineGroup.forEach(i => {
        if (i[0].coordinate.x == 85) {
          this.$set(this.drawLineCompleted, 0, true);
        } else if (i[0].coordinate.x == 295) {
          this.$set(this.drawLineCompleted, 1, true);
        } else if (i[0].coordinate.x == 505) {
          this.$set(this.drawLineCompleted, 2, true);
        } else if (i[0].coordinate.x == 715) {
          this.$set(this.drawLineCompleted, 3, true);
        }
      });

      this.drawComplete = true;
    },

    // 检查是否已经连线了
    checkedLineStatus(targetId) {
      let arr = [];
      this.canvasLineGroup.map((i, index) => {
        if (targetId != i[0].id && targetId != i[1].id) {
          arr.push(i);
        }
      });
      this.canvasLineGroup = arr;
    }
  }

}

</script>
<style scoped lang="scss">
#canvasLine {
  width: 720px;
  height: 100px;
  display: block;
}

.groupA,
.groupB {
  display: flex;

  .item {
    box-sizing: border-box;
    width: 136px;
    height: 100%;
    line-height: 40px;
    background: #f4f4f4;
    color: #fff;
    text-align: center;
    margin-right: 80px;
    /*border-radius: 6px;*/
    cursor: pointer;
    color: #34364D;
    border-radius: 20px;
    font-size: 26px;
    text-align: center;
    position: relative;

    .hw-no-work {
      position: absolute;
      top: 0px;
      left: 125px;
      width: 88px;
      color: #eb532f;
    }

    &.img-item {
      height: 136px;
    }
  }

  .item-active {
    background: #6E70A0;
    color: #fff;
  }
}

.groupA-img,
.groupB-img {
  // width: 120px;
  // height: 120px;
  // border: 1px solid #B2B2B2;
  border-radius: 0;

  img {
    display: block;
    width: 100%;
    height: 100%;
    vertical-align: top;
  }
}

.img-item-active {
  border: 3px solid #6E70A0;
  border-radius: 0 !important;
  box-sizing: content-box !important;
}

</style>
