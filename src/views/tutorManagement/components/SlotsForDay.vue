<template>
  <div class="slots-for-day-warp">
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
      @remove-tag="removeTag"
    >
      <el-option
        v-for="item in optionList"
        :key="item.value"
        :label="$t(item.label)"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-dialog
      :title="$t('请选择')"
      :visible.sync="isPopDialogVisible"
      width="50%"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-tag
        size="medium"
        style="margin-right: 4px; cursor: pointer; margin-bottom: 4px"
        :effect="item.selected ? 'dark' : 'plain'"
        v-for="item in optionList"
        :key="item.value"
        @click="handleSelect(item)"
      >
        {{ $t(item.label) }}
      </el-tag>
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
      default: true,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
  },
  setup(props, { root, emit }) {
    const removeTag = (val) => {
      const index = optionList.value.findIndex((item) => item.value === val);
      optionList.value[index].selected = false;
    };
    function generateTimeArray() {
      const times = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const label = `${String(hour).padStart(2, "0")}:${String(
            minute
          ).padStart(2, "0")}`;
          times.push({ label, value: label, selected: false });
        }
      }
      return times;
    }
    const optionList = ref(generateTimeArray());

    const isEn = computed(() => root.$store.getters.currentLang === "en");
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
      selectIds.value = [];
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
      removeTag,
    };
  },
};
</script>
<style lang="scss">
.my-hidden {
  display: none;
}
</style>
