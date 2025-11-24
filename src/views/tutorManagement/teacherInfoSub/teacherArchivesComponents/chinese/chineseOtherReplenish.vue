<template>
  <div>
    <div class="btn-box">
      <el-button
        v-show="isDisabled && Per.handleButtonPer('teach.tutorMT.teacherFile.allEditBtn')"
        @click="handleEditEvent"
      >
        {{$t('编辑')}}
      </el-button>
      <el-button
        v-show="!isDisabled"
        type="primary"
        @click="handleSave"
      >
        {{$t('preservation')}}
      </el-button>
      <el-button
        v-show="!isDisabled"
        @click="handleCancel"
      >
        {{$t('取消')}}
      </el-button>
    </div>
    <el-form
      ref="otherForm"
      :rules="rules"
      :model="otherForm"
      :label-width="currentLang === 'en' ? '200px' : '120px'"
    >
      <el-form-item prop="" :label="$t('紧急联系人姓名')+':'">
        <el-input
          v-model="otherForm.contactName"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('紧急联系人电话')+':'">
        <el-input
          v-model="otherForm.contactPhone"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('与您的关系')+':'">
        <el-input
          v-model="otherForm.contactRelation"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input')"
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('备注')+':'">
        <el-input
          v-model="otherForm.remark"
          :disabled="isDisabled"
          type="textarea"
          :placeholder="$t('glb-input')"
          :rows="4"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { markRaw, reactive, ref, unref, watch, computed, onMounted } from "@vue/composition-api";

export default {
  props: {
    otherSupplement: {type: Array, default: () => ({})},
    childIsUpdate: {type: Boolean, default: false},
  },
  setup(props, { root, emit, refs }) {
    const isDisabled = ref(true);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const otherForm = reactive({
      contactName: "", // 紧急联系人姓名
      contactPhone: "", // 紧急联系人电话
      contactRelation: "", // 与您的关系
      remark: "", // 备注
    })

    watch(
      () => props.childIsUpdate,
      (val) => {
        // console.log('更新基础信息: ', val);
        if (val) {
          updateComp()
        }
      }
    )
    
    const updateComp = () => {
      Object.assign(otherForm, props.otherSupplement);
      // handleCancel(); 不能使用这个，他会一直循环请求教师信息
      isDisabled.value = true; 
    }

    // 保存
    const handleSave = () => {
      emit('updateOther', {
        moduleName: 'otherSupplement',
        moduleData: otherForm
      })
    }
    // 编辑
    const handleEditEvent = () => {
      isDisabled.value = false;
    }
    // 取消
    const handleCancel = async () => {
      isDisabled.value = true
      emit('resetTeacherInfo');
    }

    return {
      isDisabled,
      currentLang,
      otherForm,
      handleSave,
      handleEditEvent,
      handleCancel,
    }
  }
}
</script>

<style lang='scss' scoped>
.btn-box {
  text-align: right;
  margin: 0 0 10px;
}
</style>