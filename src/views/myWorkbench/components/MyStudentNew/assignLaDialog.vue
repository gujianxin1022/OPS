<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="$t('Assign Learning Advisor')"
    :visible.sync="visible"
    width="800px"
    @close="closeAssignDialog"
  >
    <FamilyLaList
      v-if="!isBatch"
      class="mb20"
      :parentUserId="parentUserIds[0]"
    />
    <el-form
      ref="formRef"
      :model="form"
      label-width="180px"
    >
      <el-form-item
        :label="$t('学管老师')"
        prop="learnManagerId"
        :rules="[
      { required: true, message: $t('请选择')},
    ]"
      >
        <el-select
          filterable
          v-model="form.learnManagerId"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="(item, index) in xgList"
            :key="index"
            :label="
                item.nameEn +
                `${item.nameEn && item.nameZh ? '-' : ''}` +
                item.nameZh
              "
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('是否企微继承好友或群')">
        <el-radio-group v-model="form.inheritWechat">
          <el-radio :label="1">{{ $t('是') }}</el-radio>
          <el-radio :label="0">{{ $t('否') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="btn-wrapper text-center">
        <el-button @click="closeAssignDialog">{{ $t("取消") }}
        </el-button>
        <el-button
          type="primary"
          @click="validateForm"
        >
          {{ $t("my-home-Confirm") }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive, computed } from '@vue/composition-api'
import FamilyLaList from "@/views/Task/components/familyLaList";

export default defineComponent({
  props: {
    parentId: {
      type: Number,
      dealut: null
    },
    selectedItems: {
      type: Array,
      dealut: []
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: { FamilyLaList },
  setup (props, { root, emit, refs }) {
    const userId = JSON.parse(window.localStorage.getItem("userInfo")).id
    const isEn = computed(() => root.$store.getters.currentLang === 'en')
    const isBatch = computed(() => props.selectedItems?.length > 1)
    const xgList = computed(() => root.$store.getters.xgList);
    const form = reactive({
      learnManagerId: "",
      inheritWechat: 1, // 是否企微继承好友或群
    })
    const closeAssignDialog = () => {
      emit('update:visible', false)
    }
    const parentUserIds = computed(() => props.selectedItems.map(t => t.parentUserId))
    const submitAssign = () => {
      const { selectedItems } = props
      const url = selectedItems.length > 1 ? 'batchAssignLA' : 'assignLASingle'
      const params = {
        xgUserId: form.learnManagerId,
        inheritWechat: form.inheritWechat,
      }
      if (selectedItems.length === 1) {
        const { parentUserId, subjectTypeId } = selectedItems[0]
        Object.assign(params, {
          parentUserId, subjectTypeId
        })
      } else {
        const parentSubjectReqList = selectedItems.map(t => {
          return {
            parentUserId: t.parentUserId,
            subjectTypeId: t.subjectTypeId
          }
        })
        Object.assign(params, { parentSubjectReqList })
      }
      root.$Api.studentManagement[url](params)
        .then(({ status, data: { code } }) => {
          if (status !== 200 || code !== 200) return Promise.reject()
          root.$notify({
            message: root.$t("Allocation succeeded"),
            type: "success",
          });
          emit('assignSuccess')
        });
    }

    const validateForm = () => {
      refs.formRef.validate((valid) => {
        if (valid) {
          submitAssign()
        } else {
          return false
        }
      });
    }

    return {
      userId,
      parentUserIds,
      isEn,
      form,
      xgList,
      isBatch,
      closeAssignDialog,
      submitAssign,
      validateForm
    }
  },
})
</script>
<style lang="scss" scoped>
</style>
