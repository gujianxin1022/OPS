<template>
  <div>
    <el-button @click="handleClick" type="text">{{ $t("单元报告") }}</el-button>
  </div>
</template>

<script>
// import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import { JudgeNewAndOld } from "@/api/unitReportManagement/";

export default {
  props: {
    unitReportId: {
      type: Number,
      default: null,
    },
    unitReportStatus: {
      type: Number,
      default: null,
    },
  },
  setup(props, { root, emit, refs }) {
    const handleClick = async () => {
      if (!props.unitReportId) {
        root.$notify({
          type: "warning",
          message: root.$t("没有可查看的单元报告"),
        });
        return;
      }
      if (
        props.unitReportId &&
        props.unitReportStatus &&
        props.unitReportStatus != 0
      ) {
        const {
          status,
          data: { code, data },
        } = await JudgeNewAndOld(props.unitReportId);
        if (status !== 200 && code !== 200) return Promise.reject();
        switch (`${props.unitReportStatus}`) {
          case "1":
          case "4":/* 审核通过未发送 */
            window.open(
              `/reportManagement/audited?reportId=${props.unitReportId}&version=${data}`,
              "_blank"
            );
            break;
          case "2":
            window.open(
              `/reportManagement/auditFailed?reportId=${props.unitReportId}&version=${data}`,
              "_blank"
            );
            break;
          case "3":
            window.open(
              `/reportManagement/auditSuccessed?reportId=${props.unitReportId}&version=${data}`,
              "_blank"
            );
            break;
        }
      } else {
        root.$notify({
          type: "warning",
          message: root.$t("还没有可查看的单元报告"),
        });
      }
    };
    return {
      handleClick,
    };
  },
};
</script>
