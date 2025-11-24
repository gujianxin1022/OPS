<!-- question-matching -->
<template>
  <div class="line-container mb20">
    <div style="padding-left: 20px;">
      <div class="groupA" v-if="groupAType != 'text'">
        <div v-for="(q, i) in question.groupA" :key="i">
          <div class="item" :class="{'item-active': currentItem == q}" v-html="q.name">
          </div>
        </div>
      </div>
      <div class="groupA groupA-img" v-else>
        <div v-for="(q, i) in question.groupA" :key="i">
          <div class="item img-item" :class="{'img-item-active': currentItem == q}">
            <img v-if="q" :src="q.imgUrl">
          </div>
        </div>
      </div>
      <div>
        <canvas :id="'canvasLine2' + iIndex + jIndex"></canvas>
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
    }
  },

  props: {
    content: {},
    iIndex: null,
    jIndex: null,
    status: null,
    rightAnswer: null,
    studentAnswer: null,
    isFinished: null
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
      return (this.question.groupA.length == this.content.head.length && this.question.groupB.length == this.content.tail.length && this.content.head.length > 0 && this.content.tail.length > 0)
    }
  },

  created() {

  },

  mounted() {
    this.initData();
    // if (this.rightAnswer) {
    //   this.question.groupA.forEach((i, iIndex) => {
    //     this.question.groupB.forEach((j, jIndex) => {
    //       this.rightAnswer.forEach((k, kIndex) => {
    //         if (i.name == k.head && i.imgUrl == k.headImage && j.name == k.tail && j.imgUrl == k.tailImage) {
    //           let arr = [];
    //           arr.push(i);
    //           arr.push(j);
    //           this.canvasLineGroup.push(arr);
    //           this.drawLine();
    //         }
    //       })
    //     })
    //   })
    // }
  },

  methods: {

    // 将图片变为base64
    async changeImageData(i, index, headOrTail, headOrTailImage, windowGroupType, groupName, questionGroup) {
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
        if (this.rightAnswer) {
          this.question.groupA.forEach((i, iIndex) => {
            this.question.groupB.forEach((j, jIndex) => {
              this.rightAnswer.forEach((k, kIndex) => {
                if (i.name == k.head && i.imgUrl == k.headImage && j.name == k.tail && j.imgUrl == k.tailImage) {
                  let arr = [];
                  arr.push(i);
                  arr.push(j);
                  this.canvasLineGroup.push(arr);
                  this.drawLine();
                }
              })
            })
          })
        }
      }
    },

    // 处理初始数据
    initData() {
      if (this.content.head[0].head) {
        this.groupAType = 'image'
      }
      if (this.content.tail[0].tail) {
        this.groupBType = 'image'
      }
      this.content.head.forEach(async (i, index) => {
        let item = i,
          itemIndex = index;
        this.changeImageData(item, itemIndex, 'head', 'headImage', this.groupAType, 'A', 'groupA')
      });
      this.content.tail.forEach((i, index) => {
        let item = i,
          itemIndex = index;
        this.changeImageData(item, itemIndex, 'tail', 'tailImage', this.groupBType, 'B', 'groupB')
      });
      // this.content.head.map((i, index) => {
      //   let item = {};
      //   item.id = index + 1;
      //   item.name = i.head;
      //   item.imgUrl = i.headImage;
      //   item.group = 'A';
      //   item.coordinate = {
      //     x: index * 200 + 60,
      //     y: 0
      //   }
      //   this.question.groupA.push(item);
      // });
      // this.content.tail.map((i, index) => {
      //   let item = {};
      //   item.id = index + 5;
      //   item.name = i.tail;
      //   item.imgUrl = i.tailImage;
      //   item.group = 'B';
      //   item.coordinate = {
      //     x: index * 200 + 60,
      //     y: 100
      //   }
      //   this.question.groupB.push(item);
      // });
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
          arr[0] = this.currentItem;
          arr[1] = q;
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
      let targetCanvas = document.getElementById('canvasLine2' + this.iIndex + this.jIndex);
      // 设置宽高
      targetCanvas.width = 720;
      targetCanvas.height = 100;
      // 拿到上下文
      let context = targetCanvas.getContext('2d');
      // 设置颜色
      context.strokeStyle = '#56becd';
      // 设置线条的宽度
      context.lineWidth = 4;
      // 绘制直线
      context.beginPath();
      this.canvasLineGroup.forEach(item => {
        context.moveTo(item[0].coordinate.x, item[0].coordinate.y);
        context.lineTo(item[1].coordinate.x, item[1].coordinate.y);
      });

      context.closePath();
      context.stroke();
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
    line-height: 40px !important;
    background: #f4f4f4;
    color: #fff;
    line-height: 40px;
    text-align: center;
    margin-right: 80px;
    /*border-radius: 6px;*/
    cursor: pointer;
    color: #34364D;
    border-radius: 20px;
    font-size: 26px;
    text-align: center;

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
  border-radius: 0;

  &.img-item-active {
    border: 2px solid #6E70A0;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    vertical-align: top;
  }
}

</style>
