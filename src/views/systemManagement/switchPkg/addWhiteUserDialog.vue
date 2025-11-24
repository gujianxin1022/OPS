<template>
  <el-dialog
    :title="$t('添加白名单')"
    :visible.sync="visible"
    @close="closeDialog"
    center
    width="900px"
  >

    <el-form
      ref="formRef"
      label-width="130px"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        :label="$t('家长id')"
        prop="parentUserId"
      >
        <el-input
          style="width: 300px"
          @blur="handleBlur"
          loading="true"
          v-model="form.parentUserId"
          :placeholder="$t('glb-input')+$t('家长id')"
        >
          <i
            class="el-icon-loading"
            slot="suffix"
            v-show="testParentUserNameLoading"
          >
          </i>
        </el-input>
      </el-form-item>
      <p
        class="error-tip"
        v-if="flagState.parentError"
      >{{flagState.parentError}}</p>
      <el-form-item
        :label="$t('')"
        prop="studentUserList"
        v-for="(item, index) in form.studentUserList"
        :key="item.id"
      >
        <div class="select-box-wrap">
          <el-space>
            <el-select
              class="select-box"
              v-model="item.studentUserId	"
              :placeholder="$t('请选择')"
              @change="(e)=>getCoursePkgUnderStudent(e, index)"
            >
              <el-option
                v-for="item in members"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              />
            </el-select>
            <el-select
              style="width: 150px"
              class="select-box"
              v-model="item.coursePackageId"
              :placeholder="$t('请选择')"
              @change="(e)=>handleCoursePackageChange(e, index)"
            >
              <el-option
                v-for="item in coursePkgList"
                :key="item.id"
                :label="getCoursePackageName(item)"
                :value="item.coursePackageId"
              />
            </el-select>
            <el-select
              style="width: 150px"
              class="select-box"
              v-model="item.packageTreeId"
              :placeholder="$t('请选择')"
              @change="handlePackageTreeChange(item.packageTreeId, item.coursePackageId, index)"
            >
              <el-option
                v-for="item in packageTreeList"
                :key="item.packageTreeId"
                :label="isEn ? item.editionNameOpsEn : item.editionNameOpsZh"
                :value="item.packageTreeId"
              />
            </el-select>
            <el-select
              style="width: 150px"
              class="select-box"
              v-model="item.courseId"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in levelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-space>
          <i
            @click="addItem"
            class="el-icon-plus ml10 mr10"
          ></i>
          <i
            @click.prevent="handleDelete(item)"
            class="el-icon-minus"
          ></i>
        </div>
      </el-form-item>
      <p
        class="error-tip"
        v-if="flagState.showError"
      >{{errorTip}}</p>
      <el-form-item
        :label="$t('拒绝切换原因')"
        prop="reason"
      >
        <el-input
          style="width: 300px"
          v-model="form.reason"
          :placeholder="$t('最多输入50字符')"
          maxlength="50"
          show-word-limit
          type="textarea"
          size="small"
          :autosize="{ minRows: 3}"
        ></el-input>
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
import { computed, defineComponent, reactive, ref, unref, watch } from '@vue/composition-api'
import { deepClone } from '../../../utils/handleData'
import { parentIdValidate } from "@/utils/reg.js";
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup (props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === 'en')
    const studentTpl = reactive({
      studentUserId: null,
      coursePackageId: null,
      packageTreeId: null,
      courseId: null,
      studentName: ''
    })
    const form = reactive({
      parentUserId: "",
      reason: '',
      studentUserList: []
    })
    const flagState = reactive({
      testParentUserNameLoading: false,
      showError: false,
      parentError: false
    })

    const errorTip = ref('')

    let rules = ref({})


    watch(() => form.studentUserList, () => {
      validateStudentList()
    }, { deep: true })

    const members = ref(null)

    const coursePkgList = ref(null)

    const packageTreeList = ref(null)

    const levelList = ref(null)

    const currentParentId = ref(null)

    const handleCoursePackageChange = async (packageId, index) => {
      form.studentUserList[index].packageTreeId = ''
      form.studentUserList[index].courseId = ''
      const {
        status,
        data: { code, data },
      } = await root.$Api.groupManagement.queryPackageTreeList({
        packageId,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      packageTreeList.value = data
    }

    const handlePackageTreeChange = async (packageTreeId, packageId, index) => {
      form.studentUserList[index].courseId = ''
      const {
        status,
        data: { code, data },
      } = await root.$Api.groupManagement.getCourseHierarchyData({
        packageId,
        packageTreeId,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      levelList.value = data || []
    }

    const getCoursePackageName = (item) => {
      return (
        item.coursePackageNameList.find((t) =>
          unref(isEn) ? t.languageCode === "EN" : t.languageCode === "CN"
        )?.name
      );
    };

    const getCoursePkgUnderStudent = (id, index) => {
      form.studentUserList[index].coursePackageId = ''
      form.studentUserList[index].packageTreeId = ''
      form.studentUserList[index].courseId = ''
      const params = {
        classType: 1,
        packageType: 1,
        studentUserId: id
      }
      root.$Api.systemManagement.getCoursePkgListUnderStudent(params).then(({ status, data: { data, code } }) => {
        if (status !== 200 || code !== 200) return Promise.reject()
        coursePkgList.value = data
      })
    }

    const validateStudentList = () => {
      const list = form.studentUserList
      if (checkStudentEmpty()) {
        errorTip.value = root.$t(`不能为空`)
        flagState.showError = true
      } else if (list.length !== 1 && !checkStudentSame()) {
        errorTip.value = root.$t(`已添加过`)
        flagState.showError = true
      } else {
        errorTip.value = ''
        flagState.showError = false
      }
    }

    const checkStudentSame = () => {
      const list = form.studentUserList
      if (list.length === 1) return true
      for (let i = 0; i < list.length - 1; i++) {
        for (let j = i + 1; j < list.length; j++) {
          if (list[i].studentUserId === list[j].studentUserId && list[i].coursePackageId === list[j].coursePackageId && list[i].packageTreeId === list[j].packageTreeId && list[i].courseId === list[j].courseId) {
            return false
          }
        }
      }
      return true
    }

    const checkStudentEmpty = () => {
      const notComplete = form.studentUserList.some(t => !t.studentUserId || !t.coursePackageId || !t.packageTreeId || !t.courseId)
      return notComplete
    }

    const addItem = () => {
      form.studentUserList.push(deepClone(studentTpl))
    }

    const handleDelete = (item) => {
      if (form.studentUserList.length === 1) return root.$notify.warning(root.$t('至少保留一个'))
      const index = form.studentUserList.indexOf(item)
      if (index !== -1) {
        form.studentUserList.splice(index, 1)
      }
    }

    const closeDialog = () => {
      emit('update:visible', false)
    }

    const submit = () => {
      if (!form.parentUserId) {
        flagState.parentError = root.$t('请输入家长ID');
        return
      }
      if (flagState.showError || flagState.parentError) return
      const submitParams = {
        ...form,
        parentUserId: unref(form.parentUserId),
        studentUserList: form.studentUserList.map(t => {
          return {
            ...t,
            studentName: unref(members).find(_t => _t.id === t.studentUserId).realName
          }
        })
      }
      refs.formRef.validate((valid) => {
        if (valid) {
          root.$Api.systemManagement.addRefuseSwitchWhiteUser(submitParams).then(({ status, data: { data, code } }) => {
            if (code !== 200 || status !== 200) return Promise.reject()
            root.$notify.success(root.$t('操作成功'))
            setTimeout(() => {
              emit('addSucess')
              root.$router.push('/system/resoluteSwitchPkgList')
            }, 800)
          })
        } else {
          return false
        }
      });
    }

    const handleBlur = () => {
      if (!form.parentUserId) {
        flagState.parentError = root.$t('请输入家长ID');
        return
      }
      if(!parentIdValidate(root, form.parentUserId)){
        return;
      }
      
      flagState.testParentUserNameLoading = true
      root.$Api.financeManagement.getStudentListByParentId({parentUserId:form.parentUserId, status:1}).then(({ status, data: { data, code } }) => {
        if (status !== 200 || code !== 200) return Promise.reject()
        members.value = data
        form.studentUserList = [deepClone(studentTpl)]
        flagState.testParentUserNameLoading = false
        flagState.parentError = null;
      }).catch(() => {
        flagState.parentError = root.$t('账号不存在或格式错误');
        flagState.testParentUserNameLoading = false
        form.studentUserList = []
      })
    }

    return {
      members,
      coursePkgList,
      packageTreeList,
      levelList,

      isEn,
      errorTip,
      rules,
      flagState,
      form,
      studentTpl,
      closeDialog,
      submit,
      handleBlur,
      addItem,
      handleDelete,
      getCoursePkgUnderStudent,
      getCoursePackageName,
      handleCoursePackageChange,
      handlePackageTreeChange
    }
  },
})
</script>
<style lang="scss" scoped>
.select-box-wrap {
  display: flex;
  align-items: center;
  .select-box {
    width: 130px;
  }
}
.error-tip {
  color: #ff4949;
  text-indent: 130px;
  font-size: 12px;
  margin-top: -10px;
}
</style>
