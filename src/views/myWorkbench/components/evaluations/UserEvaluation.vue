<template>
  <div class="user-evaluation">
    <div class="ue-item">
      <div class="ue-item-title">老师教学表现</div>
      <div class="teacher-info">
        <img class="teacher-avatar" src="https://cdn.lingoace.com/avatar/1924172786/timg_2-1465760232.jpeg" alt="" />
        <div class="teacher-name">
          老师姓名
        </div>
      </div>
      <el-rate class="uv-rate mt-10" :value="3" disabled text-color="#666666">
      </el-rate>
      <div class="mt-16">
        <LocalTag>生动有趣</LocalTag>
      </div>
      <TranslateText class="ue-content mt-16" :text="content" />
    </div>
    <div class="ue-item">
      <div class="ue-item-title">课程内容</div>
      <el-rate class="uv-rate mt-10" :value="4" disabled text-color="#666666">
      </el-rate>
      <div class="mt-16">
        <LocalTag>内容丰富</LocalTag>
      </div>
    </div>
    <div class="divider"></div>
    <div class="ue-item">
      <div class="ue-item-title">用户对老师后续上课的建议</div>
      <div class="mt-16">
        <LocalTag>建议标签1</LocalTag>
        <LocalTag>建议标签2</LocalTag>
        <LocalTag>建议标签3</LocalTag>
      </div>
      <TranslateText class="ue-content mt-16" :text="'更多建议内容'" />
    </div>
  </div>
</template>

<script>
import dayjs from "moment";
import LocalTag from "./LocalTag.vue";
import TranslateText from "@/components/Translator/TranslateText";

export default {
  components: {
    LocalTag,
    TranslateText
  },
  props: {
    // 班级id
    studentInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      translatedContent: "", // 翻译后的内容
      isTranslating: false, // 是否正在翻译
    };
  },
  computed: {
    content() {
      return Math.random() > 0.5 ? "这是一条中文评价" : "This is an English evaluation";
    },
    dateText() {
      return dayjs().format('YYYY-MM-DD');
    },
  },

};
</script>

<style lang="scss" scoped>
.user-evaluation {
  position: relative;
  padding: 0 10px;
  font-size: 14px;
  color: #5D5F7B;
}

.ue-item {
  margin-bottom: 20px;
}

.ue-item-title {
  position: relative;
  font-size: 14px;
  font-weight: bold;
  padding-left: 10px;
  margin-bottom: 10px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 2px;
    width: 4px;
    height: 12px;
    background-color: #7580E5;
    border-radius: 2px;
  }
}

.teacher-info {
  display: flex;
  align-items: center;
  min-width: 200px;
  margin-right: 20px;
}

.teacher-avatar {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.teacher-name {
  margin-left: 10px;
}

.uv-rate {
  width: 152px;
  flex-shrink: 0;

  ::v-deep .el-rate__icon {
    font-size: 24px;
  }

  ::v-deep .el-rate__text {
    margin-left: 10px;
  }
}

.ue-content {
  line-height: 1.5;
}

.divider {
  width: 60%;
  height: 1px;
  background-color: #E8E8F3;
  margin: 15px 0;
}

.mt-10 {
  margin-top: 10px;
}

.mt-16 {
  margin-top: 16px;
}

.mt-20 {
  margin-top: 20px;
}
</style>
