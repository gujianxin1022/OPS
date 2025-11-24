<template>
  <el-dialog
    top="30px"
    :title="info.parentUserName"
    class="poster-dialog"
    :visible.sync="show"
    v-if="info"
    width="780px"
    :before-close="handleClose"
  >
    <div class="poster" v-loading="postList.length !== postArr.length">
      <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide v-for="(src, index) in postList" :key="src">
          <img
            :src="src"
            :style="
              postArr[index].recommendations &&
              postArr[index].recommendations.length
                ? 'float:left;margin-left: 60px;'
                : ''
            "
            alt=""
          />
          <div
            v-if="
              postArr[index].recommendations &&
              postArr[index].recommendations.length
            "
            style="color: #333333"
            class="caption-warp"
          >
            <div class="title">{{ $t("推荐语") }}</div>
            <div class="caption">
              <p
                style="line-height: 20px"
                v-for="item in postArr[index].recommendations"
                :key="item"
              >
                {{ item.content }}
                <el-button
                  style="padding: 0"
                  type="text"
                  @click.stop="handleCopy(item.content)"
                  >{{ $t("复制") }}</el-button
                >
              </p>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-button-prev" slot="button-prev" @click="prev"></div>
        <div class="swiper-button-next" slot="button-next" @click="next"></div>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </el-dialog>
</template>

<script>
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import QRCode from "qrcode";
import { getPostConfig } from "@/api/workBench";
import { mapGetters } from "vuex";
import { copyLink } from "@/utils/file";

export default {
  name: "posterPopUp",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: null,
    },
    lang: {
      type: String,
      default: null,
    },
    loc: {
      type: String,
      default: null,
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  directives: {
    swiper: directive,
  },
  watch: {
    postList(newData) {
      if (newData.length == this.postArr.length) {
        this.$refs.mySwiper.$swiper.init();
      }
    },
  },
  data() {
    return {
      count: 0,
      postArr: [1],
      postList: [],
      swiperOptions: {
        init: false,
        loop: false,
        navigation: {
          prevEl: "swiper-button-prev",
          nextEl: "swiper-button-next",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        on: {
          slideChange: function () {},
        },
      },
    };
  },
  mounted() {
    this.retPostConfig();
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {
    async handleCopy(link) {
      await copyLink(link)
        .then(
          () => {
            this.$notify({
              message: this.$t("复制成功"),
              type: "success",
            });
          },
          () => {
            this.$notify({
              message: this.$t("复制失败"),
              type: "error",
            });
          }
        )
        .finally(() => {});
    },
    async retPostConfig() {
      const subjectTypeMap = {
        zh: 0,
        en: 1,
        ma: 2,
        mu: 3,
      };
      const params = {
        userdata: {
          userId: this.info.parentUserId,
        },
        loc: this.loc,
        context: {
          area: "",
          ug: "",
          lp: "",
          lan: this.currentLang,
          appversion: "3.20.16",
          tag: "",
        },
        campaign_code: "GXHPOSTER",
        preview_img_resouce_id: 0,
        subject: this.lang,
        subject_type: subjectTypeMap[this.lang],
      };
      const res = await getPostConfig(params);
      if (res.data.code !== 200) {
        this.postList = [
          "data:image/png;base64,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",
        ];
        return Promise.reject();
      }
      this.postArr = Object.values(res.data.data || {}) || [];
      // todo
      this.postArr.forEach((e) => {
        e.recommendations = Object.values(e.recommend_text_list || {});
      });
      if (this.postArr.length) {
        this.createPostImg(this.postArr);
      }
    },
    qrCodeCreated(referrerUrl) {
      return new Promise((resolve) => {
        QRCode.toDataURL(referrerUrl)
          .then((imageBase64) => {
            let qrCode = new Image();
            qrCode.src = imageBase64;
            qrCode.setAttribute("crossOrigin", "Anonymous");
            qrCode.onload = () => {
              resolve(qrCode);
            };
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    async createPostImg() {
      let postArr = JSON.parse(JSON.stringify(this.postArr));
      postArr.forEach(async (item, index) => {
        let qrcode = await this.qrCodeCreated(item.qrcode_url);
        if (qrcode) {
          let img = new Image();
          img.src = item.content;
          img.crossOrigin = "Anonymous";
          item.qrcode_img = qrcode;
          img.onload = () => {
            this.drawAndShareImage(item, img, index);
          };
        }
      });
    },
    drawAndShareImage(post, postEle, index) {
      let canvas = document.createElement("canvas");
      canvas.width = postEle.width;
      canvas.height = 1332;
      let context = canvas.getContext("2d");
      /* 绘制海报背景 */
      context.drawImage(postEle, 0, 0, postEle.width, postEle.height);
      context.fillRect(0, postEle.height, postEle.width, 1332 - postEle.height);
      /* 绘制海报二维码 */
      context.drawImage(
        post.qrcode_img,
        post.attrs.qrcode_left,
        post.attrs.qrcode_top,
        post.attrs.qrcode_width,
        post.attrs.qrcode_height
      );
      /* 绘制海报id */
      context.fillStyle = `rgb(${post.attrs.watermark_color})`;
      context.font = `400 ${post.attrs.watermark_font_size}px PingFang SC`;
      context.fillText(
        `ID:${post.watermark_txt}`,
        post.attrs.watermark_left,
        post.attrs.watermark_top
      );
      let base64 = canvas.toDataURL("image/png");
      this.$set(this.postList, index, base64);
    },
    handleClose() {
      this.$emit("handleClose");
    },
    prev() {
      this.$refs.mySwiper.$swiper.slidePrev();
    },
    next() {
      this.$refs.mySwiper.$swiper.slideNext();
    },
  },
};
</script>
<style scoped lang="scss">
.poster-dialog {
  .poster {
    height: 560px;
  }
  .swiper-container {
    .swiper-slide {
      text-align: center;
      img {
        width: 300px;
      }
      .caption-warp {
        float: left;
        margin-left: 20px;
        .title {
          text-align: left;
        }
        .caption {
          width: 300px;
          text-align: left;
          overflow: scroll;
          height: 517px;
        }
      }
    }
  }
}
</style>
