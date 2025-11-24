<template>
  <!-- 根据老师管理人员筛选 -->
  <div class="teacher-filter-style-warp">
    <el-select
      v-model="selectIds"
      clearable
      :collapse-tags="true"
      :placeholder="$t('请选择')"
      @visible-change="handleVisibleChange"
      @change="changeSelect"
      :popper-class="isPopDialogVisible ? 'my-hidden' : ''"
      @clear="clear"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-dialog
      :title="$t('请选择教师管理人员')"
      :visible.sync="isPopDialogVisible"
      width="80%"
      top="5vh"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="height: 500px; overflow: scroll">
        <div>
          <el-input
            style="margin-bottom: 10px; width: 200px"
            v-model="searchKey"
            :placeholder="$t('请输入')"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <span v-for="item in options" :key="item.value">
          <el-tag
            v-show="item.label.includes(searchKey)"
            size="medium"
            style="margin-right: 6px; cursor: pointer; margin-bottom: 6px"
            :effect="item.selected ? 'dark' : 'plain'"
            @click="handleSelect(item)"
          >
            {{ item.label }}
          </el-tag>
        </span>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isPopDialogVisible = false">{{
          $t("确认")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, ref, computed } from "@vue/composition-api";
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: false,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
  },
  setup(props, { root, emit }) {
    onMounted(() => {
      let { id } = JSON.parse(localStorage.getItem("userInfo"));
      setTimeout(() => {
        const isIncludesLoginUser = props.options.some((e) => {
          if(e.value==id){
            e.selected=true
          }
          return e.value == id;
        });
        if (isIncludesLoginUser) {
          selectIds.value = id+'';
          changeSelect(id);
        }
      }, 100);
    });
    const searchKey = ref("");
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const selectIds = ref("");
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    const isPopDialogVisible = ref(false);
    const handleVisibleChange = (visible) => {
      if (visible) {
        isPopDialogVisible.value = true;
        root.$nextTick(() => {
          isPopDialogVisible.value = true;
        });
      }
    };

    const handleSelect = (item) => {
      selectIds.value = item.value;
      props.options.forEach((e) => {
        e.selected = false;
      });
      root.$set(item, "selected", true);
      emit("changeSelect", item.value);
    };
    const clear = () => {
      props.options.forEach((e) => {
        e.selected = false;
      });
      selectIds.value = "";
    };
    return {
      isEn,
      selectIds,
      changeSelect,
      handleVisibleChange,
      isPopDialogVisible,
      handleSelect,
      clear,
      searchKey,
    };
  },
};
</script>
<style lang="scss">
.my-hidden {
  display: none;
}
</style>
