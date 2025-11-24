<template>
  <el-timeline class="comment-timeline" :reverse="false">
    <el-timeline-item v-for="(activity, index) in commentList" :key="index"
      :timestamp="activity.commentTime.split(' ')[0]" placement="top">
      <el-card>
        <div class="richtext" style="overflow-x: scroll" v-html="activity.content.replace(/\n/g, '<br>')"></div>
        <div class="item-footer">
          {{ activity.commentator }} |
          {{ activity.commentTime }}
        </div>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
export default {
  props: {
    commentList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-timeline {
  padding-left: 0;

  ::v-deep .el-card__body {
    padding: 10px;
  }

  .el-timeline-item:last-child {
    padding-bottom: 0;
  }
}

.item-footer {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

.richtext {

  ::v-deep img {
    width: 100%;
  }

  ::v-deep iframe {
    width: 100%;
  }
}
</style>
