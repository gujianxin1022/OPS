import Layout from '@/views/layout/Layout'
const routerMap = [{
  path: 'unitReport',
  component: resolve => require(['@/views/reportManagement/unitReport.vue'], resolve),
  name: 'unitReport',
  meta: {
    title: {
      nameZh: '单元报告',
      nameEn: 'Progress Report'
    }
  }
},
{
  path: 'firstClassFeedback',
  component: resolve => require(['@/views/reportManagement/firstClassFeedback.vue'], resolve),
  name: 'firstClassFeedback',
  meta: {
    title: {
      nameZh: '试听课反馈',
      nameEn: 'Trial Lesson Feedback'
    }
  }
},
{
  path: 'firstLessonTeaching',
  component: resolve => require(['@/views/reportManagement/firstLessonTeaching.vue'], resolve),
  name: 'firstLessonTeaching',
  meta: {
    title: {
      nameZh: '试听课反馈督查',
      nameEn: 'Trial Report Teaching'
    }
  }
},
{
  path: 'firstClassReportTemplate',
  component: resolve => require(['@/views/reportManagement/firstClassReportTemplate.vue'], resolve),
  name: 'firstClassReportTemplate',
  meta: {
    title: {
      nameZh: '试听课反馈模板',
      nameEn: 'Trial Report Template'
    }
  }
},
{
  path: 'audited',
  component: resolve => require(['@/views/reportManagement/unitReportSub/audited.vue'], resolve),
  name: 'audited',
  meta: { title: {
    nameZh: '待审核',
    nameEn: 'Audited'
  } }
},
{
  path: 'auditFailed',
  component: resolve => require(['@/views/reportManagement/unitReportSub/auditFailed.vue'], resolve),
  name: 'auditFailed',
  meta: {
    title: {
      nameZh: '审核未通过',
      nameEn: 'AuditFailed'
    }
  }
},
{
  path: 'auditSuccessed',
  component: resolve => require(['@/views/reportManagement/unitReportSub/auditSuccessed.vue'], resolve),
  name: 'auditSuccessed',
  meta: {
    title: {
      nameZh: '审核通过',
      nameEn: 'AuditSuccessed'
    }
  }
},
{
  path: 'feedbackAudited',
  component: resolve => require(['@/views/reportManagement/firstClassFeedbackSub/audited.vue'], resolve),
  name: 'feedbackAudited',
  meta: { title: {
    nameZh: '待审核',
    nameEn: 'Audited'
  }}
},
{
  path: 'feedbackAuditFailed',
  component: resolve => require(['@/views/reportManagement/firstClassFeedbackSub/auditFailed.vue'], resolve),
  name: 'feedbackAuditFailed',
  meta: {
    title: {
      nameZh: '审核未通过',
      nameEn: 'AuditFailed'
    }
  }
},
{
  path: 'feedbackAuditSuccessed',
  component: resolve => require(['@/views/reportManagement/firstClassFeedbackSub/auditSuccessed.vue'], resolve),
  name: 'feedbackAuditSuccessed',
  meta: {
    title: {
      nameZh: '审核通过',
      nameEn: 'FeedbackAuditSuccessed'
    }
  }
},
{
  path: 'addTrialReportTemplate',
  component: resolve => require(['@/views/reportManagement/firstClassFeedbackSub/addTrialReportTemplate.vue'], resolve),
  name: 'addTrialReportTemplate',
  meta: {
    title: {
      nameZh: '添加模板',
      nameEn: 'addTrialReportTemplate'
    }
  }
},
{
  path: 'editTemplate',
  component: resolve => require(['@/views/reportManagement/firstClassFeedbackSub/editTemplate.vue'], resolve),
  name: 'editTemplate',
  meta: {
    title: {
      nameZh: '编辑模板',
      nameEn: 'editTemplate'
    }
  }
},{
  path: 'editMultilingualTemplate',
  component: resolve => require(['@/views/reportManagement/firstClassFeedbackSub/editMultilingualTemplate.vue'], resolve),
  name: 'editMultilingualTemplate',
  meta: {
    title: {
      nameZh: '编辑模板',
      nameEn: 'editMultilingualTemplate'
    }
  }
},
{
  path: 'templateLinkClass',
  component: resolve => require(['@/views/reportManagement/templateLinkClass.vue'], resolve),
  name: 'templateLinkClass',
  meta: {
    title: {
      nameZh: '关联课堂',
      nameEn: 'templateLinkClass'
    }
  }
},
]
const reportManagement = {
  path: '/reportManagement',
  component: Layout,
  children: routerMap
}
export default reportManagement
