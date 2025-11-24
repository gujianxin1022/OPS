<template>
<div class="unit-details-wapper">
  <el-card shadow="hover" class="unit-details_title">
      <span class="UnitName">{{ $t("单元名称") }}</span>
      <span>{{ $route.query.unitName}}</span>
  </el-card>
  <div class="unit-details-table">
      <FormProvider :form="unitKnowledgeForm">
        <FormButtonGroup  align-form-item>
            <Submit  @submit="unitKnowledgeSubmit"> {{$t("保存发布")}}</Submit>
            <el-button class="unit-details_save--primary"
                      @click="unitKnowledgeSave"> {{$t("保存")}}</el-button>
            <el-button class="unit-details_save--primary"
                        @click="onUnitKnowledgeEdit">
              {{toggleUnitKnowledge? $t('可编辑'):$t('编辑')}}
            </el-button>
          </FormButtonGroup>
          <SchemaField :schema="unitKnowledgeSchema"/>
      </FormProvider>
  </div>
  <div class="unit-details-table">
    <FormProvider :form="unitSkillForm">
        <FormButtonGroup  align-form-item>
          <Submit
                   @submit="unitSkillSubmit">{{$t("保存发布")}}</Submit>
          <el-button
                  class="unit-details_save--primary"
                  @click="unitSkillSave"> {{$t("保存")}}</el-button>
          <el-button  class="unit-details_save--primary"
                      @click="onUnitSkillEdit">
             {{ toggleUnitSkills? $t('可编辑'): $t('编辑')}}
          </el-button>
        </FormButtonGroup>
        <SchemaField :schema="unitSkillSchema" />
    </FormProvider>
  </div>
  <div class="unit-details-table">
    <FormProvider  :form="communicationForm">
        <FormButtonGroup  align-form-item>
          <Submit
                 @submit="communicationSubmit">{{$t("保存发布")}}</Submit>
          <el-button
                    class="unit-details_save--primary"
                    @click="communicationSave"> {{$t("保存")}}</el-button>
          <el-button class="unit-details_save--primary"
                     @click="onOmmunicationEdit">
             {{toggleCommunication? $t('可编辑'):$t('编辑')}}
          </el-button>
        </FormButtonGroup>
        <SchemaField :schema="communicationSchema" />
    </FormProvider>
  </div>
</div>
</template>

<script>
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/vue'
import { Submit, FormItem, ArrayTable, Input, Editable,Switch } from '@formily/element'
import { EnglishUnitDetailServices,conversionSchema } from './services/api'
import UnitDetailTransform from './services/transform'
import { differenceBy } from 'lodash-es'


const fields = createSchemaField({
  components: {
    FormItem,
    ArrayTable,
    Switch,
    Input,
    Editable,
  },
})

export default {
  components: { FormProvider, Submit, ...fields },
  data() {
    const unitKnowledgeForm = createForm()
    const unitSkillForm = createForm()
    const communicationForm = createForm()
    return {
      unitKnowledgeForm,
      unitSkillForm,
      communicationForm,
      unitKnowledgeSchema:conversionSchema({
        title:'单元知识点',
        knowledgeDimension:'知识点维度',
        knowledgeContent:'知识点内容',
        when:'{{$deps[0] && $deps[1].length>=5}}'
      }),
      unitSkillSchema:conversionSchema({
        title:'单元技能',
        knowledgeDimension:'单元技能维度',
        knowledgeContent:'单元技能描述',
        when:'{{$deps[0] && $deps[1].length>=3}}'

      }),
      communicationSchema:conversionSchema({
        title:'课堂参与',
        knowledgeDimension:'课堂参与维度',
        knowledgeContent:'课堂参与描述',
        when:'{{$deps[0] && $deps[1].length>=3}}'

      }),
      toggleUnitKnowledge:false,
      toggleCommunication:false,
      toggleUnitSkills:false,
      unitKnowledges:[],
      communications:[],
      unitSkills:[],
      userId:JSON.parse(window.localStorage.getItem('userInfo')).id,
      userName:JSON.parse(window.localStorage.getItem('userInfo')).username
    }
  },
  mounted(){
      this.getUnitKnowledgeList();
      this.getUnitSkillList();
      this.getCommunicationList();
  },
  methods: {
   // TODO 建议使用 Composition-API 重构, 逻辑单元过于分散，不利于可读&维护
   getUnitKnowledgeList(){
        EnglishUnitDetailServices.getUnitKnowledgeList({
          unitId: this.$route.query.unitId,
          status:0
        }).then(res=>{
           if(res.data.code = 200){
              let data = UnitDetailTransform.responseKnowledgeTransform(res.data.data);
              //  this.unitKnowledges 辅助获取已删除 id 使用
              this.unitKnowledges = data;
              this.toggleUnitKnowledge = false;
              this.unitKnowledgeForm.setInitialValues({
                  array: data.length > 0?data:this.defaultFormList(4),
              })
           }
        });
   },
   onUnitKnowledgeEdit(){
      this.unitKnowledgeForm.submit().then(async (res)=>{
        this.toggleUnitKnowledge = !this.toggleUnitKnowledge
        this.unitKnowledgeForm.setValues({
              switchDisabled:this.toggleUnitKnowledge,
        });
      })
   },
   unitKnowledgeSave() {
      this.unitKnowledgeForm.submit().then(async (res)=>{
            let param = res.array;
            let newParam = UnitDetailTransform.requestKnowledgeTransform(param, this.$route.query.unitId)
            let ids = this.existDeleteIds({
                source:this.unitKnowledges,
                target:newParam,
                filter:'id'
            });
            let data = await EnglishUnitDetailServices.saveUnitKnowledge({
              unitId: this.$route.query.unitId,
              courseUnitKnowledgePointsIds:ids,
              courseUnitKnowledgePoints:newParam
            });
            if(data.data.code === 200){
              this.getUnitKnowledgeList();
              this.$message({
                  message: '保存成功',
                  type: 'success'
              });
            }
      });
    },
    async unitKnowledgeSubmit(...v) {
      let param = v;
      let newParam = UnitDetailTransform.requestKnowledgeTransform(param[0].array, this.$route.query.unitId);
      let ids = this.existDeleteIds({
          source:this.unitKnowledges,
          target:newParam,
          filter:'id'
      });
       let data = await EnglishUnitDetailServices.updateUnitKnowledge({
        unitId: this.$route.query.unitId,
        courseUnitKnowledgePointsIds:ids,
        courseUnitKnowledgePoints:newParam
      });
      if(data.data.code === 200){
          this.$message({
              message: '提交成功',
              type: 'success'
          });
          this.getUnitKnowledgeList();
       }
    },
    onUnitSkillEdit(){
           this.unitSkillForm.submit().then(async (res)=>{
                this.toggleUnitSkills = !this.toggleUnitSkills
                this.unitSkillForm.setValues({
                      switchDisabled:this.toggleUnitSkills,
                });
           });
    },
    getUnitSkillList(){
      EnglishUnitDetailServices.getUnitSkillList({
          unitId: this.$route.query.unitId,
          status:0
      }).then(res=>{
           if(res.data.code = 200){
              let data = UnitDetailTransform.responseSkillTransform(res.data.data);
              this.unitSkills = data;
              this.toggleUnitSkills = false;
              this.unitSkillForm.setInitialValues({
                  array: data.length > 0?data:this.defaultFormList(2),
              })
           }
      })
   },
   async unitSkillSave() {
      this.unitSkillForm.submit().then(async (res)=>{
            let param = res.array;
            let newParam = UnitDetailTransform.requestSkillTransform(param, this.$route.query.unitId);
            let ids = this.existDeleteIds({
                source:this.unitSkills,
                target:newParam,
                filter:'id'
            });
            let data = await EnglishUnitDetailServices.saveUnitSkill({
              unitId: this.$route.query.unitId,
              courseUnitSkills:newParam,
              courseUnitSkillsIds:ids
            });
            if(data.data.code === 200){
                this.$message({
                    message: '保存成功',
                    type: 'success'
                });
                this.getUnitSkillList();
            }
      })
    },
    async unitSkillSubmit(...v) {
      let param = v;
      let newParam = UnitDetailTransform.requestSkillTransform(param[0].array, this.$route.query.unitId);
      let ids = this.existDeleteIds({
          source:this.unitSkills,
          target:newParam,
          filter:'id'
      });
      let data = await EnglishUnitDetailServices.updateUnitSkill({
        unitId:this.$route.query.unitId,
        courseUnitSkills:newParam,
        courseUnitSkillsIds:ids
      });
       if(data.data.code === 200){
          this.$message({
              message: '提交成功',
              type: 'success'
          });
          this.getUnitSkillList();
       }

    },
   onOmmunicationEdit(){
      this.communicationForm.submit().then(async (res)=>{
          this.toggleCommunication = !this.toggleCommunication
          this.communicationForm.setValues({
                switchDisabled:this.toggleCommunication,
          });
      })
   },
   getCommunicationList(){
        EnglishUnitDetailServices.getCommunicationList({
          unitId: this.$route.query.unitId,
          status:0
        }).then(res=>{
           if(res.data.code = 200){
               let data = UnitDetailTransform.responseCommunicationTransform(res.data.data);
               this.communications = data;
               this.toggleCommunication = false;
               this.communicationForm.setInitialValues({
                  array: data.length > 0?data:this.defaultFormList(2),
              });
           }
        });
    },
   communicationSave() {
        this.communicationForm.submit().then(async (res)=>{
            let param = res.array;
            let newParam = UnitDetailTransform.requestCommunicationTransform(param,this.$route.query.unitId);
            let ids = this.existDeleteIds({
                source:this.communications,
                target:newParam,
                filter:'id'
            });
            let data = await EnglishUnitDetailServices.saveOrUpdateCommunication({
              status:0,
              unitId:this.$route.query.unitId,
              courseUnitPerformanceIds:ids,
              courseUnitPerformanceParamList:newParam
            });
            if(data.data.code === 200){
                this.$message({
                    message: '保存成功',
                    type: 'success'
                  });
                this.getCommunicationList();
            }
      });
    },
    async communicationSubmit(...v) {
      let param = v;
      let newParam = UnitDetailTransform.requestCommunicationTransform(param[0].array,this.$route.query.unitId);
      let ids = this.existDeleteIds({
          source:this.communications,
          target:newParam,
          filter:'id'
      });
      let data = await EnglishUnitDetailServices.saveOrUpdateCommunication({
        status:1,
        courseUnitPerformanceIds:ids,
        courseUnitPerformanceParamList:newParam,
        unitId:this.$route.query.unitId,
      });
      if(data.data.code === 200){
          this.$message({
              message:  '提交成功',
              type: 'success'
          });
          this.getCommunicationList();
      }
    },
    defaultFormList(count) {
      return Array.from(new Array(count)).map((_, key) => ({}))
    },
    existDeleteIds(obj) {
        let data = differenceBy(obj.source,obj.target,obj.filter);
        let ids = data.map(item=>{
            return item.id;
        }).filter(item=>{
            return !!item;
        });
        return ids;
     },
   },
}
</script>
<style lang="scss">
.unit-details-wapper{
   padding: 40px 80px;
   .unit-details_title{
     min-width: 800px;
     margin-bottom: 30px;
   }
   .unit-details_save--primary{
      background: #ffffff;
   }
   .unit-details-table{
      min-width: 800px;
      margin-bottom: 30px;
      border: 1px #DCDFE6 solid;
      padding: 20px;
   }
}
</style>
