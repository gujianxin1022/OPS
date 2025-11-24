<template>
  <div class="honor-warp">
    <el-table border :data="honorList" style="width: 100%">
      <el-table-column
        fixed
        prop="honorTypeDesc"
        :label="$t('课堂表现')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="honorDesc"
        :label="$t('课堂表现评语')"
        align="center"
      ></el-table-column>
      <el-table-column align="center" :label="$t('操作')" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editItem(scope.row, scope.$index), (editVisible = true)"
            :disabled="disabled"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加维度"
      :visible.sync="editVisible"
      width="60%"
      :before-close="close"
      :close-on-click-modal="false"
    >
      <div slot="title" class="header-title">
        <span class="title-dimension">编辑课堂表现</span>
      </div>
      <div class="assessment-content">
        <el-form :model="currentItem" :rules="rules" ref="ruleFormRef">
          <el-form-item
            label="课堂表现"
            :label-width="formLabelWidth"
            prop="honorTypeDesc"
          >
            <el-input
              v-model="currentItem.honorTypeDesc"
              placeholder="请输入课堂表现名称"
              show-word-limit
              maxlength="50"
            ></el-input>
          </el-form-item>
          <p>中文对照：{{ currentItem.contrastHonorTypeDesc }}</p>
          <el-form-item
            label="课堂表现评语"
            :label-width="formLabelWidth"
            prop="honorDesc"
          >
            <el-input
              v-model="currentItem.honorDesc"
              type="textarea"
              placeholder="请输入评语"
              show-word-limit
              maxlength="1000"
            ></el-input>
          </el-form-item>
          <p>中文对照：{{ currentItem.contrastHonorDesc }}</p>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="saveHonorItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, ref, computed, watch } from "@vue/composition-api";
import { deepClone } from "@/utils/handleData";
export default {
  props: {
    nowLanguage: {
      type: String,
      default: "CN",
    },
    honorListZh: {
      type: Array,
      default: [],
    },
    list: {
      type: Array,
      default: [],
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      default: 0 /*  1:已发布  2:未发布 */,
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const honorList = ref([]);
    const editVisible = ref(false);
    const editIndex = ref(0);
    const templateStatus = ref(0);
    const currentItem = ref({
      name: "",
      nameLanguage: "",
      nowLanguage: "",
      honorTypeDesc: "",
      honorDesc: "",
    });
    const rules = {
      honorTypeDesc: [
        { required: true, message: "请输入名称", trigger: "blur" },
      ],
      honorDesc: [
        { required: true, message: "请输入评语", trigger: "blur" },
      ],
    };
    const ruleFormRef = ref(null);
    const saveHonorItem = async () => {
      await ruleFormRef.value.validate();
      const item = deepClone(currentItem);
      item.value.nameLanguage = item.value.honorTypeDesc;
      item.value.nowLanguage = props.nowLanguage;
      root.$set(honorList.value, editIndex.value, item.value);
      close();
      emitData();
    };
    const editItem = async (row, index) => {
      currentItem.value = deepClone(row);
      editIndex.value = index;
      emitData();
    };
    const emitData = () => {
      emit("getHonorList", honorList.value);
    };
    const close = async () => {
      editVisible.value = false;
      currentItem.value = {
        name: "",
        nameLanguage: "",
        nowLanguage: "",
        honorTypeDesc: "",
        honorDesc: "",
      };
    };
    watch(
      () => props.list,
      (val) => {
        if (!val) return;
        honorList.value.forEach(e=>{
          val.forEach(i=>{
            if(e.name===i.name){
              e.id=i.id
              e.nameLanguage=i.nameLanguage
              e.honorTypeDesc=i.honorTypeDesc
              e.honorDesc=i.honorDesc
            }
          })
        })
      }
    );
    watch(
      () => props.status,
      (val) => {
        templateStatus.value = val;
      }
    );
    onMounted(() => {
      props.honorListZh &&
        props.honorListZh.forEach((e) => {
          honorList.value.push({
            name: e.name,
            nameLanguage: "",
            honorTypeDesc: "",
            honorDesc: "",
            nowLanguage: props.nowLanguage,
            contrastHonorTypeDesc: e.honorTypeDesc /* 中文荣誉对照 */,
            contrastHonorDesc: e.honorDesc /* 中文荣誉评语对照 */,
            id:null
          });
        });
    });

    return {
      isEn,
      editVisible,
      honorList,
      currentItem,
      saveHonorItem,
      editItem,
      close,
      disabled: props.isDisabled,
      templateStatus,
      rules,
      ruleFormRef,
    };
  },
};
</script>

<style scoped lang="scss">
.honor-warp {
  padding-right: 20px;
}
</style>
