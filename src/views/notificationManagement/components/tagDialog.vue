<template>
  <el-dialog
    :title="$t('选择标签')"
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
        :label="$t('选择标签')"
        prop="tag"
        :rules="[
      { required: true, message: $t('请选择')},
    ]"
      >
        <el-select
          style="width: 300px"
          v-model="form.tag"
          filterable
          :placeholder="$t('请选择')"
          multiple
          multiple-limit="1"
          clearable=""
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item"
            :class="{ 'active': item.type === 3 }"
          >
          </el-option>
        </el-select>
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
    tagIds: {
      type: Array,
      default: []
    },
    id: {
      type: Number,
      default: null
    },
    businessId: {
      type: Number,
      default: null
    },
  },
  setup (props, { root, refs, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const form = reactive({
      tag: ""
    })
    const closeDialog = () => {
      emit('update:visible', false)
    }
    const options = ref(null)

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
      root.$Api.notificationManagement.getTagList(props.id, props.businessId).then(({ data, status }) => {
        if (status !== 200 || data.code !== 200) {
          return Promise.reject()
        }
        options.value = data.data.map(t => {
          return {
            label: t.name,
            value: t.id,
            type: t.type,
          }
        })
      }).catch(() => { })
      form.tag = props.tagIds
    })

    return {
      options,
      form,
      currentLang,
      closeDialog,
      submit,
    };
  },
};
</script>

<style scoped lang="scss">
.active {
    color: #7580E5;
}
</style>