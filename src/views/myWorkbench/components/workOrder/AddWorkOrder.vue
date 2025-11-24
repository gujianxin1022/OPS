<template>
  <div class="add-work-order" style="display: inline-block">
    <el-button class="fr w120" type="primary" @click="drawer = true">{{
      $t("新建工单")
    }}</el-button>
    <el-drawer
      :title="$t('新建工单')"
      v-if="drawer"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false"
      :close-on-press-escape="false"
      :before-close="closeDrawer"
    >
      <div class="content" v-loading="loading">
        <div
          style="
            width: 580px;
            font-size: 12px;
            color: #969696;
            padding: 0 20px;
            text-wrap: wrap;
            line-height: 20px;
          "
        >
          {{
            $t(
              "设备测试可预约的时间:6:30AM-7:30AM，11AM-16:30PM，20PM-22:30PM，请至少提前12小时预约"
            )
          }}
        </div>
        <el-form
          class="my-form"
          :rules="rules"
          ref="myForm"
          :model="formState"
          label-width="80px"
          :label-width="isEn ? '100px' : '80px'"
        >
          <el-form-item :label="$t('工单标题')" prop="title">
            <el-input
              maxlength="100"
              :placeholder="$t('请输入')"
              class="w200"
              v-model="formState.title"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('工单内容')" prop="content">
            <div style="height: 400px">
              <RichTextEditor
                @handelChangeContent="
                  (val) => {
                    formState.content = val;
                  }
                "
                :editorConfig="editorConfig"
              />
            </div>
          </el-form-item>
          <el-form-item :label="$t('创建人')" prop="creater">
            <span>{{ opsUserName }}</span>
          </el-form-item>
          <el-form-item :label="$t('工单分类')" prop="classificationId">
            <FilterByWorkOrderSimplify
              @changeSelect="
                (val) => {
                  formState.classificationId = val;
                }
              "
              :options="classificationList"
            ></FilterByWorkOrderSimplify>
          </el-form-item>
          <el-form-item v-if="currentClassification && currentClassification.roomIdRequired" label="Room ID" prop="roomId">
            <el-input
              maxlength="100"
              :placeholder="$t('请输入')"
              class="w200"
              v-model="formState.roomId"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('优先级')" prop="priorityId">
            <FilterByWorkOrderPriority
              @changeSelect="
                (val) => {
                  formState.priorityId = val;
                }
              "
            ></FilterByWorkOrderPriority>
          </el-form-item>
          <el-form-item :label="$t('学科分类')" prop="subjectType">
            <FilterBySubject
              @changeSelect="
                (val) => {
                  formState.subjectType = val;
                }
              "
            ></FilterBySubject>
          </el-form-item>
          <el-form-item :label="$t('处理人')" prop="businessUserRole">
            <FilterByUserRole
              :isShowAll="false"
              @change="
                (val) => {
                  formState.businessUserRole = val;
                }
              "
            ></FilterByUserRole>
          </el-form-item>
          <el-form-item :label="$t('学生ID')" prop="studentIdList">
            <el-input
              class="w375"
              type="textarea"
              :rows="8"
              :disabled="currStudentId"
              :placeholder="$t('每行一个学生id，以回车分割，最多1000条')"
              v-model="formState.studentIdList"
              @input="handleInput"
            />
            <br />
            <el-popover placement="right" width="180" trigger="hover">
              <el-image
                style="width: 100px; height: 100px"
                :src="!isEn ? studentIdPic : studentIdPicEn"
                :preview-src-list="[!isEn ? studentIdPic : studentIdPicEn]"
              >
              </el-image>
              <span
                style="
                  color: #f56c6c;
                  cursor: pointer;
                  text-decoration: underline;
                  text-decoration-color: #f56c6c;
                "
                slot="reference"
              >
                {{ $t("如何获取学生ID") }}？
              </span>
            </el-popover>
          </el-form-item>
        </el-form>
        <div class="footer">
          <el-button @click="closeDrawer" type="text">{{
            $t("取消")
          }}</el-button>
          <el-button @click="submit" :loading="loading" type="primary">{{
            $t("保存")
          }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { ref, reactive, onMounted, computed } from "@vue/composition-api";
import FilterByWorkOrderSimplify from "@/components/FilterItem/WorkOrderFilter/FilterByWorkOrderSimplify";
import FilterByWorkOrderPriority from "@/components/FilterItem/WorkOrderFilter/FilterByWorkOrderPriority";
import FilterBySubject from "@/components/FilterItem/CommodityFilter/FilterBySubject";
import FilterByUserRole from "@/components/FilterItem/UserDimensionFilter/FilterByUserRole";
import studentIdPic from "@/assets/students/学生ID.png";
import studentIdPicEn from "@/assets/students/学生ID_En.png";
import RichTextEditor from "@/components/RichTextEditor.vue";
import { deepClone } from "@/utils/handleData";

export default {
  components: {
    FilterByWorkOrderSimplify,
    FilterByWorkOrderPriority,
    FilterBySubject,
    FilterByUserRole,
    RichTextEditor,
  },
  setup(props, { emit, root, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const drawer = ref(false);
    const formState = reactive({
      title: "",
      content: "",
      classificationId: "",
      priorityId: "",
      subjectType: "",
      businessUserRole: "",
      studentIdList: "",
      roomId: "", // 教室号，当选择特定的工单分类时，需要填写
    });
    const currStudentId = ref(root.$route.query.studentId);
    if (currStudentId.value) {
      formState.studentIdList = `${currStudentId.value}`;
    }
    const rules = {
      title: [{ required: true, message: root.$t("请输入"), trigger: "blur" }],
      classificationId: [
        { required: true, message: root.$t("请选择"), trigger: "blur" },
      ],
      subjectType: [
        { required: true, message: root.$t("请选择"), trigger: "blur" },
      ],
      businessUserRole: [
        { required: true, message: root.$t("请选择"), trigger: "blur" },
      ],
      studentIdList: [
        { required: true, message: root.$t("请输入"), trigger: "change" },
      ],
      roleType: {
        required: true,
        message: root.$t("请选择"),
        trigger: "change",
      },
      postIdList: [
        { required: true, message: root.$t("请选择"), trigger: "blur" },
      ],
      roomId: [{ required: true, message: root.$t("请输入"), trigger: "blur" }],
    };
    const loading = ref(false);
    const submit = async () => {
      // 如果选择的工单分类不需要填写教室号，则清空教室号
      const info = currentClassification.value;
      if (info && !info.roomIdRequired) {
        formState.roomId = "";
      }
      await refs["myForm"].validate();
      try {
        let idArr = formState.studentIdList.split("\n").filter((e) => {
          return e !== "";
        });
        loading.value = true;
        let params = deepClone(formState);
        params.studentIdList = idArr.map(Number);
        const res = await root.$Api.workBench.reWorkOrderCreate(params);
        if (!res.result) {
          return root.$notify.error(res.failMessage);
        }
        root.$notify.success(root.$t("操作成功"));
        if (formState.businessUserRole === 6) {
          setTimeout(() => {
            emit("refreshList");
          }, 2000);
        } else {
          emit("refreshList");
        }
        closeDrawer();
      } finally {
        loading.value = false;
      }
    };
    const handleInput = (val) => {
      /* 只能输入数字和回车 */
      formState.studentIdList = formState.studentIdList.replace(/[^\d\n]/g, "");
    };
    const { id } = JSON.parse(localStorage.getItem("userInfo"));
    const classificationList = ref([]);
    // 当前选中的工单分类信息
    const currentClassification = computed(() => {
      return classificationList.value.find((item) => {
        return item.id === formState.classificationId;
      });
    });
    const mediaCdn = ref("");
    const initSelect = async () => {
      const res = await root.$Api.workBench.reWorkOrderConfig({
        userId: id,
      });
      classificationList.value = res.classificationList || [];
      mediaCdn.value = res.mediaCdn;
    };
    const closeDrawer = () => {
      refs["myForm"].resetFields();
      drawer.value = false;
    };
    onMounted(() => {
      initSelect();
    });
    return {
      drawer,
      formState,
      handleInput,
      rules,
      loading,
      submit,
      studentIdPic,
      studentIdPicEn,
      currStudentId,
      classificationList,
      currentClassification,
      closeDrawer,
      isEn,
      opsUserName: JSON.parse(localStorage.userInfo).username,
      editorConfig: {
        modules: {
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false,
          },
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], // 加粗，斜体，下划线，删除线
              [{ list: "ordered" }, { list: "bullet" }], // 有序列表，无序列表
              [{ indent: "-1" }, { indent: "+1" }], // 缩进
              [{ size: ["small", false, "large", "huge"] }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
              [{ color: [] }, { background: [] }], // 颜色选择
              [{ font: [] }], // 字体
              [{ align: [] }], // 居中
              ["clean"], // 清除样式,
              ["audio"],
            ],
          },
        },
        placeholder: `${root.$t("学生姓名")}：
${root.$t("反馈学科")}：
${root.$t("家长问题")}：
${root.$t("家长诉求")}：`,
      },
    };
  },
};
</script>
<style scoped lang="scss">
.add-work-order {
  .my-form {
    width: 600px;
    padding: 20px;
    .w375 {
      width: 375px;
    }
    .w120 {
      width: 120px;
    }
  }
  .footer {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
<style lang="scss">
.add-work-order {
  .el-drawer__header {
    padding: 0 20px !important;
    margin-bottom: 0px !important;
  }
}
</style>
