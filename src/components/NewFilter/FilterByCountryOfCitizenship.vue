<template>
  <!-- 根据老师国籍标签筛选 -->
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
      @remove-tag="removeTag"
    >
      <el-option
        v-for="item in allCountries"
        :key="item.areaId"
        :label="isEn ? item.nameEn : item.nameZh"
        :value="item.areaId"
      >
      </el-option>
    </el-select>
    <el-dialog
      :title="$t('请选择教师国籍')"
      :visible.sync="isPopDialogVisible"
      width="80%"
      top="5vh"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="height: 500px; overflow: scroll">
        <el-divider
          ><span style="color: #969696; font-size: 12px">{{
            $t("常用国籍")
          }}</span>
        </el-divider>
        <el-tag
          size="medium"
          style="margin-right: 4px; cursor: pointer"
          :effect="item.selected ? 'dark' : 'plain'"
          v-for="item in commonCountries"
          :key="item.areaId"
          type="success"
          @click="handleSelect(item)"
        >
          {{ isEn ? item.nameEn : item.nameZh }}
        </el-tag>
        <el-divider
          ><span style="color: #969696; font-size: 12px">{{
            $t("其他")
          }}</span></el-divider
        >
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

        <span v-for="item in allCountries" :key="item.areaId">
          <el-tag
            v-show="
              !commonAreaIds.includes(item.areaId) &&
              (!isEn
                ? item.nameZh.includes(searchKey)
                : item.nameEn.includes(searchKey))
            "
            size="medium"
            style="margin-right: 6px; cursor: pointer; margin-bottom: 6px"
            :effect="item.selected ? 'dark' : 'plain'"
            @click="handleSelect(item)"
          >
            {{ isEn ? item.nameEn : item.nameZh }}
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
  },
  setup(props, { root, emit }) {
    const removeTag = (val) => {
      const index = selectedCountryList.value.findIndex(
        (item) => item.areaId === val
      );
      if (index !== -1) {
        commonCountries.value.some((e) => {
          e.areaId === val && (e.selected = false);
        });
        allCountries.value.some((e) => {
          e.areaId === val && (e.selected = false);
        });
        selectedCountryList.value.splice(index, 1);
      }
      emit("changeSelect", selectedCountryList.value);
    };
    const searchKey = ref("");
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectIds = ref([]);
    const changeSelect = async (val) => {
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
    const selectedCountryList = ref([]);
    const handleSelect = (item) => {
      root.$set(item, "selected", !item.selected);
      let index = selectIds.value.indexOf(item.areaId);
      if (index !== -1) {
        selectIds.value.splice(index, 1);
        selectedCountryList.value.splice(index, 1);
      } else {
        selectIds.value.push(item.areaId);
        selectedCountryList.value.push(item);
      }
      emit("changeSelect", selectedCountryList.value);
    };
    const clear = () => {
      selectedCountryList.value.forEach((e) => {
        e.selected = false;
      });
      selectedCountryList.value = [];
      selectIds.value = [];
      emit("changeSelect", selectedCountryList.value);
    };
    const delSelected = (item) => {
      let index = selectIds.value.indexOf(item.areaId);
      if (index !== -1) {
        selectIds.value.splice(index, 1);
        selectedCountryList.value.splice(index, 1);
        commonCountries.value.some((e) => {
          e.areaId === item.areaId && (e.selected = false);
        });
        allCountries.value.some((e) => {
          e.areaId === item.areaId && (e.selected = false);
        });
      }
    };
    const commonAreaIds = ref([]);
    const getCountryList = async () => {
      const res = await root.$Api.tutorManagement.reqCountryList();
      commonAreaIds.value = res.commonCountries.map((e) => e.areaId);
      commonCountries.value = res.commonCountries;
      allCountries.value = res.allCountries;
      optionList.value = commonCountries.value;
    };
    const commonCountries = ref([]);
    const allCountries = ref([]);
    onMounted(async () => {
      getCountryList();
    });

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
      commonCountries,
      allCountries,
      commonAreaIds,
      searchKey,
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
