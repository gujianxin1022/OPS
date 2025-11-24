<template>
  <div>
    <span style="font-size: 14px; color: #909399">
          {{ data.parentUserId ? $t("checkDeviceTip") : $t("checkTeacherDeviceTip") }}
    </span>
    <div class="homepage-container">
    
      <el-button
        style="float: right; z-index: 10; position: relative"
        @click="copyImage"
        type="primary"
        plain
        >{{ $t("复制图片") }}
      </el-button>

      <el-radio-group v-model="activeSubject" @change="onSubjectChange">
        <el-radio-button :label="LANG_TYPE.CHINESE"
          >{{ $t("中文") }}
        </el-radio-button>
        <el-radio-button :label="LANG_TYPE.ENGLISH"
          >{{ $t("英文") }}
        </el-radio-button>
        <el-radio-button v-if="data.parentUserId" :label="LANG_TYPE.FRIENCH"
          >{{ $t("法语") }}
        </el-radio-button>
      </el-radio-group>

      <p>
          <img :src="picUrl" width="741" id="img_body">
      </p>
      <!-- <span><img src="@/assets/homepage/emoji.png" width="229" height="256"></span> -->
    </div>
  </div>
</template>

<script>

const LANG_TYPE= {
  CHINESE: 0,
  ENGLISH: 1,
  FRIENCH: 2,

};

export default {
  name: 'homepage',
  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  data() {
    let picUrl = require("@/assets/students/device_check_zh.png");
    if (this.data.userId) {
      picUrl = require("@/assets/teacher/device_check_zh.png");
    }

    return {
      dialogVisible: false,
      LANG_TYPE,
      activeSubject: "0",
      // picUrlArr: ["@/assets/students/device_check_zh.png", "@/assets/students/device_check_en.png", "@/assets/students/device_check_fr.png"],
      picUrl: picUrl,
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    async copyImage() {
      var _this = this
      const img = document.querySelector('#img_body')
      const setToClipboard =  blob => {
        const data = [new ClipboardItem({ [blob.type]: blob })]
        return navigator.clipboard.write(data)
      }
      try {
          const response = await fetch(img.src)
          const blob =  await response.blob()
        setToClipboard(blob)
          _this.$message({
              message: '复制成功',
              type: 'success'
          })
      } catch (error) {
          _this.$message({
              message: '复制失败',
              type: 'error'
          })
      }
    },
    onSubjectChange() {

      this.picUrl = this.data.userId ? require("@/assets/teacher/device_check_zh.png") : require('@/assets/students/device_check_zh.png');

      if (this.activeSubject == LANG_TYPE.ENGLISH) {
        this.picUrl = this.data.userId ? require('@/assets/teacher/device_check_en.png') : require('@/assets/students/device_check_en.png');
      }
      else if (this.activeSubject == LANG_TYPE.FRIENCH) {
        this.picUrl = require('@/assets/students/device_check_fr.png');
      }

    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .homepage-container {
    width: 100%;
    margin: 0 auto;
    padding: 20px 20px;
    position: relative;
    p {
        text-align: center;
    }
    span {
        display: block;
        position: absolute;
        right: 20px;
        bottom: -3px;
        
    }
  }
</style>