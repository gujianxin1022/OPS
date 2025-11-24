<template>
  <div class="skuMange">
    <div
      v-loading="skuMangeLoading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="加载中"
      element-loading-background="rgba(20, 34, 58, 0.8)"
    >
      <header>
        <span class="header-tilte">{{ $t("交易 - 商品编辑") }} </span>
      </header>
      <section>
        <el-radio-group v-model="skuType" class="ml80">
          <el-radio-button label="1">{{ $t("交易 - 课程") }}</el-radio-button>
          <el-radio-button label="2" disabled>{{
            $t("交易 - 实体")
          }}</el-radio-button>
          <el-radio-button label="3" disabled>{{
            $t("交易 - 虚拟")
          }}</el-radio-button>
        </el-radio-group>
        <el-row class="formBox ml60">
          <el-col :span="2" class="formLabel">{{
            $t("交易 - 售卖方式")
          }}</el-col>
          <el-col :span="12">
            <el-radio-group v-model="classInfoForm.saleType">
              <el-radio :label="0">{{ $t("交易 - 课时包") }}</el-radio>
              <el-radio :label="1" disabled>{{
                $t("交易 - 课程整体")
              }}</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <div>
          <h4 class="modeTitle">{{ $t("交易 - SPU信息") }}</h4>
          <div class="ml20">
            <p>{{ $t("交易 - 课程信息") }}:</p>
            <el-form
              ref="classInfoForm"
              :inline="true"
              :rules="classInfoRules"
              :model="classInfoForm"
              :label-width="currentLang === 'en' ? '200' : '120'"
              label-position="left"
            >
              <el-form-item :label="$t('交易 - 商户')">
                <el-select
                  v-if="limitType === LIMIT_TYPE.addSPU"
                  v-model="classInfoForm.merchant.id"
                  :placeholder="$t('请选择')"
                  disabled
                >
                  <el-option
                    v-for="item in merchantList"
                    :key="item.merchantId"
                    :label="item.merchantName"
                    :value="item.merchantId"
                  />
                </el-select>
                <span v-else>{{ classInfoForm.merchant.name }}</span>
              </el-form-item>
              <el-form-item label="app">
                <el-select
                  v-if="limitType === LIMIT_TYPE.addSPU"
                  v-model="classInfoForm.merchant.appId"
                  :placeholder="$t('请选择')"
                  disabled
                >
                  <el-option
                    v-for="item in appIdList"
                    :key="item.appId"
                    :label="item.appName"
                    :value="item.appId"
                  />
                </el-select>
                <span v-else>{{ classInfoForm.merchant.appName }}</span>
              </el-form-item>

              <br />
              <el-form-item :label="$t('学科')" prop="subjectTypeId">
                <el-select
                  v-if="limitType === LIMIT_TYPE.addSPU"
                  v-model="classInfoForm.subjectTypeId"
                  :placeholder="$t('请选择')"
                  :disabled="limitType !== LIMIT_TYPE.addSPU"
                  @change="getQueryList"
                >
                  <el-option
                    v-for="item in subjectTypeList"
                    :key="item.typeCode"
                    :label="
                      currentLang === 'zh' ? item.typeNameCn : item.typeNameEn
                    "
                    :value="item.typeCode"
                  />
                </el-select>
                <div v-else class="minW100 maxW150">
                  {{
                    (currentLang === "zh"
                      ? subjectTypeObj.typeNameCn
                      : subjectTypeObj.typeNameEn) || "--"
                  }}
                </div>
              </el-form-item>
              <el-form-item
                :label="$t('交易 - 课程包类型')"
                prop="courseTypeId"
              >
                <el-select
                  v-if="limitType === LIMIT_TYPE.addSPU"
                  v-model="classInfoForm.courseTypeId"
                  :placeholder="$t('请选择')"
                  :disabled="limitType !== LIMIT_TYPE.addSPU"
                  @change="getQueryList"
                >
                  <el-option
                    v-for="item in packageTypeList"
                    :key="item.typeCode"
                    :label="
                      currentLang === 'zh' ? item.typeNameCn : item.typeNameEn
                    "
                    :value="item.typeCode"
                  />
                </el-select>
                <div v-else style="width: 200px" class="minW100 maxW150">
                  {{
                    (currentLang === "zh"
                      ? courseTypeObj.typeNameCn
                      : courseTypeObj.typeNameEn) || "--"
                  }}
                </div>
              </el-form-item>
              <el-form-item :label="$t('交易 - 上课形态')" prop="classTypeId">
                <template v-if="limitType === LIMIT_TYPE.addSPU">
                  <el-select
                    v-model="classInfoForm.classTypeId"
                    :placeholder="$t('请选择')"
                    :disabled="limitType !== LIMIT_TYPE.addSPU"
                    @change="getQueryList"
                  >
                    <el-option
                      v-for="item in classTypeList"
                      :key="item.typeCode"
                      :label="
                        currentLang === 'zh' ? item.typeNameCn : item.typeNameEn
                      "
                      :value="item.typeCode"
                    />
                  </el-select>
                  <el-tooltip
                    :content="$t('订阅制SKU暂只支持直播1v1产品')"
                    placement="top"
                    @click.stop.prevent
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                </template>
                <div v-else class="minW100 maxW150">
                  {{
                    (currentLang === "zh"
                      ? classTypeObj.typeNameCn
                      : classTypeObj.typeNameEn) || "--"
                  }}
                </div>
              </el-form-item>
              <el-form-item
                :label="$t('选择课程包')"
                prop="relatedCoursePackageIdList"
              >
                <!-- v-if="limitType === LIMIT_TYPE.addSPU" -->
                <el-select
                  v-model="classInfoForm.relatedCoursePackageIdList"
                  :placeholder="$t('请选择')"
                  multiple
                  :collapse-tags="true"
                >
                  <el-option
                    v-for="item in coursePackageList"
                    :key="item.packageId"
                    :value="item.packageId"
                    :label="currentLang === 'zh' ? item.nameCn : item.nameEn"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('上课时长(分钟)')" prop="classDuration">
                <el-input-number
                  :placeholder="$t('请输入')"
                  controls-position="right"
                  v-model="classInfoForm.classDuration"
                  :min="0"
                >
                </el-input-number>
              </el-form-item>
              <el-form-item
                :label="$t('可转换为的SPU')"
                prop="transferCourseProductIdList"
              >
                <span slot="label">
                  <span>{{ $t("可转换为的SPU") }}</span>
                  <el-tooltip
                    :content="
                      $t(
                        '即该SPU可以转换为哪些SPU，或可以被哪些SPU中的课时所消耗。如SPU A的可转换SPU关联了SPU B和SPU C，则手动转课时时可将SPU A转换为SPU B和SPU C，或上SPU B或SPU C的课后可消耗SPUA的课时（如果开启自动消耗）'
                      )
                    "
                    placement="top"
                    @click.stop.prevent
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                </span>
                <FilterBySpuId
                  ref="FilterBySpuId"
                  @changeSelect="
                    (val) => {
                      classInfoForm.transferCourseProductIdList = val;
                    }
                  "
                  :initval="classInfoForm.transferCourseProductIdList"
                  :multiple="true"
                />
              </el-form-item>
              <el-form-item prop="valuable">
                <span slot="label">
                  <span>{{ $t("SPU转换基准价值") }}</span>
                  <el-tooltip
                    :content="
                      $t(
                        '即该SPU与其他SPU转换的汇率。如SPU A的基准价值为2000，SPU B的为1000，则1节SPU A课时可以转换为2节SPU B课时。1节SPU B的课时可以转换为0.5节SPU A的课时。'
                      )
                    "
                    placement="top"
                    @click.stop.prevent
                  >
                    <i class="el-icon-question" />
                  </el-tooltip>
                </span>
                <el-input-number
                  :placeholder="$t('请输入')"
                  controls-position="right"
                  v-model="classInfoForm.valuable"
                  :min="1"
                  :max="1000"
                  :step="1"
                  step-strictly
                >
                </el-input-number>
              </el-form-item>
              <el-button
                class=""
                type="primary"
                @click="drawer = true"
                v-show="limitType !== LIMIT_TYPE.addSPU"
                >{{ $t("课包映射关系") }}</el-button
              >
            </el-form>
            <hr />
          </div>
          <div class="ml20 clearfix">
            <p>{{ $t("交易 - 售卖信息") }}:</p>
            <el-form
              ref="sellForm"
              :inline="true"
              :rules="sellRules"
              :model="sellForm"
              :label-width="currentLang === 'zh' ? '260px' : '260px'"
              class="demo-sellForm"
              label-position="left"
            >
              <el-form-item :label="$t('交易 - SPU中文名称')" prop="nameCn">
                <el-input
                  v-model="sellForm.nameCn"
                  :placeholder="$t('请输入')"
                  :disabled="limitType !== LIMIT_TYPE.addSPU"
                  maxlength="50"
                  style="width: 300px"
                  @input.native="dontEmoji"
                />
              </el-form-item>
              <el-form-item
                :label="$t('交易 - SPU中文描述')"
                prop="descriptionCn"
              >
                <el-input
                  type="textarea"
                  v-model="sellForm.descriptionCn"
                  :placeholder="$t('请输入')"
                  :disabled="limitType === LIMIT_TYPE.addSKU"
                  style="width: 300px"
                  rows="1"
                  maxlength="200"
                  @input.native="dontEmoji"
                />
              </el-form-item>
              <br />
              <el-form-item
                class="upload-img"
                prop="cnWebPicture"
                :label-width="currentLang === 'en' ? '380px' : '265px'"
              >
                <div slot="label" class="label-slot clearfix">
                  <UploadImage
                    @uploadedSuccessfully="
                      (src) => {
                        sellForm.cnWebPicture = src;
                      }
                    "
                    :showImg="false"
                    :isReUpload="sellForm.cnWebPicture.length > 0"
                    class="fr"
                  />
                  <span class="fr mr10"
                    >{{ $t("SPU中文头图") }}{{ $t("学生Web") }}</span
                  >
                  <el-tooltip
                    :content="$t('尺寸1000x134px、文件大小小于2M')"
                    placement="top"
                    @click.stop.prevent
                    class="fr"
                  >
                    <i
                      class="el-icon-question"
                      style="padding-top: 9px; margin-right: 1px"
                    />
                  </el-tooltip>
                </div>
                <el-image
                  class="image-slot"
                  style="width: 250px; height: 50px"
                  :src="sellForm.cnWebPicture"
                  :preview-src-list="[sellForm.cnWebPicture]"
                >
                  <div slot="error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item
                class="upload-img"
                prop="cnIpadPicture"
                :label-width="currentLang === 'en' ? '380px' : '265px'"
              >
                <div slot="label" class="label-slot clearfix">
                  <UploadImage
                    @uploadedSuccessfully="
                      (src) => {
                        sellForm.cnIpadPicture = src;
                      }
                    "
                    :showImg="false"
                    :isReUpload="sellForm.cnIpadPicture.length > 0"
                    class="fr"
                  />
                  <span class="fr mr10"
                    >{{ $t("SPU中文头图") }}{{ $t("学生Pad") }}</span
                  >
                  <el-tooltip
                    :content="$t('尺寸1367x183px、文件大小小于2M')"
                    placement="top"
                    @click.stop.prevent
                    class="fr"
                  >
                    <i
                      class="el-icon-question"
                      style="padding-top: 9px; margin-right: 1px"
                    />
                  </el-tooltip>
                </div>
                <el-image
                  class="image-slot"
                  style="width: 250px; height: 50px"
                  :src="sellForm.cnIpadPicture"
                  :preview-src-list="[sellForm.cnIpadPicture]"
                >
                  <div slot="error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item
                class="upload-img"
                prop="cnAppPicture"
                :label-width="currentLang === 'en' ? '380px' : '265px'"
              >
                <div slot="label" class="label-slot clearfix">
                  <UploadImage
                    @uploadedSuccessfully="
                      (src) => {
                        sellForm.cnAppPicture = src;
                      }
                    "
                    :showImg="false"
                    :isReUpload="sellForm.cnAppPicture.length > 0"
                    class="fr"
                  />
                  <span class="fr mr10"
                    >{{ $t("SPU中文头图") }}{{ $t("家长APP") }}</span
                  >
                  <el-tooltip
                    :content="$t('尺寸375x85px、文件大小小于2M')"
                    placement="top"
                    @click.stop.prevent
                    class="fr"
                  >
                    <i
                      class="el-icon-question"
                      style="padding-top: 9px; margin-right: 1px"
                    />
                  </el-tooltip>
                </div>
                <el-image
                  class="image-slot"
                  style="width: 250px; height: 50px"
                  :src="sellForm.cnAppPicture"
                  :preview-src-list="[sellForm.cnAppPicture]"
                >
                  <div slot="error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item :label="$t('交易 - SPU英文名称')" prop="nameEn">
                <el-input
                  v-model="sellForm.nameEn"
                  :placeholder="$t('请输入')"
                  :disabled="limitType !== LIMIT_TYPE.addSPU"
                  maxlength="50"
                  style="width: 300px"
                  @input.native="dontEmoji"
                />
              </el-form-item>
              <el-form-item
                :label="$t('交易 - SPU英文描述')"
                prop="descriptionEn"
              >
                <el-input
                  type="textarea"
                  v-model="sellForm.descriptionEn"
                  :placeholder="$t('请输入')"
                  :disabled="limitType === LIMIT_TYPE.addSKU"
                  style="width: 300px"
                  rows="1"
                  maxlength="200"
                  @input.native="dontEmoji"
                />
              </el-form-item>
              <br />
              <el-form-item
                class="upload-img"
                prop="enWebPicture"
                :label-width="currentLang === 'en' ? '380px' : '265px'"
              >
                <div slot="label" class="label-slot clearfix">
                  <UploadImage
                    @uploadedSuccessfully="
                      (src) => {
                        sellForm.enWebPicture = src;
                      }
                    "
                    :showImg="false"
                    :isReUpload="sellForm.enWebPicture.length > 0"
                    class="fr"
                  />
                  <span class="fr mr10"
                    >{{ $t("SPU英文头图") }}{{ $t("学生Web") }}</span
                  >
                  <el-tooltip
                    :content="$t('尺寸1000px*134px、文件大小小于2M')"
                    placement="top"
                    @click.stop.prevent
                    class="fr"
                  >
                    <i
                      class="el-icon-question"
                      style="padding-top: 9px; margin-right: 1px"
                    />
                  </el-tooltip>
                </div>
                <el-image
                  class="image-slot"
                  style="width: 250px; height: 50px"
                  :src="sellForm.enWebPicture"
                  :preview-src-list="[sellForm.enWebPicture]"
                >
                  <div slot="error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item
                class="upload-img"
                prop="enIpadPicture"
                :label-width="currentLang === 'en' ? '380px' : '265px'"
              >
                <div slot="label" class="label-slot clearfix">
                  <UploadImage
                    @uploadedSuccessfully="
                      (src) => {
                        sellForm.enIpadPicture = src;
                      }
                    "
                    :showImg="false"
                    :isReUpload="sellForm.enIpadPicture.length > 0"
                    class="fr"
                  />
                  <span class="fr mr10"
                    >{{ $t("SPU英文头图") }}{{ $t("学生Pad") }}</span
                  >
                  <el-tooltip
                    :content="$t('尺寸1367x183px、文件大小小于2M')"
                    placement="top"
                    @click.stop.prevent
                    class="fr"
                  >
                    <i
                      class="el-icon-question"
                      style="padding-top: 9px; margin-right: 1px"
                    />
                  </el-tooltip>
                </div>
                <el-image
                  class="image-slot"
                  style="width: 250px; height: 50px"
                  :src="sellForm.enIpadPicture"
                  :preview-src-list="[sellForm.enIpadPicture]"
                >
                  <div slot="error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item
                class="upload-img"
                prop="enAppPicture"
                :label-width="currentLang === 'en' ? '380px' : '265px'"
              >
                <div slot="label" class="label-slot clearfix">
                  <UploadImage
                    @uploadedSuccessfully="
                      (src) => {
                        sellForm.enAppPicture = src;
                      }
                    "
                    :showImg="false"
                    :isReUpload="sellForm.enAppPicture.length > 0"
                    class="fr"
                  />
                  <span class="fr mr10"
                    >{{ $t("SPU英文头图") }}{{ $t("家长APP") }}</span
                  ><el-tooltip
                    :content="$t('尺寸375x85px、文件大小小于2M')"
                    placement="top"
                    @click.stop.prevent
                    class="fr"
                  >
                    <i
                      class="el-icon-question"
                      style="padding-top: 9px; margin-right: 1px"
                    />
                  </el-tooltip>
                </div>
                <el-image
                  class="image-slot"
                  style="width: 250px; height: 50px"
                  :src="sellForm.enAppPicture"
                  :preview-src-list="[sellForm.enAppPicture]"
                >
                  <div slot="error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item :label="$t('SPU法文名称')" prop="nameFra">
                <!-- :disabled="limitType !== LIMIT_TYPE.addSPU" -->
                <el-input
                  v-model="sellForm.nameFra"
                  :placeholder="$t('请输入')"
                  maxlength="50"
                  style="width: 300px"
                />
              </el-form-item>
              <el-form-item :label="$t('SPU法文描述')" prop="descriptionFra">
                <el-input
                  type="textarea"
                  v-model="sellForm.descriptionFra"
                  :placeholder="$t('请输入')"
                  :disabled="limitType === LIMIT_TYPE.addSKU"
                  style="width: 300px"
                  maxlength="200"
                  rows="1"
                />
              </el-form-item>
              <br />
              <el-form-item
                class="upload-img"
                prop="fraWebPicture"
                :label-width="currentLang === 'en' ? '380px' : '265px'"
              >
                <div slot="label" class="label-slot clearfix">
                  <UploadImage
                    @uploadedSuccessfully="
                      (src) => {
                        sellForm.fraWebPicture = src;
                      }
                    "
                    :showImg="false"
                    :isReUpload="sellForm.fraWebPicture.length > 0"
                    class="fr"
                  />
                  <span class="fr mr10"
                    >{{ $t("SPU法文头图") }}{{ $t("学生Web") }}</span
                  ><el-tooltip
                    :content="$t('尺寸1000px*134px、文件大小小于2M')"
                    placement="top"
                    @click.stop.prevent
                    class="fr"
                  >
                    <i
                      class="el-icon-question"
                      style="padding-top: 9px; margin-right: 1px"
                    />
                  </el-tooltip>
                </div>
                <el-image
                  class="image-slot"
                  style="width: 250px; height: 50px"
                  :src="sellForm.fraWebPicture"
                  :preview-src-list="[sellForm.fraWebPicture]"
                >
                  <div slot="error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item
                class="upload-img"
                prop="fraIpadPicture"
                :label-width="currentLang === 'en' ? '380px' : '265px'"
              >
                <div slot="label" class="label-slot clearfix">
                  <UploadImage
                    @uploadedSuccessfully="
                      (src) => {
                        sellForm.fraIpadPicture = src;
                      }
                    "
                    :showImg="false"
                    :isReUpload="sellForm.fraIpadPicture.length > 0"
                    class="fr"
                  />
                  <span class="fr mr10"
                    >{{ $t("SPU法文头图") }}{{ $t("学生Pad") }}</span
                  ><el-tooltip
                    :content="$t('尺寸1367x183px、文件大小小于2M')"
                    placement="top"
                    @click.stop.prevent
                    class="fr"
                  >
                    <i
                      class="el-icon-question"
                      style="padding-top: 9px; margin-right: 1px"
                    />
                  </el-tooltip>
                </div>
                <el-image
                  class="image-slot"
                  style="width: 250px; height: 50px"
                  :src="sellForm.fraIpadPicture"
                  :preview-src-list="[sellForm.fraIpadPicture]"
                >
                  <div slot="error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item
                class="upload-img"
                prop="fraAppPicture"
                :label-width="currentLang === 'en' ? '380px' : '265px'"
              >
                <div slot="label" class="label-slot clearfix">
                  <UploadImage
                    @uploadedSuccessfully="
                      (src) => {
                        sellForm.fraAppPicture = src;
                      }
                    "
                    :showImg="false"
                    :isReUpload="sellForm.fraAppPicture.length > 0"
                    class="fr"
                  />
                  <span class="fr mr10"
                    >{{ $t("SPU法文头图") }}{{ $t("家长APP") }}</span
                  ><el-tooltip
                    :content="$t('尺寸375x85px、文件大小小于2M')"
                    placement="top"
                    @click.stop.prevent
                    class="fr"
                  >
                    <i
                      class="el-icon-question"
                      style="padding-top: 9px; margin-right: 1px"
                    />
                  </el-tooltip>
                </div>
                <el-image
                  class="image-slot"
                  style="width: 250px; height: 50px"
                  :src="sellForm.fraAppPicture"
                  :preview-src-list="[sellForm.fraAppPicture]"
                >
                  <div slot="error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item
                style="width: 30%"
                :label="$t('售卖地区')"
                prop="country"
              >
                <el-select
                  v-model="sellForm.country"
                  :placeholder="$t('请选择')"
                  style="width: 300px"
                  :disabled="limitType !== LIMIT_TYPE.addSPU"
                >
                  <el-option
                    v-for="item in countryList"
                    :key="item.code"
                    :label="currentLang === 'zh' ? item.nameZh : item.nameEn"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                style="width: 30%"
                :label="$t('支付条款协议')"
                prop="agreementId"
              >
                <!-- :disabled="limitType !== LIMIT_TYPE.addSPU" -->
                <el-select
                  v-model="sellForm.agreementId"
                  :placeholder="$t('请选择')"
                  style="width: 300px"
                >
                  <el-option
                    v-for="item in agreementList"
                    :key="item.id"
                    :label="currentLang === 'zh' ? item.titleCh : item.titleEn"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                style="width: 30%"
                :label="$t('交易 - 排序')"
                prop="sort"
              >
                <el-input-number
                  style="width: 300px"
                  v-model="sellForm.sort"
                  :min="1"
                  @input.native="onInput"
                />
              </el-form-item>
              <el-form-item
                style="width: 30%"
                :label="$t('交易 - 是否上架')"
                prop="status"
              >
                <el-radio-group
                  style="width: 300px"
                  v-model="sellForm.status"
                  :disabled="limitType == LIMIT_TYPE.addSKU"
                >
                  <el-radio :label="1">{{ $t("交易 - 上架") }}</el-radio>
                  <el-radio :label="0">{{ $t("交易 - 下架") }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                style="width: 30%"
                :label="$t('交易 - 是否在商城显示')"
                prop="appShow"
              >
                <el-radio-group
                  style="width: 300px"
                  v-model="sellForm.appShow"
                  :disabled="limitType == LIMIT_TYPE.addSKU"
                >
                  <el-radio :label="1">{{ $t("交易 - 显示") }}</el-radio>
                  <el-radio :label="0">{{ $t("交易 - 隐藏") }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                style="width: 30%"
                :label="$t('课程回放有效期（天）')"
                prop="sort"
              >
                <el-select
                  v-model="sellForm.videoExpire"
                  :placeholder="$t('请选择')"
                  clearable
                >
                  <el-option
                    v-for="item in replayValidityList"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="dashed"></div>
            <div class="multi-currency">
              <p>{{ $t("多币种定价") }}：</p>
              <div
                :class="
                  !costListValidate
                    ? 'currency-warp clearfix warn-border'
                    : 'currency-warp clearfix'
                "
              >
                <div class="currency" v-for="item in costList" :key="item.id">
                  <el-input-number
                    :placeholder="$t('请输入')"
                    controls-position="right"
                    v-model="item.cost"
                    :min="0.0"
                    :precision="2"
                    style="margin-bottom: 10px"
                  >
                  </el-input-number>
                  <span>{{ item.currency }}</span>
                </div>
              </div>
              <div
                class="warning-text"
                :style="!costListValidate ? '' : 'display:none'"
              >
                {{ $t("请输入") }}
              </div>
            </div>
            <el-button class="fr" type="primary" @click="save">{{
              $t("保存")
            }}</el-button>
          </div>
          <hr v-if="limitType !== LIMIT_TYPE.addSPU" />
        </div>
        <div v-if="limitType !== LIMIT_TYPE.addSPU">
          <h4 class="modeTitle">{{ $t("交易 - SKU信息") }}</h4>
          <div class="ml20">
            <el-button class="add-btn fr" type="primary" @click="addSKU">{{
              $t("交易 - 添加SKU")
            }}</el-button>
            <SKUTable
              :tableData="tableData"
              :limitType="limitType"
              :agreementList="agreementList"
              :sellForm="sellForm"
              :classTypeId="classInfoForm.classTypeId"
              :currencyList="currencyList"
              :spuInfo="spuInfo"
              @refresh="getSPUdetail()"
            />
          </div>
        </div>
      </section>
    </div>
    <SkuDialog
      v-if="showSkuDialog && currencyList.length > 0"
      :visible.sync="showSkuDialog"
      :agreementList="agreementList"
      :currencyList="currencyList"
      :spuInfo="spuInfo"
      @refresh="getSPUdetail()"
      type="新增"
    />
    <el-drawer
      v-if="drawer"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
      :title="$t('课包映射关系')"
    >
      <coursePackageRelationship style="width: 1000px" />
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SKUTable from "./components/SKUTable.vue";
import SkuDialog from "./components/SkuDialog.vue";
import { LIMIT_TYPE } from "./components/constants";
import UploadImage from "@/components/Upload/UploadImage.vue";
import FilterBySpuId from "@/components/FilterItem/CommodityFilter/FilterBySpuId";
import coursePackageRelationship from "@/views/financeManagement/productManagement/coursePackageRelationship.vue";

export default {
  name: "SKUManage",
  components: {
    SKUTable,
    UploadImage,
    SkuDialog,
    FilterBySpuId,
    coursePackageRelationship,
  },
  data() {
    return {
      drawer: false,
      showSkuDialog: false,
      banner: [
        { zh: { imgSrc: "" } },
        { en: { imgSrc: "" } },
        { fr: { imgSrc: "" } },
      ],
      skuType: 1,
      LIMIT_TYPE,
      spuId: "",
      classInfoForm: {
        saleType: 0,
        subjectTypeId: "",
        courseTypeId: "",
        classTypeId: "",
        coursePackageId: "",
        merchant: {
          id: "",
          appId: "",
        },
        classDuration: 0,
        transferCourseProductIdList: [],
        relatedCoursePackageIdList: [],
        valuable: 0,
      },
      classInfoRules: {
        subjectTypeId: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        courseTypeId: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        classTypeId: [{ required: true, message: "请选择", trigger: "change" }],
        relatedCoursePackageIdList: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        classDuration: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        valuable: [{ required: true, message: "请选择", trigger: "change" }],
      },
      sellForm: {
        nameCn: "",
        descriptionCn: "",
        nameEn: "",
        descriptionEn: "",
        cost: "",
        country: "",
        agreementId: "",
        sort: 1,
        status: 1,
        appShow: 1,
        cnWebPicture: "",
        cnIpadPicture: "",
        cnAppPicture: "",
        enWebPicture: "",
        enIpadPicture: "",
        enAppPicture: "",
        fraWebPicture: "",
        fraIpadPicture: "",
        fraAppPicture: "",
        videoExpire: "",
      },
      sellRules: {
        nameCn: [{ required: true, message: "请输入", trigger: "blur" }],
        descriptionCn: [{ required: true, message: "请输入", trigger: "blur" }],
        nameEn: [{ required: true, message: "请输入", trigger: "blur" }],
        descriptionEn: [{ required: true, message: "请输入", trigger: "blur" }],
        nameFra: [{ required: true, message: "请输入", trigger: "blur" }],
        descriptionFra: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        cost: [{ required: true, message: "请输入", trigger: "blur" }],
        country: [{ required: true, message: "请输入", trigger: "change" }],
        sort: [{ required: true, message: "请输入", trigger: "blur" }],
        agreementId: [{ required: true, message: "请输入", trigger: "change" }],
        status: [{ required: true, message: "请输入", trigger: "change" }],
        appShow: [{ required: true, message: "请输入", trigger: "change" }],
        cnWebPicture: [
          { required: true, message: "请上传", trigger: "change" },
        ],
        cnIpadPicture: [
          { required: true, message: "请上传", trigger: "change" },
        ],
        cnAppPicture: [
          { required: true, message: "请上传", trigger: "change" },
        ],
        enWebPicture: [
          { required: true, message: "请上传", trigger: "change" },
        ],
        enIpadPicture: [
          { required: true, message: "请上传", trigger: "change" },
        ],
        enAppPicture: [
          { required: true, message: "请上传", trigger: "change" },
        ],
        fraWebPicture: [
          { required: true, message: "请上传", trigger: "change" },
        ],
        fraIpadPicture: [
          { required: true, message: "请上传", trigger: "change" },
        ],
        fraAppPicture: [
          { required: true, message: "请上传", trigger: "change" },
        ],
      },
      tableData: [],
      limitType: 0,
      merchantList: [],
      appIdList: [],
      subjectTypeList: [],
      packageTypeList: [],
      classTypeList: [],
      coursePackageList: [],
      agreementList: [],
      countryList: [],
      isSave: "",
      skuMangeLoading: false,
      currencyList: [],
      subjectTypeObj: {},
      courseTypeObj: {},
      classTypeObj: {},
      coursePackageObj: {},
      costList: [],
      spuInfo: null,
      costListValidate: true,
      replayValidityList: [
        { label: "7", value: 7 },
        { label: "365", value: 365 },
      ],
    };
  },
  computed: {
    ...mapState({
      currentLang: (state) => state.app.currentLang,
    }),
  },
  mounted() {
    // limitType: 1:新建一个spu, 2:只添加sku上线15个, 3:修改spu信息和sku信息的 状态 & 是否在商城显示 & sku列表排序
    this.limitType = +this.$route.query.limitType; // 从query中取到的参数是字符串类型，'+'转数字
    this.initData();
  },
  watch: {
    "classInfoForm.merchant.id"(newData) {
      this.merchantList.forEach((item) => {
        if (item.merchantId === newData) {
          this.appIdList = item?.appIdInfoList ?? [];
          // 本期默认显示第一条数据
          this.classInfoForm.merchant.appId = this.appIdList
            ? item?.appIdInfoList[0]?.appId
            : "";
        }
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.isSave) return next();
    this.$confirm(
      this.$t("关闭后将不会保存页面中修改的内容, 确定要关闭并离开该页面吗?"),
      this.$t("交易 - 提示"),
      {
        confirmButtonText: this.$t("离开页面"),
        cancelButtonText: this.$t("继续编辑"),
        type: "warning",
      }
    )
      .then((_) => {
        next();
      })
      .catch((_) => {});
  },
  methods: {
    handleClose() {
      this.drawer = false;
    },
    customizeValidate() {
      this.costListValidate = !this.costList.some(function checknumber(e) {
        return e.cost < 0;
      });
      return this.costListValidate;
    },
    async initData() {
      await this.getOptionData();
      if (this.limitType === LIMIT_TYPE.addSPU) return;
      await this.getSPUdetail();
    },
    // 获取下拉数据
    async getOptionData() {
      await Promise.all([
        this.$Api.systemManagement.getCountryAll(), // 国家地区列表
        this.$Api.systemManagement.getAgreement(), // 支付协议列表
        this.$Api.systemManagement.getMerchantAppId(), // 商户信息
        this.$Api.systemManagement.getSubjectClassTypeList(), // 学科/课程包类型/上课形态列表
        this.$Api.systemManagement.getCurrency(), // 币种列表
      ])
        .then((res) => {
          // 国家地区列表
          this.countryList = res[0].data?.data;
          // 支付协议列表
          this.agreementList = res[1].data?.data;
          // 商户信息
          this.merchantList = res[2].data?.data ?? [];
          this.classInfoForm.merchant.id = this.merchantList.length // 本期默认显示第一条数据
            ? res[2].data?.data[0]?.merchantId
            : "";
          // 学科/课程包类型/上课形态列表
          this.subjectTypeList = res[3].data.data?.subjectTypeList;
          this.packageTypeList = res[3].data.data?.packageTypeList;
          this.classTypeList = res[3].data.data?.classTypeList;
          // 币种列表
          this.currencyList = res[4];
          this.costList = [];
          this.currencyList.forEach((e) => {
            let item = {
              currency: e.currency,
              cost: 0,
              id: null,
            };
            this.costList.push(item);
          });
        })
        .catch((err) => {
          console.log("接口错了");
        });
    },
    // 获取详情信息
    async getSPUdetail() {
      this.skuMangeLoading = true;
      try {
        const {
          status,
          data: { code, data },
        } = await this.$Api.systemManagement.getSKUDetails(
          this.$route.query.spuId
        );
        if (status !== 200 || code !== 200) return Promise.reject();
        this.spuInfo = data.spu;
        this.classInfoForm = {
          saleType: data.spu.saleType,
          subjectTypeId: data.spu.subjectType.typeCode,
          courseTypeId: data.spu.courseType.typeCode,
          classTypeId: data.spu.classType.typeCode,
          coursePackageId: data.spu.coursePackage.packageId,
          relatedCoursePackageIdList: data.spu.relatedCoursePackageIdList,
          transferCourseProductIdList: data.spu.transferCourseProductIdList,
          classDuration: data.spu.classDuration,
          valuable: data.spu.valuable,
          merchant: data.spu.merchant ?? {
            id: 0,
            name: "--",
            appId: 0,
            appName: "--",
          },
        };
        this.$refs.FilterBySpuId.selectId =
          data.spu.transferCourseProductIdList;
        this.subjectTypeObj = data.spu.subjectType;
        this.courseTypeObj = data.spu.courseType;
        this.classTypeObj = data.spu.classType;
        this.coursePackageObj = data.spu.coursePackage;
        this.sellForm = {
          nameCn: data.spu.nameCn,
          descriptionCn: data.spu.descriptionCn,
          nameEn: data.spu.nameEn,
          descriptionEn: data.spu.descriptionEn,
          nameFra: data.spu.nameFra,
          descriptionFra: data.spu.descriptionFra,
          cost: data.spu.cost,
          currency: data.spu.currency,
          country: data.spu.country,
          agreementId: data.spu.agreementId,
          sort: data.spu.sort,
          status: data.spu.status,
          appShow: data.spu.appShow,
          videoExpire:data.spu.videoExpire,
          cnWebPicture: data.spu.cnWebPicture || "",
          cnIpadPicture: data.spu.cnIpadPicture || "",
          cnAppPicture: data.spu.cnAppPicture || "",

          enWebPicture: data.spu.enWebPicture || "",
          enIpadPicture: data.spu.enIpadPicture || "",
          enAppPicture: data.spu.enAppPicture || "",

          fraWebPicture: data.spu.fraWebPicture || "",
          fraIpadPicture: data.spu.fraIpadPicture || "",
          fraAppPicture: data.spu.fraAppPicture || "",

        };
        if (data.spu.costList && data.spu.costList.length > 0) {
          this.costList.forEach((e) => {
            data.spu.costList.forEach((i) => {
              if (e.currency === i.currency) {
                e.cost = i.cost;
                e.id = i.id;
              }
            });
          });
        }
        this.spuId = data.spu.spuId;
        this.tableData = data.spu.skus ?? [];
        // 初始赋值，表单会触发‘change’监听的校验，在这里清空一下
        this.$nextTick(() => {
          this.$refs["classInfoForm"]?.clearValidate();
          this.$refs["sellForm"]?.clearValidate();
        });
        this.getQueryList();
      } finally {
        this.skuMangeLoading = false;
      }
    },
    // 保存
    async save() {
      // limitType 为1时需全部校验， 为2时只需校验sku，为3时无需校验(这里把2和3归为一类，校验sku)

      let promiseList = Promise.all([
        this.$refs["classInfoForm"].validate(),
        this.$refs["sellForm"].validate(),
      ]);
      if (!(await this.customizeValidate())) return;
      await promiseList
        .then(() => {
          // 后端逻辑更改，前端配合修改传参数据结构
          Object.assign(this.classInfoForm, {
            coursePackage: { packageId: this.classInfoForm.coursePackageId },
            courseType: { typeCode: this.classInfoForm.courseTypeId },
            subjectType: { typeCode: this.classInfoForm.subjectTypeId },
            classType: { typeCode: this.classInfoForm.classTypeId },
          });
          let params = {
            ...this.classInfoForm,
            ...this.sellForm,
            ...{ spuId: this.spuId },
            costList: this.costList,
          };
          params.coursePackage.packageId = params.relatedCoursePackageIdList[0];
          params.coursePackageId = params.relatedCoursePackageIdList[0];
          params.relatedCoursePackageIdList =
            params.relatedCoursePackageIdList.slice(1);
          this.$Api.systemManagement
            .saveCourseProduct(params)
            .then(({ status, data: { code } }) => {
              if (status === 200 && code === 200) {
                this.isSave = true;
                this.$message.success("操作成功");
                this.close();
              }
            });
        })
        .catch((err) => {
          err
            ? this.$message.error(err)
            : this.$message.error("请检查是否输入完成");
        });
    },
    // 添加SKU
    addSKU() {
      this.showSkuDialog = true;
      return;
      // if (this.tableData.length >= 15) return this.$message.error('最多添加十五条') // 限制不要了
      this.tableData.push({
        skuId: "",
        amount: "",
        nameCn: "",
        nameEn: "",
        totalPrice: "",
        supportCoin: 0,
        coinUpperLimit: "",
        supportSubscribe: 0,
        subscribeCycleUnit: "",
        validityType: "",
        validityTime: "",
        status: "",
        appShow: "",
        coinMallShow: "",
        coinExchangeAmount: "",
        agreementId: "",
        url: "",
      });
    },
    // 关闭
    close() {
      this.$router.push({
        path: "/financeManagement/commodityManage",
      });
    },
    // 查询课程包
    getQueryList() {
      // spu详情页，不需要清空
      if (this.limitType === LIMIT_TYPE.addSPU) {
        // 每次查询清空课程包
        this.classInfoForm.coursePackageId = "";
      }
      let params = {
        appId: this.classInfoForm.merchant.appId,
        subjectType: this.classInfoForm.subjectTypeId,
        packageType: this.classInfoForm.courseTypeId,
        classType: this.classInfoForm.classTypeId,
      };
      this.$Api.systemManagement
        .getQueryList(params)
        .then(({ status, data: { code, data } }) => {
          if (status === 200) {
            this.coursePackageList = data;
          }
        });
    },
    onInput(e) {
      e.target.value = e.target.value.replace(/[^\d]/g, "");
    },
    dontEmoji(e) {
      e.target.value = e.target.value.replace(
        /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g,
        ""
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.skuMange {
  padding: 20px;
  .header-tilte {
    display: inline-block;
    width: 100%;
    padding: 0 0 10px;
    margin: 0 0 10px;
    border-bottom: 1px solid black;
  }
  .formBox {
    line-height: 50px;
    .formLabel {
      text-align: right;
      font-size: 14px;
      font-weight: 700;
      color: #606266;
      padding: 0 12px 0 0;
    }
  }
  .modeTitle {
    margin: 0;
  }
  .demo-sellForm {
    .el-form-item {
      width: 30%;
    }
    .upload-img {
      width: 30%;
      .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: #f5f7fa;
        color: #909399;
        font-size: 14px;
      }
    }
  }
  .add-btn {
    margin: 20px 0 10px;
  }
  .dashed {
    width: 100%;
    border-top: #606266 dashed 1px;
  }
  .multi-currency {
    position: relative;
    padding-bottom: 15px;
    .currency-warp {
      .currency {
        margin-right: 20px;
        flex: 1;
        width: 30%;
        float: left;
      }
    }
    .warn-border {
      border: 1px solid;
      border-color: red !important;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .warning-text {
      position: absolute;
      left: 0;
      bottom: 0;
      color: #ff4949;
      font-size: 12px;
    }
  }
  .label-slot {
    display: inline;
    vertical-align: bottom;
    width: 100%;
  }
}
::v-deep .el-input-group__append {
  background-color: #fff;
}
.disabledAppend {
  ::v-deep .el-input-group__append {
    background-color: #f5f7fa;
  }
}
::v-deep .el-input-number {
  .el-input-number__increase,
  .el-input-number__decrease {
    background: #7580e5;
    color: #fff;
  }
}
</style>
