<template>
  <!-- 任务简介 -->
  <div class="task-fifth-step-warp">
    <div class="title">{{ $t("任务辅助信息") }}</div>
    <div class="box-card">
      <div class="form-warp">
        <el-form
          class="my-form"
          :rules="rules"
          ref="myForm"
          :model="fifthFormState"
          label-width="120px"
        >
          <el-form-item :label="$t('任务参考信息')" prop="taskReferenceItem">
            <el-checkbox-group
              style="display: inline"
              v-model="fifthFormState.taskReferenceItem"
            >
              <el-checkbox label="1">{{ $t("本节回放") }}</el-checkbox>
              <el-checkbox label="2">{{ $t("单元报告") }}</el-checkbox>
              <el-checkbox label="3">{{ $t("本节课内容") }}</el-checkbox>
              <el-checkbox label="4">{{ $t("本课小结") }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('参考话术')" prop="speechcraft">
            <div class="editor-warp">
              <quill-editor
                ref="editorRef"
                v-model="fifthFormState.speechcraft"
                class="editor"
                :options="editorOption"
              />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="fix-footer">
        <el-button
          style="width: 108px"
          @click="preStep"
          class="submit-btn"
          type="primary"
          >{{ $t("上一步") }}</el-button
        >
        <el-button
          style="width: 108px"
          :loading="loading"
          @click="nextStep"
          class="submit-btn"
          type="primary"
          >{{ $t("保存") }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import { deepClone } from "../../../../utils/handleData";

export default {
  components: {},
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const loading = ref(false);
    const fifthFormState = ref({
      taskReferenceItem: [],
      speechcraft: "",
    });
    const rules = {
      speechcraft: [
        { required: true, message: root.$t("请输入参考话术"), trigger: "blur" },
        {
          min: 1,
          max: 10000,
          message: root.$t("长度在 3 到 10000 个字符"),
          trigger: "blur",
        },
      ],
    };
    const finalData = ref({});
    const nextStep = async () => {
      await refs["myForm"].validate();
      finalData.value = deepClone(fifthFormState.value);
      finalData.value.taskReferenceItem =
        finalData.value?.taskReferenceItem?.join(",") || "";
      loading.value = true;
      emit("handelSubmit");
    };
    const preStep = async () => {
      emit("toPreStep");
    };
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"], // 加粗，斜体，下划线，删除线
      [{ list: "ordered" }, { list: "bullet" }], // 有序列表，无序列表
      [{ indent: "-1" }, { indent: "+1" }], // 缩进
      [{ size: ["small", false, "large", "huge"] }], // 字体大小
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
      [{ color: [] }, { background: [] }], // 颜色选择
      [{ font: [] }], // 字体
      [{ align: [] }], // 居中
      ["clean"], // 清除样式,
    ];
    const editorOption = {
      modules: {
        history: {
          delay: 1000,
          maxStack: 50,
          userOnly: false,
        },
        toolbar: {
          container: toolbarOptions,
        },
      },
      placeholder: root.$t("请输入参考话术"),
    };

    onMounted(() => {});
    return {
      isEn,
      loading,
      fifthFormState,
      rules,
      editorOption,
      finalData,
      nextStep,
      preStep,
    };
  },
};
</script>
<style lang="scss" scoped>
.task-fifth-step-warp {
  margin-top: 20px;
  .box-card {
    position: relative;
    background: #f9f9ff;
    padding: 20px 0 50px 20px;
    border-radius: 6px;
    overflow: hidden;
    .form-warp {
      overflow: scroll;
      height: calc(100vh - 350px);
      .editor-warp {
        width: 90%;
        padding: 20px;
        background: #fff;
        margin-top: 10px;
        border-radius: 4px;
        height: 400px;
        .editor {
          height: 300px !important;
        }
        margin-bottom: 10px;
      }
    }
    .fix-footer {
      position: absolute;
      bottom: 0px;
      left: 0px;
      width: 100%;
      height: 50px;
      background: #f4f6f9;
      text-align: center;
      line-height: 50px;
    }
  }
  .title {
    color: #7580e5;
    border-left: 2px solid #a0a7e6;
    padding-left: 6px;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .w200 {
    width: 200px;
  }
}
</style>
