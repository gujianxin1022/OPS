<template>
  <el-dialog
    :title="$t('模拟发送')"
    :visible.sync="visible"
    @close="closeDialog"
    center
  >
    <el-form
      :model="form"
      ref="formRef"
      label-width="120px"
    >
      <el-form-item
        :label="$t('用户id')"
        prop="tag"
        :rules="[
      { required: true, message: $t('不能为空')},
    ]"
      >
      </el-form-item>
      <el-form-item>
        <el-button @click="closeDialog">{{$t('取消')}}</el-button>
        <el-button
          @click="submit"
          type="primary"
        >{{$t('确认')}}</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>
<script>
import { reactive, ref, onMounted, computed } from "@vue/composition-api";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: null
    },
  },
  setup (props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === 'en');
    const form = reactive({
      tag: ""
    })
    const closeDialog = () => {
      emit('update:visible', false)
    }

    const submit = () => {
      refs.formRef.validate((valid) => {
        if (valid) {
          emit('successCb', form.tag)
        } else {
          return false
        }
      });
    }

    onMounted(() => {
    })

    return {
      form,
      isEn,
      closeDialog,
      submit,
    };
  },
};
</script>

<style scoped lang="scss">
</style>