<template>
  <div class="onlineJob">
    <div
      v-loading="onlineJobLoading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="加载中"
      element-loading-background="rgba(20, 34, 58, 0.8)"
    >
      <div class="contentBox" v-if="JSON.stringify(homeworkResult) !== '{}' && studentHomeworkOnline.length">
        <section class="onlinehomwork">
          <Onlinehomework :ouline="studentHomeworkOnline"/>
        </section>
        <Evaluation
          :studentInfo="studentInfo"
          :msgForm="msgForm"
        />
      </div>
      <div v-else class="noData">
        {{$t('No Assignment Yet')}}
      </div>
    </div>
  </div>
</template>

<script>
import Onlinehomework from "@/components/OnlineHomework/OnlineHomework.vue";
import Evaluation from './evaluation.vue';

export default {
  components: {Onlinehomework, Evaluation},
  props: {
    homeworkType: {type: Number, default: -1},
    studentInfo: {type: Object, default: () => ({})},
  },
  data() {
    return {
      onlineJobLoading: false,
      homeworkResult: {},
      studentHomeworkOnline: [],
      msgForm: {},
    }
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      let {
        lessonId,
        virtualClassId,
        studentUserId,
        classTypeId,
      } = this.$route.query;
      this.onlineJobLoading = true;
      await this.$Api.studentManagement.homeworkInfo(
        +virtualClassId,
        +studentUserId,
        +classTypeId,
        +lessonId,
        this.homeworkType
      ).then(({ status, data: {code, data} }) => {
        if (code === 200) {
          if (!data?.onlineHomework?.questions) return;
          data.onlineHomework.questions.forEach((item) => {
              if (item.type == 3) {
                item.childList.forEach((j) => {
                  j.contentJson.head = j.contentJson.head.filter(
                    (headItem) => !(!headItem.head && !headItem.headImage)
                  );
                  j.contentJson.tail = j.contentJson.tail.filter(
                    (tailItem) => !(!tailItem.tail && !tailItem.tailImage)
                  );
                  j.answer0 = j.answer0.filter(
                    (item) =>
                      !(
                        !item.head &&
                        !item.headImage &&
                        !item.tail &&
                        !item.tailImage
                      )
                  );
                });
              }
          });
          this.homeworkResult = data.classroomVirtualclassHomeworkResult ?? {};
          this.studentHomeworkOnline = data.onlineHomework.questions;
          this.msgForm = {
            score: data?.classroomVirtualclassHomeworkResult?.score ?? 0,
            commentEn: data?.classroomVirtualclassHomeworkResult?.commentEn ?? '',
            commentZh: data?.classroomVirtualclassHomeworkResult?.commentZh ?? '',
            updateTime:  data?.classroomVirtualclassHomeworkResult?.createTime,
          }
        }
      })
      .finally(() => this.onlineJobLoading = false);
    },
  },
}
</script>

<style lang="scss" scoped>
.onlineJob {
  width: 100%;
  .contentBox {
    display: flex;
    .onlinehomwork {
      flex: 1;
    }
  }
  .noData {
    padding: 20px;
  }
}

ul {
  margin: 0;
  padding: 0;

  li {
      list-style: none;
  }
}

p {
  margin: 0
}
</style>
