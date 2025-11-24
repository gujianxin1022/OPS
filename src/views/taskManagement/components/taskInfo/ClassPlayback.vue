<template>
  <div>
    <el-button @click="handleClick" type="text">{{ $t("本节回放") }}</el-button>
    <ClassCallBack
      :classType="classTypeId"
      :show="showCallBack"
      :currentCallBackId="virtualclassId"
      @close="
        () => {
          showCallBack = false;
        }
      "
    ></ClassCallBack>
  </div>
</template>

<script>
import ClassCallBack from "@/components/ClassCallBack";
import { ref } from "@vue/composition-api";
export default {
  components: { ClassCallBack },
  props: {
    classTypeId: {
      type: Number,
      default: null,
    },
    virtualclassId: {
      type: String,
      default: "",
    },
  },
  setup(props, { root, emit, refs }) {
    const showCallBack = ref(false);
    const handleClick = async () => {
      console.log(props.classTypeId);
      if (!props.virtualclassId) {
        root.$notify({
          type: "warning",
          message: root.$t("没有可查看的课程回放"),
        });
        return;
      }
      showCallBack.value = true;
    };
    return {
      classTypeId: props.classTypeId,
      virtualclassId: props.virtualclassId,
      showCallBack,
      handleClick,
    };
  },
};
</script>
