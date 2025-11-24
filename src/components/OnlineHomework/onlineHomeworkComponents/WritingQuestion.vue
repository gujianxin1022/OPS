<!-- question-writing -->
<template>
  <div class="question-writing-container">
    <div class="section-img">
      <div class="row-box" v-if="imgShowType == 'row'">
        <img class="print-img" v-if="myImg" :src="myImg">
        <iframe v-if="myFile" :src="myFile"></iframe>
      </div>
      <div class="column-box" v-if="imgShowType == 'column'">
        <img class="print-img" v-if="myImg" :src="myImg">
        <iframe v-if="myFile" :src="myFile"></iframe>
      </div>
    </div>
    <div>
      <div class="result-pic" v-if="status == 1">
        <div v-for="(i, index) in homeWorkPhotos" :key="index">
          <img :src="i.originUrl">
          <div class="text" @click="openPic(i)">查看大图</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'question-writing',
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      homeWorkPhotos: [],
      imgInfo: {},
      imgShowType: null
    }
  },
  props: {
    myFile: null,
    myImg: null,
    jIndex: null,
    status: null,
    rightAnswer: null,
    studentAnswer: null,
    isFinished: null
  },
  computed: {
    homeWorkPhotosStr() {
      let arr = [];
      this.homeWorkPhotos.forEach(i => {
        arr.push(i.originUrl);
      });
      return arr;
    },
    studentAnswerArr() {
      return this.studentAnswer[0].split(',');
    }
  },
  created() {
    this.getImgInfo();
  },
  mounted() {
    this.homeWorkPhotos = [];
    if (this.studentAnswer && this.studentAnswer.length) {
      this.studentAnswer.forEach(async (i, index) => {
        this.homeWorkPhotos.push({
          originUrl: i,
          uid: index
        });
      });
    }
  },
  methods: {
    printImage() {
      let el = document.querySelector('.column-box img');
      let iframe = document.createElement('IFRAME');
      let doc = null;
      iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
      document.body.appendChild(iframe);
      doc = iframe.contentWindow.document;
      doc.write('<div>' + el.innerHTML + '</div>');
      doc.close();
      let img = $(doc).find("img");
      for(let i = 0; i < img.length; i++) {
          img.eq(i).css("margin", "0 auto");
      }
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      if(navigator.userAgent.indexOf("MSIE") > 0) {
          document.body.removeChild(iframe);
      }
    },
    // 获取图片信息
    getImgInfo() {
      let img = new Image();
      img.src = this.myImg;
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
    },
    //删除文件
    handleRemove(file, fileList) {
      let index = this.homeWorkPhotos.findIndex(
        item => item.uid === file.uid
      );
      this.homeWorkPhotos.splice(index, 1);
    },
    //放大显示
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    openPic(url) {
      window.open(url.originUrl);
    }
  }

}

</script>
<style scoped lang="scss">
* {
  box-sizing: border-box;
}

.question-writing-container {
  padding: 30px 40px;

  .section-img {

    /*横屏展示*/
    .row-box {
      width: 800px;

      img {
        max-width: 100%;
      }

      iframe {
        width: 100%;
        height: 100%;
      }
    }

    /*纵屏展示*/
    .column-box {
      height: 360px;

      img {
        max-height: 100%;
      }

      iframe {
        width: 100%;
        height: 100%;
      }
    }
  }

  .section-upload-box {
    margin-top: 30px;
  }

  .section-upload-img {
    margin-top: 30px;

    .upload-box {
      position: relative;

      .upload-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 120px;
        height: 120px;
        background: red;
        opacity: 0;
        cursor: pointer;
      }

      .upload-btn {
        width: 120px;
        height: 120px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.result-pic {
  margin-top: 50px;
  display: flex;

  img {
    width: 120px;
    height: 120px;
    border-radius: 0px;
    margin-right: 20px;
    margin-bottom: 10px;
  }

  .text {
    width: 120px;
    text-align: center;
    color: #56becd;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
}

</style>
