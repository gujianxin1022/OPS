<template>
  <div class="calss-room-log-warp" v-loading="loading">
    <div class="log" v-if="classroomList.length">
      <div
        class="classroom"
        v-for="(classroom, no) in classroomList"
        :key="classroom.roomId"
      >
        <p>
          {{ $t("教室") }}{{ no + 1 }}:
          {{ $t(fieldMap.platformStatus[classroom.platformId]) }}
        </p>
        <el-timeline>
          <el-timeline-item
            v-for="(event, index) in classroom.roomEventList"
            :key="event.eventTime"
            :timestamp="DateTimeUtils.dateClockTime(event.eventTime)"
          >
            {{ event.studentName || fieldMap.userRoleStatus[event.userRole] }}
            {{ fieldMap.eventTypeStatus[event.eventType] }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <Empty v-else />
  </div>
</template>

<script>
import {
  watch,
  onMounted,
  ref,
  computed,
  reactive,
} from "@vue/composition-api";
import Empty from "@/components/Empty.vue";

export default {
  props: {
    classTypeId: {
      type: Number,
      default: -1,
    },
    virtualclassId: {
      type: String,
      default: "",
    },
  },
  components: { Empty },
  setup(props, { root, emit }) {
    const classroomList = ref([]);
    const loading = ref(false);
    const reqList = async () => {
      loading.value = true;
      try {
        classroomList.value =
          (await root.$Api.groupManagement.getClassroomLog(
            props.classTypeId,
            props.virtualclassId
          )) || [];
      } finally {
        loading.value = false;
      }
    };
    const fieldMap = reactive({
      platformStatus: {
        1: root.$t("拓课云"),
        2: root.$t("百家云"),
        3: root.$t("LingoAce"),
      },
      eventTypeStatus: {
        0: root.$t("退出教室"),
        1: root.$t("进入教室"),
        2: root.$t("上课"),
        3: root.$t("下课"),
      },
      userRoleStatus: {
        0: root.$t("老师"),
        1: root.$t("学生"),
      },
    });

    onMounted(() => {
      reqList();
    });
    return {
      loading,
      classroomList,
      fieldMap,
    };
  },
};
</script>
<style lang="scss" scoped>
.calss-room-log-warp {
  height: 500px;
  overflow: scroll;
  .log {
    height: 1000px;
  }
}
</style>
