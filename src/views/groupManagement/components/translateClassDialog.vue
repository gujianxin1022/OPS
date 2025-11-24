<template>
  <el-dialog
    @close="closeDialog"
    :title="$t('转班')"
    :visible.sync="visible"
    center
    width="1000px"
  >
    <div class="info mb10">
      <span
        class="mr10">{{$t('学员原班信息')}}：{{isEn ? classInfo.className : classInfo.classNameZh}}</span>
      <el-tag
        class="mr5"
        type="danger"
        v-if="classInfo.ageLabel"
      >
        {{Filters.ageLabelFilter(classInfo.ageLabel)}}
      </el-tag>
      <el-tag
        class="mr5"
        type="danger"
        v-if="classInfo.languageLabel"
      >
        {{Filters.languageLabelFilter(classInfo.languageLabel, isEn)}}
      </el-tag>
    </div>
    <div class="item-wrap mb20">
      <span class="mr10 mb10 wrap">
        {{$t('上课周期')}}：{{Filters.normalWeekListMap(classInfo.weekList, isEn) || '-'}}
      </span>
      <span class="mr10 mb10 wrap">
        {{$t('下节课日期')}}：{{DateTimeUtils.dateClockTime(classInfo.nextCourseTime) || '-'}}
      </span>
    </div>
    <div class="mb20 item-wrap">
      <span
        class="mr10 wrap mb10">{{$t('下节课老师')}}：{{classInfo.tutorRealName || '-'}}</span>
      <span
        class="mr10 wrap mb10">{{$t('下节课进度')}}：{{(isEn ? classInfo.nextLessonDescEN : classInfo.nextLessonDescZH) || '-'}}</span>
    </div>
    <el-tabs
      v-model="activeType"
      type="card"
    >
      <el-tab-pane
        v-for="item of Constants.getTranslateClassType(isEn)"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      />
    </el-tabs>

    <NotSameProgressClass
      v-show="activeType === NOT_SAME_PROGRESS"
      :refferInfo="refferInfo"
      :classInfo="classInfo"
      :activeType="activeType"
      @translateSuccess="translateSuccess"
    />
    <SameProgressClass
      v-show="activeType === SAME_PROGRESS"
      :refferInfo="refferInfo"
      :classInfo="classInfo"
      :activeType="activeType"
      @translateSuccess="translateSuccess"
    />
  </el-dialog>
</template>
<script>
import { defineComponent, computed, ref, watch, onMounted } from '@vue/composition-api'
import NotSameProgressClass from './notSameProgressClass.vue'
import SameProgressClass from './sameProgressClass.vue'
import { SAME_PROGRESS, NOT_SAME_PROGRESS } from '@/utils/constants'


export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    refferInfo: {
      type: Object,
      default: {
        sid: null,
        classId: null,
        studentName: '',
        coursePackageId: null
      }
    }
  },
  components: { NotSameProgressClass, SameProgressClass },
  setup (props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === 'en');
    const activeType = ref(SAME_PROGRESS)
    const classInfo = ref({})
    const closeDialog = () => { emit('update:visible', false) }
    onMounted(() => {
      root.$Api.groupManagement.getClassInfo(props.refferInfo.classId).then(({ status, data: { code, data } }) => {
        if (status !== 200 || code !== 200) return Promise.reject()
        classInfo.value = data
      }).catch(() => { })
    })
    const translateSuccess = () => {
      emit('closeTranslateDialog')
    }
    return {
      isEn,
      classInfo,
      NOT_SAME_PROGRESS,
      SAME_PROGRESS,
      activeType,
      closeDialog,
      translateSuccess
    }
  },
})
</script>
<style lang="scss" scoped>
.info {
  font-weight: bold;
}
.item-wrap {
  display: inline-block;
  width: 45%;
  .wrap {
    display: inline-block;
    width: 100%;
    word-break: break-word;
  }
}
</style>
