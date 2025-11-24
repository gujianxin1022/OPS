<template>
  <!-- 根据老师教学年限标签筛选 -->
  <div class="teacher-filter-style-warp">
    <el-select
      v-model="selectIds"
      multiple
      filterable
      clearable
      :collapse-tags="true"
      :placeholder="$t('请选择')"
      @visible-change="handleVisibleChange"
      @change="changeSelect"
      :popper-class="isPopDialogVisible ? 'my-hidden' : ''"
      @clear="clear"
    >
      <el-option
        v-for="item in optionList"
        :key="item.id"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-dialog
      :title="$t('请点击选择教师教学年限')"
      :visible.sync="isPopDialogVisible"
      width="50%"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-tag
        size="medium"
        style="margin-right: 4px; cursor: pointer"
        :effect="item.selected ? 'dark' : 'plain'"
        v-for="item in optionList"
        :key="item.id"
        @click="handleSelect(item)"
      >
        {{ $t(item.label) }}
      </el-tag>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isPopDialogVisible = false"
          >确 定</el-button
        >
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
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref(root.Constants.teacherBookTeachAgoList(isEn.value));
    const selectIds = ref([]);
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
      root.$set(item, "selected", !item.selected);
      let index = selectIds.value.indexOf(item.value);
      if (index !== -1) {
        selectIds.value.splice(index, 1);
      } else {
        selectIds.value.push(item.value);
      }
      emit("changeSelect", selectIds.value);
    };
    const clear = () => {
      optionList.value.forEach((e) => {
        e.selected = false;
      });
      selectIds.value=[]
    };
    const delSelected = (id) => {
      let index = selectIds.value.indexOf(id);
      if (index !== -1) {
        selectIds.value.splice(index, 1);
        optionList.value.some((e) => {
          e.value === id && (e.selected = false);
        });
      }
    };

    return {
      isEn,
      optionList,
      selectIds,
      changeSelect,
      handleVisibleChange,
      isPopDialogVisible,
      handleSelect,
      clear,
      delSelected,
    };
  },
};
</script>
<style lang="scss">
.my-hidden {
  display: none;
}
</style>
