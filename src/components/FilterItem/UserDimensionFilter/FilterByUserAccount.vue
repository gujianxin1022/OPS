<template>
  <div class="filter-by-user-account">
    <el-dropdown 
      @command="handleFilterTypeChange" 
      trigger="click"
      class="filter-dropdown"
    >
      <span class="dropdown-trigger">
        {{ currentFilterType ? currentFilterType.label : '' }}
        <i class="el-icon-arrow-up el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown" class="filter-dropdown-menu">
        <div class="filter-group">
          <div class="group-title">{{ $t('精确') }}</div>
          <el-dropdown-item 
            v-for="item in exactFilters" 
            :key="item.value"
            :command="item"
            :class="{ 'is-active': currentFilterType.value === item.value }"
          >
            {{ item.label }}
          </el-dropdown-item>
        </div>
        <el-dropdown-item divided></el-dropdown-item>
        <div class="filter-group">
          <div class="group-title">{{ $t('模糊') }}</div>
          <el-dropdown-item 
            v-for="item in fuzzyFilters" 
            :key="item.value"
            :command="item"
            :class="{ 'is-active': currentFilterType.value === item.value }"
          >
            {{ item.label }}
          </el-dropdown-item>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
    <el-tag 
      :type="currentMatchMode === 'exact' ? '' : 'success'"
      class="match-mode-btn"
      effect="dark"
      @click="toggleMatchMode"
    >
      {{ currentMatchMode === 'exact' ? $t('精确') : $t('模糊') }}
    </el-tag>

    <el-input
      v-model="inputValue"
      :placeholder="currentFilterType ? currentFilterType.placeholder : ''"
      class="search-input"
      clearable
      @input="handleInputChange"
    >
      <el-button 
        v-if="showSearchBtn"
        slot="append" 
        icon="el-icon-search"
        @click="handleSearch"
        class="search-btn"
      >
        {{ $t('搜索') }}
      </el-button>
    </el-input>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "@vue/composition-api";

export default {
  name: "FilterByUserAccount",
  props: {
    showSearchBtn: {
      type: Boolean,
      default: false
    },
  },
  setup(props, { emit, root }) {
    const exactFilters = computed(() => [
      { value: 'username', label: root.$t('账号名'), placeholder: root.$t('输入完整账号名'), type: 1 },
      { value: 'phone', label: root.$t('手机号'), placeholder: root.$t('输入完整手机号'), type: 2 },
      { value: 'email', label: root.$t('邮箱'), placeholder: root.$t('输入完整邮箱'), type: 3 }
    ]);

    const fuzzyFilters = computed(() => [
      { value: 'identity_name', label: root.$t('真实姓名'), placeholder: root.$t('输入真实姓名'), type: 4 },
      { value: 'real_name', label: root.$t('展示姓名'), placeholder: root.$t('输入展示姓名'), type: 5 }
    ]);

    const currentFilterType = ref({});
    const inputValue = ref('');
    const currentMatchMode = ref('exact'); 

    onMounted(() => {
      currentFilterType.value = exactFilters.value[1]; 
    });

    const handleFilterTypeChange = (filterItem) => {
      currentFilterType.value = filterItem;
      const isExactFilter = exactFilters.value.some(item => item.value === filterItem.value);
      currentMatchMode.value = isExactFilter ? 'exact' : 'fuzzy';
      emitSearch();
    };

    const toggleMatchMode = () => {
      currentMatchMode.value = currentMatchMode.value === 'exact' ? 'fuzzy' : 'exact';
      if (currentMatchMode.value === 'exact') {
        currentFilterType.value = exactFilters.value[0]; 
      } else {
        currentFilterType.value = fuzzyFilters.value[0];
      }
      
      emitSearch();
    };

    const handleInputChange = () => {
      emitSearch();
    };

    const handleSearch = () => {
      if (!inputValue.value.trim() || !currentFilterType.value) {
        emit('search', {});
        return;
      }
      const searchParams = {
        identityType: currentFilterType.value.type,
        identity: inputValue.value.trim()
      };
      emit('search', searchParams);
    };

    const emitSearch = () => {
      if (!inputValue.value.trim() || !currentFilterType.value) {
        emit('change', {});
        return;
      }
      const searchParams = {
        identityType: currentFilterType.value.type,
        identity: inputValue.value.trim()
      };
      emit('change', searchParams);
    };

    return {
      exactFilters,
      fuzzyFilters,
      currentFilterType,
      inputValue,
      currentMatchMode,
      handleFilterTypeChange,
      toggleMatchMode,
      handleInputChange,
      handleSearch
    };
  },
};
</script>

<style lang="scss" scoped>
.filter-by-user-account {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  white-space: nowrap;
  flex-wrap: nowrap;

  .filter-dropdown {
    flex-shrink: 0;
    
    .dropdown-trigger {
      display: flex;
      align-items: center;
      padding: 4px 12px;
      background: white;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      cursor: pointer;
      min-width: 80px;
      white-space: nowrap;
      height: 32px;
      box-sizing: border-box;
      
      &:hover {
        border-color: #409eff;
      }
    }
  }

  .match-mode-btn {
    min-width: 50px;
    height: 32px;
    border-radius: 4px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-sizing: border-box;
  }

  .search-input {
    flex: 1;
    min-width: 150px;
    max-width: 300px;
    
    .el-input__inner {
      height: 32px;
      border-radius: 4px;
    }
    
    .el-input-group__append {
      .el-button {
        height: 30px;
        padding: 0 12px;
        border-radius: 0 4px 4px 0;
        border-left: none;
      }
    }
  }
}

// 下拉菜单样式
.filter-dropdown-menu {
  .filter-group {
    .group-title {
      padding: 8px 20px 4px;
      font-size: 12px;
      color: #909399;
      font-weight: 500;
    }
    
    .el-dropdown-item {
      padding: 8px 20px;
      font-size: 14px;
      position: relative;
      
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
  
  .el-dropdown-menu__item--divided {
    margin: 4px 0;
    border-top: 1px solid #e4e7ed;
  }
}

::v-deep .filter-dropdown-menu .el-dropdown-item.is-active {
  color: #7580E5 !important;
  background-color: #f5f7fa !important;
  font-weight: 500 !important;
}

::v-deep .el-dropdown-menu__item.is-active {
  color: #7580E5 !important;
  background-color: #f5f7fa !important;
  font-weight: 500 !important;
}

::v-deep .el-dropdown-menu .el-dropdown-menu__item.is-active {
  color: #7580E5 !important;
  background-color: #f5f7fa !important;
  font-weight: 500 !important;
}

::v-deep .el-dropdown-menu .el-dropdown-menu__item {
  border: 1px solid transparent;
  
  &.is-active {
    border: 2px solid #7580E5 !important;
  }
}
</style>
