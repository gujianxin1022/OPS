<template>
  <div class="printJob">
    <div
      class="rotation"
      v-loading="printJobLoading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="加载中"
      element-loading-background="rgba(20, 34, 58, 0.8)"
    >
      <template v-if="homeworkEva.length">
        <section class="imgswiper">
          <el-carousel height="100%" :autoplay="false">
            <el-carousel-item v-for="(item, key) in imgList" :key="item.url">
              <div v-if="item.type === 'img'" class="imgBox">
                <img class="imgs" :src="item.url" />
                <!-- <span class="imgNum">{{++key}}/{{imgList.length}}</span> -->
              </div>
              <div v-else-if="item.type === 'pdf'" class="imgBox">
                <el-link @click="goRead(item)">{{$t('点击跳转阅览PDF')}}</el-link>
              </div>
              <div v-else-if="item.type === 'video'" class="imgBox">
                <Aliplayer
                  :url="item.url"
                  :id="'player-con'+key" 
                  @onVideoEnded="videoEnded"
                />
              </div>
              <div v-else class="imgBox">
                <img class="imgs" src="@/assets/unknow.png" />
              </div>
            </el-carousel-item>
          </el-carousel>
        </section>
        <Evaluation
          :studentInfo="studentInfo"
          :msgForm="msgForm"
        />
      </template>
      <div v-else class="noData">
        {{$t('No Assignment Yet')}}
      </div>
    </div>
  </div>
</template>

<script>
import Aliplayer from './Aliplayer.vue';
import Evaluation from './evaluation.vue';

export default {
  components: {Aliplayer, Evaluation},
  props: {
    homeworkType: {type: Number, default: -1},
    currentLang: {type: String, default: ''},
    studentInfo: {type: Object, default: () => ({})},
  },
  data() {
    return {
      homeworkEva: {},
      imgList: [],
      msgForm: {},
      printJobLoading: false,
      videoEndedFalg:[],
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    videoEnded(value){
      this.videoEndedFalg.push(value);
    },
    initData() {
      this.printJobLoading = true;
      let {
        lessonId,
        virtualClassId,
        studentUserId,
        classTypeId,
      } = this.$route.query;
      this.$Api.studentManagement.homeworkInfo(
        +virtualClassId,
        +studentUserId,
        +classTypeId,
        +lessonId,
        this.homeworkType
      ).then(({ status, data: {code, data} }) => {
        if (code === 200) {
          if (!data.classroomVirtualclassHomeworkAttachmentList) return;
          const imageFormat = ["jpg", "png", "jpeg", "heic","gif", "bmp", "webp"];
          const videoFormat = ["mp4","mov","m4v"];
          const attachmentType = (attachment) =>{
            const path = attachment.split('?')[0];
            const pathAndExt = path.split(".");
            // 现有数据 File ext 存在大写情况（ 比如: PNG）, 这里需要调用 .toLowerCase()
            return pathAndExt[pathAndExt.length - 1].toLowerCase() || "none";        
          }
          this.homeworkEva = data?.homeworkTeacherAttachments && data?.homeworkTeacherAttachments.length 
            ? data?.homeworkTeacherAttachments
            : data?.classroomVirtualclassHomeworkAttachmentList;

          this.homeworkEva.forEach(item => {
             if (item.attachmentType !== 1) {  // 1: 文本不需要展示， 2: 是pdf，图片，视频等文件  
              if (item.attachment.indexOf(".pdf") != -1) {
                this.imgList.push({
                  type: 'pdf',
                  url: item.attachment
                })
              } else if (imageFormat.includes(attachmentType(item.attachment))) {
                this.imgList.push({
                  type: 'img',
                  url: item.attachment
                });
              } else if (videoFormat.includes(attachmentType(item.attachment))) {
                this.imgList.push({
                  type: 'video',
                  url: item.attachment
                });
              } 
              else {
                this.imgList.push({
                  type: 'none',
                });
              }
            }
          });
          this.msgForm = {
            score: data?.classroomVirtualclassHomeworkResult?.score ?? 0,
            commentEn: data?.classroomVirtualclassHomeworkResult?.commentEn ?? '',
            commentZh: data?.classroomVirtualclassHomeworkResult?.commentZh ?? '',
            updateTime:  data?.classroomVirtualclassHomeworkResult?.createTime,
          }
        } else {
          this.homeworkEva = {};
          this.imgList = [];
          this.msgForm = {};
        }
      }).finally(() => this.printJobLoading = false);
    },
    goRead(item) {
      window.open(item.url, '__blank');
    },
  },
}
</script>

<style lang="scss" scoped>
.printJob {
  width: 100%;
  .rotation {
    display: flex;
    // margin: 10px 0 0;
    .imgswiper {
      flex: 1;
      min-height: 550px;
      .imgBox {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .imgs {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }
      .imgNum {
        position: absolute;
        bottom: 20px;
        width: 50px;
        padding: 5px;
        color: #fff;
        text-align: center;
        background: rgba(65, 64, 64, .5);
        border-radius: 20px;
      }
    }
  }
}
.noData {
  padding: 20px;
}
dl {
  font-size: 14px;
  dd {
    margin: 0 0 0 15px;
  }
}
::v-deep .el-carousel {
  height: calc(100vh - 200px);
  min-height: 550px;
  .el-carousel__item {
    background: rgba($color: #000000, $alpha: .2);
  }
  .el-carousel__arrow {
    background: rgba($color: #000000, $alpha: .4);
  }
}
</style>
