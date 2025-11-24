<template>
  <el-dialog
    :before-close="closeDialog"
    :title="$t('赠送试听课')"
    :visible.sync="visible"
    center
  >
    <el-form :model="form" ref="formRef" label-width="120px">
      <el-form-item
        :label="$t('选择试听课程包')"
        prop="course"
        :rules="[{ required: true, message: '请选择' }]"
      >
        <el-cascader
          style="width: 280px"
          v-model="selectId"
          :options="coursePkgs"
          :props="{
            value: 'packageId',
            label: 'name',
            children: 'children',
            expandTrigger: 'hover',
          }"
          :placeholder="$t('请选择课程包')"
          @change="changeSelect"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button @click="closeDialog">{{ $t("关闭") }}</el-button>
        <el-button @click="confirmGive" type="primary">{{
          $t("赠送")
        }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {
  reactive,
  ref,
  onMounted,
  computed,
  unref,
} from "@vue/composition-api";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    studentId: {
      type: Number,
      default: -1,
    },
    packageType: {
      type: Number,
      default: -1,
    },
    parentId: {
      type: Number,
      default: -1,
    },
    subjectType: {
      type: Number || String,
      default: "",
    },
  },
  setup(props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const formRef = ref(null);
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const selectedCoursePkg = ref({});
    const form = reactive({
      course: "",
    });
    let selectSubject = null;
    const coursePkgs = ref([]);
    const closeDialog = () => {
      // 未提交关闭与提交关闭区分开
      emit("update:visible", false);
    };
    const confirmGive = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          beforeSubmitCheck();
        } else {
          return false;
        }
      });
    };

    const onChangePkg = (val) => {
      selectSubject = rawData.value.find(
        (t) => t.packageId === val
      ).subjectType;
    };

    const changeSelect = async (val) => {
      if (val.length) {
        form.course = val[1];
        onChangePkg(val[1]);
      }
    };
    const rawData = ref([]);
    const getTryLessonList = () => {
      root.$Api.studentManagement.getTryLessonList(0).then((res) => {
        const { data } = res;
        if (data.code === 200) {
          rawData.value = data.data;
          coursePkgs.value = processData(data.data);
        }
      });
    };

    const processData = (data) => {
      if (!data) return [];
      const categorizedData = {
        0: { name: root.$t("中文"), children: [] },
        1: { name: root.$t("英语"), children: [] },
        2: { name: root.$t("数学"), children: [] },
        6: { name: root.$t("单词通"), children: [] },
      };
      data.forEach((item) => {
        const category = categorizedData[item.subjectType];
        if (category) {
          category.children.push({
            packageId: item.packageId,
            name: isEn.value ? item.packageNameEn : item.packageName,
          });
        }
      });
      return Object.values(categorizedData);
    };

    const beforeSubmitCheck = () => {
      root.$Api.studentManagement
        .checkBeforeGiveLesson(props.studentId, props.parentId, selectSubject)
        .then(({ status, data: { code, data } }) => {
          if (status !== 200 || code !== 200) return Promise.reject();
          if (data) {
            submit();
          } else {
            return root.$notify.error(root.$t("赠送试听课时请先创建商机"));
          }
        });
    };

    const submit = () => {
      root.$Api.studentManagement
        .giveLesson(props.studentId, form.course, props.parentId)
        .then(
          ({ data }) => {
            if (data.code !== 200) {
              return Promise.reject();
            }
            root.$notify({
              message: root.$t("赠送成功"),
              type: "success",
            });
            emit("closeGiveLessonDialog");
          },
          () => {
            root.$notify({
              message: root.$t("赠送失败"),
              type: "error",
            });
          }
        );
    };

    onMounted(getTryLessonList);
    return {
      currentLang,
      form,
      selectedCoursePkg,
      formRef,
      closeDialog,
      confirmGive,
      submit,
      coursePkgs,
      getTryLessonList,
      submit,
      onChangePkg,
      changeSelect,
      isEn,
    };
  },
};
</script>

<style scoped lang="scss"></style>
