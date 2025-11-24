<template>
  <div class="points-product-info-warp">
    <div class="title mb20">
      <span>{{
        operationType === "create" ? $t("新建积分商品") : $t("编辑积分商品")
      }}</span>
      <el-tooltip style="width: 500px" effect="dark" placement="bottom">
        <div slot="content" style="padding: 0 10px; line-height: 20px">
          {{ $t("使用说明：") }}
          <br />{{ $t("1：暂不支持课包类积分商品的创建，和课时商品冲突。") }}
          <br />{{
            $t(
              "2：每天限购总量：只有电子券类型的商品才会有该属性，表示该商品所有用户每天可兑换的数量合，超过之后，不可兑换。默认0，不限制。"
            )
          }}
          <br />{{
            $t("3：兑换限制：主要限制商品的兑换，防止高价值物品被大量兑换。")
          }}
          <br />{{
            $t("4：在兑换限制的时候，如果选择【天】，需要填限购数量。")
          }}
          <br />{{
            $t(
              "5：限购数量：在有兑换限制的时候，填入限购数量，是指在选择时间段内，用户可兑换该商品的总数量。"
            )
          }}
          <br />{{
            $t("6：商品有效期：上架商品在过了有效期之后，会自动下架。")
          }}
          <br />{{
            $t("7：装饰生效天数：该属性主要是电子教室商品兑换的时长。")
          }}
          <br />{{ $t("8：关联内容：直播课堂装饰，录播课对应的ID") }} <br />{{
            $t("9：兑换天数：绘本会员有效天数")
          }}
          <br />{{
            $t(
              "10：学习资料：支持文件格式（mp3，mp4，mov，png，pdf，jpeg，ppt，pptx，zip，jpg，gif）"
            )
          }}
          <br />{{ $t("11：其他可咨询研发") }}
        </div>
        <i class="el-icon-question" />
      </el-tooltip>
    </div>
    <el-form
      class="my-form"
      :style="`height:${contentHeight}px`"
      :rules="rules"
      ref="myForm"
      :model="formState"
      label-width="120px"
      :label-position="isEn ? 'top' : 'right'"
      inline-message
    >
      <el-form-item :label="$t('商品名称')" prop="nameCommon">
        <el-input
          maxlength="80"
          show-word-limit
          :placeholder="$t('请输入中文描述')"
          class="w200"
          v-model="formState.nameCommon.zh"
        ></el-input>
        <el-input
          maxlength="80"
          show-word-limit
          :placeholder="$t('请输入英文描述')"
          class="w200"
          v-model="formState.nameCommon.en"
        ></el-input>
        <el-input
          maxlength="80"
          show-word-limit
          :placeholder="$t('请输入法语描述')"
          class="w200"
          v-model="formState.nameCommon.fr"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('商品类目')" prop="catalogId">
        <el-cascader
          v-model="catalog"
          :options="catalogList"
          :disabled="operationType === 'edit'"
          :props="{
            expandTrigger: 'hover',
            children: 'productCatalogDetailList',
            label: 'name',
            value: 'id',
          }"
          @change="handleCatalog"
        ></el-cascader>
      </el-form-item>
      <el-form-item
        v-if="[2].includes(formState.catalogId)"
        :label="$t('学习资料')"
        prop="downloadLink"
      >
        <UploadToS3
          class="upload-to-s3"
          style="display: inline-block"
          ref="uploadStudyMaterials"
          :config="uploadConfigState.allFileType"
          @changFileData="uploadSuccessFun"
        />
        <el-button
          v-if="operationType === 'edit'"
          @click="handelDownload"
          type="text"
        >
          {{ $t("下载资料") }}
        </el-button>
      </el-form-item>
      <el-form-item
        v-if="
          [4].includes(formState.catalogId) ||
          ([1].includes(formState.catalogId) &&
            [1].includes(formState.catalogDetailId))
        "
        :label="formState.catalogId === 4 ? $t('装饰生效天数') : $t('兑换天数')"
        prop="redeemNum"
      >
        <el-input-number
          v-model="formState.redeemNum"
          :step="1"
          :max="9999"
          :min="0"
        ></el-input-number>
        <span style="color: #606266"> {{ $t("天") }}</span>
      </el-form-item>
      <el-form-item
        v-if="
          [1, 4].includes(formState.catalogId) &&
          ![1].includes(formState.catalogDetailId)
        "
        :label="$t('关联内容')"
        prop="reference"
      >
        <el-input
          clearable
          maxlength="10"
          show-word-limit
          :placeholder="$t('请输入')"
          class="w200"
          v-model="formState.reference"
          @input="formState.reference = formState.reference.replace(/\D/g, '')"
        ></el-input>
        <el-tooltip
          style="width: 200px"
          effect="dark"
          :content="`请输入${tipsMap[formState.catalogDetailId]}ID`"
          placement="right"
        >
          <i class="el-icon-question" />
        </el-tooltip>
      </el-form-item>
      <el-form-item
        v-if="[3].includes(formState.catalogId)"
        :label="$t('每天限购总量')"
        prop="limitsDay"
      >
        <el-input-number
          v-model="formState.limitsDay"
          :step="1"
          :max="9999"
          :min="0"
        ></el-input-number>
        <el-tooltip style="width: 200px" effect="dark" placement="right">
          <div slot="content" style="width: 300px; line-height: 18px">
            {{
              $t(
                "每天限购总量： 每天限制兑换的总数量，例如：京东卡，每天限制兑换10张，兑换完之后，任何用户不可兑换，需要每天0点刷新， 为0无限制。"
              )
            }}
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('兑换限制')" prop="limitsTime">
        <el-select
          v-model="formState.limitsTime"
          filterable
          :collapse-tags="true"
          :placeholder="$t('请选择')"
          @change="changeSelect"
          :disabled="
            ([1].includes(formState.catalogId) &&
              [2].includes(formState.catalogDetailId)) ||
            [2].includes(formState.catalogId)
          "
        >
          <el-option
            v-for="item in Constants.limitsList(isEn)"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-tooltip style="width: 200px" effect="dark" placement="right">
          <div slot="content" style="width: 300px; line-height: 18px">
            {{ $t("无限制：用户可以随便兑换，没有任何限制。") }}
            <br />
            {{
              $t(
                "只允许兑换一个：用户只允许兑换一次，再次兑换会提示用户：”已兑换“"
              )
            }}<br />{{
              $t(
                "天：用户每天限制兑换的数量，需要和限购数量一起使用。例如京东卡，每天限制用户兑换一个，那么兑换限制选择天，限购数量填 1 。"
              )
            }}
            <!-- <br />{{ $t("周： 同天") }} <br />{{ $t("月： 同天") }} <br />{{
              $t("年： 同天")
            }} -->
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
      </el-form-item>
      <el-form-item
        v-if="[1, 2, 3, 4].includes(formState.limitsTime)"
        :label="$t('限购数量')"
        prop="limits"
      >
        <el-input-number
          v-model="formState.limits"
          :step="1"
          :max="9999"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('商品标签')" prop="tabDesc">
        <el-input
          clearable
          maxlength="10"
          show-word-limit
          :placeholder="$t('请输入中文描述')"
          class="w200"
          v-model="formState.tabDesc.zh"
        ></el-input>
        <el-input
          clearable
          maxlength="20"
          show-word-limit
          :placeholder="$t('请输入英文描述')"
          class="w200"
          v-model="formState.tabDesc.en"
        ></el-input>
        <el-input
          clearable
          maxlength="20"
          show-word-limit
          :placeholder="$t('请输入法语描述')"
          class="w200"
          v-model="formState.tabDesc.fr"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('活动价')" prop="unitCoin">
        <el-input-number
          v-model="formState.unitCoin"
          :step="1"
          :max="999999"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('原价')" prop="originalCoin">
        <el-input-number
          v-model="formState.originalCoin"
          :step="1"
          :max="999999"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('当前库存')" prop="inventory">
        <el-input-number
          v-model="formState.inventory"
          :step="1"
          :max="9999"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('商品有效期')" prop="validStartTime">
        <FilterByTimePeriod
          @changeSelect="
            (timeArr) => {
              formState.validStartTime = timeArr[0];
              formState.validEndTime = timeArr[1];
            }
          "
          :defaultTimeArr="defaultTimeArr"
        />
      </el-form-item>
      <el-form-item v-show="formState.catalogId === 3">
        <div slot="label">
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content" style="width: 300px">
              {{ $t("提示") }}:
              <br />
              {{
                $t(
                  "1.请按模板格式上传数据，系统将会按照表格内容随机发放给用户；"
                )
              }}<br />{{
                $t(
                  "2.上传的券码之间不得重复，且不得与之前上传过的券码重复，否则本次全部上传失败，需要修正数据后再次上传本次的全部数据；"
                )
              }}<br />{{ $t("3.真实库存≥当前库存才能保存。") }}
            </div>
            <span class="change-reason">
              {{ $t("真实库存") }}
              <i class="el-icon-question"></i>
            </span>
          </el-tooltip>
        </div>
        <span style="color: #606266">{{ formState.actualInventory }}</span>
        <CouponUpload
          style="display: inline-block"
          ref="CouponUpload"
          @setRandomNum="
            (val) => {
              formState.detailNo = val;
            }
          "
          @ok="setActualInventory"
          :operationType="operationType"
          :id="productDetail.id"
        />
        <el-button type="text">
          <a href="https://priv.cdn.lingoace.com/OPS/券码上传模板.xlsx">{{
            $t("下载模板")
          }}</a>
        </el-button>
      </el-form-item>
      <el-form-item :label="$t('商品说明')" prop="descCommon">
        <el-input
          type="textarea"
          clearable
          rows="10"
          maxlength="1000"
          show-word-limit
          :placeholder="$t('请输入中文描述')"
          class="w200"
          v-model="formState.descCommon.zh"
        ></el-input>
        <el-input
          type="textarea"
          rows="10"
          clearable
          maxlength="1000"
          show-word-limit
          :placeholder="$t('请输入英文描述')"
          class="w200"
          v-model="formState.descCommon.en"
        ></el-input>
        <el-input
          type="textarea"
          rows="10"
          clearable
          maxlength="1000"
          show-word-limit
          :placeholder="$t('请输入法语描述')"
          class="w200"
          v-model="formState.descCommon.fr"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('商品首图')" prop="firstImage">
        <div style="color: #c0c4cc; font-size: 12px">
          {{ $t("尺寸建议305px*305px,大小2M以下,最多1张") }}
        </div>
        <div>
          <span
            :style="`margin-left: ${
              isEn ? 0 : -40
            }px; color: #72767b; vertical-align: middle`"
            >{{ $t("中文") }}</span
          >
          <UploadToS3
            class="upload-to-s3"
            style="display: inline-block"
            ref="uploadFirstImageZh"
            :config="uploadConfigState.headerPicConfig"
            @changFileData="
              (list) => {
                formState.firstImage.zh = list;
              }
            "
          />
        </div>
        <div>
          <span
            :style="`margin-left: ${
              isEn ? 6 : -40
            }px; color: #72767b; vertical-align: middle`"
            >{{ $t("英文") }}</span
          >
          <UploadToS3
            class="upload-to-s3"
            ref="uploadFirstImageEn"
            :config="uploadConfigState.headerPicConfig"
            @changFileData="
              (list) => {
                formState.firstImage.en = list;
              }
            "
          />
        </div>
        <div>
          <span
            :style="`margin-left: ${
              isEn ? 7 : -40
            }px; color: #72767b; vertical-align: middle`"
            >{{ $t("法语") }}</span
          >
          <UploadToS3
            class="upload-to-s3"
            ref="uploadFirstImageFr"
            :config="uploadConfigState.headerPicConfig"
            @changFileData="
              (list) => {
                formState.firstImage.fr = list;
              }
            "
          />
        </div>
      </el-form-item>
      <el-form-item :label="$t('商品主图')" prop="mainImage">
        <div style="color: #c0c4cc; font-size: 12px">
          {{
            $t(
              "尺寸建议705px(580px+100px),大小2M以下,最多6张,可拖拽图片调整显示顺序"
            )
          }}
        </div>
        <div>
          <span
            :style="`margin-left: ${
              isEn ? 0 : -40
            }px; color: #72767b; vertical-align: middle`"
            >{{ $t("中文") }}</span
          >
          <UploadToS3
            class="upload-to-s3"
            style="display: inline-block"
            ref="uploadMainImageZh"
            :config="uploadConfigState.mainPicConfig"
            @changFileData="
              (list) => {
                formState.mainImage.zh = list;
              }
            "
          />
        </div>
        <div>
          <span
            :style="`margin-left: ${
              isEn ? 6 : -40
            }px; color: #72767b; vertical-align: middle`"
            >{{ $t("英文") }}</span
          >
          <UploadToS3
            class="upload-to-s3"
            ref="uploadMainImageEn"
            :config="uploadConfigState.mainPicConfig"
            @changFileData="
              (list) => {
                formState.mainImage.en = list;
              }
            "
          />
        </div>
        <div>
          <span
            :style="`margin-left: ${
              isEn ? 7 : -40
            }px; color: #72767b; vertical-align: middle`"
            >{{ $t("法语") }}</span
          >
          <UploadToS3
            class="upload-to-s3"
            ref="uploadMainImageFr"
            :config="uploadConfigState.mainPicConfig"
            @changFileData="
              (list) => {
                formState.mainImage.fr = list;
              }
            "
          />
        </div>
      </el-form-item>
      <el-form-item :label="$t('商品详情图')" prop="detailImage">
        <div style="color: #c0c4cc; font-size: 12px">
          {{
            $t(
              "尺寸建议710px*(1~1065)px,大小2M以下,最多6张,可拖拽图片调整显示顺序"
            )
          }}
        </div>
        <div>
          <span
            :style="`margin-left: ${
              isEn ? 0 : -40
            }px; color: #72767b; vertical-align: middle`"
            >{{ $t("中文") }}</span
          >
          <UploadToS3
            class="upload-to-s3"
            style="display: inline-block"
            ref="uploadDetailImageZh"
            :config="uploadConfigState.detailedPicConfig"
            @changFileData="
              (list) => {
                formState.detailImage.zh = list;
              }
            "
          />
        </div>
        <div>
          <span
            :style="`margin-left: ${
              isEn ? 6 : -40
            }px; color: #72767b; vertical-align: middle`"
            >{{ $t("英文") }}</span
          >
          <UploadToS3
            class="upload-to-s3"
            ref="uploadDetailImageEn"
            :config="uploadConfigState.detailedPicConfig"
            @changFileData="
              (list) => {
                formState.detailImage.en = list;
              }
            "
          />
        </div>
        <div>
          <span
            :style="`margin-left: ${
              isEn ? 7 : -40
            }px; color: #72767b; vertical-align: middle`"
            >{{ $t("法语") }}</span
          >
          <UploadToS3
            class="upload-to-s3"
            ref="uploadDetailImageFr"
            :config="uploadConfigState.detailedPicConfig"
            @changFileData="
              (list) => {
                formState.detailImage.fr = list;
              }
            "
          />
        </div>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="close" type="text">{{ $t("取消") }}</el-button>
      <el-button @click="submit" :loading="loading" type="primary">{{
        $t("保存")
      }}</el-button>
    </div>
  </div>
</template>
<script>
import { onMounted, ref, computed, watch } from "@vue/composition-api";
import UploadToS3 from "@/components/Upload/uploadToS3";
import CouponUpload from "./CouponUpload.vue";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import fileDownload from "js-file-download";
import axios from "axios";
import { deepClone } from "@/utils/handleData";

export default {
  components: { UploadToS3, CouponUpload, FilterByTimePeriod },
  props: {
    visible: { type: Boolean, default: false },
    operationType: { type: String, default: "" },
    productInfo: {
      type: Object,
      default: {},
    },
  },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const defaultTimeArr = ref([]);
    const productDetail = ref({});
    const initData = () => {
      let info = props.productInfo;
      formState.value = {
        nameCommon: info.nameCommon
          ? JSON.parse(info?.nameCommon)
          : {
              zh: "",
              en: "",
              fr: "",
            },
        tabDesc: info.tabDesc
          ? JSON.parse(info?.tabDesc)
          : {
              zh: "",
              en: "",
              fr: "",
            },
        descCommon: info.descCommon
          ? JSON.parse(info?.descCommon)
          : {
              zh: "",
              en: "",
              fr: "",
            },
        unitCoin: info.unitCoin,
        originalCoin: info.originalCoin,
        inventory: info.inventory || 0,
        firstImage: initImg(info.firstImage, "firstImage"),
        mainImage: initImg(info.mainImage, "mainImage"),
        detailImage: initImg(info.detailImage, "detailImage"),
        downloadLink: info.downloadLink,
        limitsTime: info.limitsTime,
        limitsDay: info.limitsDay,
        limits: info.limits,
        redeemNum: info.redeemNum,
        validStartTime: info.validStartTime,
        validEndTime: info.validEndTime,
        reference: info.reference,
      };
      defaultTimeArr.value = [info.validStartTime, info.validEndTime];
      catalog.value = [info.catalogId];
      info.catalogDetailId && catalog.value.push(info.catalogDetailId);
      if (info.downloadLink) {
        root.$nextTick(() => {
          if (info.downloadLink) {
          }
          refs.uploadStudyMaterials.fileDataList = [
            {
              imgSrc: info.downloadLink,
              filePath: info.downloadLink,
              mask: false,
              name: `学习资料.${checkFileType(info.downloadLink)}`,
              type: checkFileType(info.downloadLink),
            },
          ];
        });
      }
    };
    const imageTypes = ["png", "jpg", "jpeg", "gif", "bmp", "webp"];
    const audioTypes = [
      "mp3",
      "wav",
      "ogg",
      "m4a",
      "mid",
      "wma",
      "flac",
      "mpc",
      "ape",
      "spx",
      "opus",
    ];
    const videoTypes = [
      "mp4",
      "m4v",
      "avi",
      "mkv",
      "mov",
      "mpg",
      "mpeg",
      "wmv",
      "flv",
      "3gp",
      "3g2",
      "webm",
    ];
    const checkFileType = (url) => {
      let type = url.split(".")[url.split(".").length - 1];
      let attachmentType;
      attachmentType = type;
      if (imageTypes.includes(type)) {
        attachmentType = "image";
      }
      if (audioTypes.includes(type)) {
        attachmentType = "audio";
      }
      if (videoTypes.includes(type)) {
        attachmentType = "video";
      }
      return attachmentType;
    };
    const initImg = (imgList, key) => {
      if (!imgList) {
        return {
          zh: [],
          en: [],
          fr: [],
        };
      }
      let zhArr = [];
      let enArr = [];
      let frArr = [];
      imgList.forEach((e) => {
        switch (e.language) {
          case "zh":
            zhArr = e.imageDetail || [];
            break;
          case "en":
            enArr = e.imageDetail || [];
            break;
          case "fr":
            frArr = e.imageDetail || [];
            break;
        }
      });
      zhArr.forEach((e) => {
        e.imgSrc = e.url;
        e.filePath = e.url;
        e.uid = e.id;
        e.mask = false;
        e.type = checkFileType(e.url);
      });
      enArr.forEach((e) => {
        e.imgSrc = e.url;
        e.filePath = e.url;
        e.uid = e.id;
        e.mask = false;
        e.type = checkFileType(e.url);
      });
      frArr.forEach((e) => {
        e.imgSrc = e.url;
        e.filePath = e.url;
        e.uid = e.id;
        e.mask = false;
        e.type = checkFileType(e.url);
      });
      switch (key) {
        case "firstImage":
          refs.uploadFirstImageZh.fileDataList = zhArr;
          refs.uploadFirstImageEn.fileDataList = enArr;
          refs.uploadFirstImageFr.fileDataList = frArr;
          break;
        case "mainImage":
          refs.uploadMainImageZh.fileDataList = zhArr;
          refs.uploadMainImageEn.fileDataList = enArr;
          refs.uploadMainImageFr.fileDataList = frArr;
          break;
        case "detailImage":
          refs.uploadDetailImageZh.fileDataList = zhArr;
          refs.uploadDetailImageEn.fileDataList = enArr;
          refs.uploadDetailImageFr.fileDataList = frArr;
          break;
      }
      return {
        zh: zhArr,
        en: enArr,
        fr: frArr,
      };
    };
    const loading = ref(false);
    /* 表单校验 */
    const formState = ref({
      nameCommon: {
        zh: "",
        en: "",
        fr: "",
      },
      tabDesc: {
        zh: "",
        en: "",
        fr: "",
      },
      descCommon: {
        zh: "",
        en: "",
        fr: "",
      },
      unitCoin: 0,
      originalCoin: 0,
      inventory: 0,
      firstImage: {
        zh: [],
        en: [],
        fr: [],
      },
      mainImage: {
        zh: [],
        en: [],
        fr: [],
      },
      detailImage: {
        zh: [],
        en: [],
        fr: [],
      },
      catalogId: null,
      catalogDetailId: null,
      reference: "",
      limitsTime: -1,
      limits: null,
      limitsDay: null,
      validStartTime: "",
      validEndTime: "",
      redeemNum: null,
      downloadLink: null,
      detailNo: null,
      actualInventory:0
    });
    const tipMaps = {
      zh: root.$t("请输入中文描述"),
      en: root.$t("请输入英文描述"),
      fr: root.$t("请输入法语描述"),
    };
    const tipMapsForImg = {
      zh: root.$t("请上传中文图片"),
      en: root.$t("请上传英文图片"),
      fr: root.$t("请上传法语图片"),
    };
    const validateProductName = async (rule, value, callback) => {
      for (let key in value) {
        if (!value[key]) {
          callback(new Error(tipMaps[key]));
        }
      }
    };
    const validateProductTag = async (rule, value, callback) => {
      let tagArr = [];
      for (let key in value) {
        tagArr.push(value[key]);
      }
      let isEmpty = tagArr.every((e) => {
        return e.length === 0;
      });
      if (!isEmpty) {
        for (let key in value) {
          if (!value[key]) {
            callback(new Error(tipMaps[key]));
          }
        }
      }
    };
    const validateDescCommon = async (rule, value, callback) => {
      let tagArr = [];
      for (let key in value) {
        tagArr.push(value[key]);
      }
      let isEmpty = tagArr.every((e) => {
        return e.length === 0;
      });
      if (!isEmpty) {
        for (let key in value) {
          if (!value[key]) {
            callback(new Error(tipMaps[key]));
          }
        }
      }
    };
    const validateActivityPrice = async () => {
      refs.myForm.validateField("originalCoin");
    };
    const validateOriginalPrice = async (rule, value, callback) => {
      if (value && value < formState.value.unitCoin) {
        callback(new Error(root.$t("商品原价需要≥活动价")));
      }
    };
    const validateFirstOrMainImage = async (rule, value, callback) => {
      for (let key in value) {
        if (value[key]?.length <= 0) {
          callback(new Error(tipMapsForImg[key]));
        }
      }
    };
    const validateDetailImg = async (rule, value, callback) => {
      let tagArr = [];
      for (let key in value) {
        tagArr.push(value[key]);
      }
      let isEmpty = tagArr.every((e) => {
        return e.length === 0;
      });
      if (!isEmpty) {
        for (let key in value) {
          if (value[key]?.length <= 0) {
            callback(new Error(tipMapsForImg[key]));
          }
        }
      }
    };
    const validateRedeemNum = async (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error(root.$t("装饰生效天数需要大于0")));
      }
    };
    const rules = {
      nameCommon: [
        { required: true, validator: validateProductName, trigger: "change" },
      ],
      tabDesc: [
        { required: false, validator: validateProductTag, trigger: "change" },
      ],
      descCommon: [
        { required: false, validator: validateDescCommon, trigger: "change" },
      ],
      unitCoin: [
        { required: true, validator: validateActivityPrice, trigger: "change" },
      ],
      originalCoin: [
        {
          required: false,
          validator: validateOriginalPrice,
          trigger: "change",
        },
      ],
      inventory: [
        { required: true, message: root.$t("请输入"), trigger: "change" },
      ],
      firstImage: [
        {
          required: true,
          validator: validateFirstOrMainImage,
          trigger: "change",
        },
      ],
      mainImage: [
        {
          required: true,
          validator: validateFirstOrMainImage,
          trigger: "change",
        },
      ],
      detailImage: [
        { required: false, validator: validateDetailImg, trigger: "change" },
      ],
      catalogId: [
        { required: true, message: root.$t("请选择"), trigger: "blur" },
      ],
      reference: [
        { required: true, message: root.$t("请输入"), trigger: "change" },
      ],
      limitsTime: [
        { required: true, message: root.$t("请输入"), trigger: "change" },
      ],
      limits: [
        { required: true, message: root.$t("请输入"), trigger: "change" },
      ],
      validStartTime: [
        { required: true, message: root.$t("请输入"), trigger: "change" },
      ],
      redeemNum: [
        { required: true, validator: validateRedeemNum, trigger: "change" },
      ],
      downloadLink: [
        { required: true, message: root.$t("请上传"), trigger: "change" },
      ],
    };
    const close = () => {
      emit("update:visible", false);
    };
    /* 后端提交要求图片平铺 */
    const mergeImageLists = (imgMap) => {
      let list = [];
      for (let langKey in imgMap) {
        imgMap[langKey].forEach((e) => {
          let item = {
            language: langKey,
            url: e.filePath,
            id: e.id || null,
          };
          list.push(item);
        });
      }
      return list;
    };
    const submit = async () => {
      await refs["myForm"].validate();
      const params = deepClone(formState.value);
      params.firstImage = mergeImageLists(params.firstImage);
      params.mainImage = mergeImageLists(params.mainImage);
      params.detailImage = mergeImageLists(params.detailImage);
      params.id = props.productInfo.id;
      params.redeemNum = params.redeemNum === 0 ? null : params.redeemNum;
      params.limitsDay = params.limitsDay === 0 ? null : params.limitsDay;
      delete params.actualInventory
      try {
        loading.value = true;
        if (props.operationType === "create") {
          await root.$Api.financeManagement.reqAddPointsProduct(params);
        } else {
          await root.$Api.financeManagement.reqUpdatePointsProduct(params);
        }
        root.$notify.success(root.$t("操作成功"));
        emit("refresh");
        close();
      } finally {
        loading.value = false;
      }
    };

    /* 上传 */
    const getSignUrl = async (fileType) => {
      /* 获取预签名函数 */
      const res = await root.$Api.financeManagement.reqPointsMallUploadSign({
        fileType: fileType,
      });
      return res;
    };
    const uploadConfigState = {
      headerPicConfig: {
        accept: "image/jpg, image/png, image/jpeg",
        limit: 1,
        maxSize: 2,
        multiple: false,
        showImgList: true,
        getSignFun: getSignUrl,
      },
      mainPicConfig: {
        accept: "image/jpg, image/png, image/jpeg",
        limit: 6,
        maxSize: 2,
        multiple: true,
        showImgList: true,
        getSignFun: getSignUrl,
      },
      detailedPicConfig: {
        accept: "image/jpg, image/png, image/jpeg",
        limit: 6,
        maxSize: 2,
        multiple: true,
        showImgList: true,
        getSignFun: getSignUrl,
      },
      allFileType: {
        accept: ".mp3,.mp4,.mov,.png,.pdf,.jpeg,.ppt,.pptx,.zip,.jpg,.gif",
        limit: 1,
        maxSize: 20000,
        multiple: false,
        showImgList: true,
        getSignFun: getSignUrl,
        pasteUpload: false,
      },
    };
    const setActualInventory = (val) => {
      formState.value.actualInventory=val
    };
    onMounted(async () => {
      await reqCatalogList();
      if (props.operationType === "edit") {
        productDetail.value = deepClone(props.productInfo);
        initData();
      }
    });
    const catalog = ref([]);
    const catalogList = ref([]);
    let tipsMap = ref({});
    const reqCatalogList = async () => {
      const res = await root.$Api.coinManagement.getPointsMallCatalogList();
      catalogList.value = res || [];
      tipsMap.value = res[0].productCatalogDetailList
        .concat(res[3].productCatalogDetailList)
        .reduce(function (result, item) {
          result[item.id] = item.name;
          return result;
        }, {});
    };

    watch(
      () => catalog.value,
      (val) => {
        formState.value.catalogId = val[0];
        formState.value.catalogDetailId = val[1];
        if ((val[0] === 1 && val[1] === 2) || val[0] === 2) {
          formState.value.limitsTime = 0;
        }
      }
    );
    const uploadSuccessFun = async (fileList) => {
      if (!fileList.length) {
        formState.value.downloadLink = null;
        return;
      }
      formState.value.downloadLink = fileList[0].filePath;
    };
    const handleCatalog = (ids) => {
      if (ids[0] === 5) {
        root.$notify.warning(root.$t("暂不支持创建该类目商品"));
        catalog.value = [];
      }
      refs.myForm.clearValidate();
    };
    const handelDownload = () => {
      let type =
        props.productInfo.downloadLink.split(".")[
          props.productInfo.downloadLink.split(".").length - 1
        ];
      axios
        .get(props.productInfo.downloadLink, {
          responseType: "blob", // 必须设置responseType为blob
        })
        .then((res) => {
          fileDownload(res.data, `学习资料.${type}`); // 第二个参数是你希望用户下载下来的文件的名称
        })
        .catch((err) => {
          console.log(err);
        });
    };
    return {
      isEn,
      formState,
      rules,
      uploadConfigState,
      contentHeight: window.innerHeight - 90,
      loading,
      close,
      submit,
      catalogList,
      catalog,
      tipsMap,
      defaultTimeArr,
      uploadSuccessFun,
      handleCatalog,
      handelDownload,
      setActualInventory,
      productDetail,
    };
  },
};
</script>

<style scoped lang="scss">
.points-product-info-warp {
  width: 1000px;
  padding: 20px;
  border-radius: 8px;
  .title {
    color: #72767b;
    font-size: 18px;
  }
  .my-form {
    overflow: scroll;
    .upload-to-s3 {
      display: inline-block;
      margin-left: 5px;
    }
  }

  .footer {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
<style lang="scss">
.el-tooltip__popper {
  max-width: 350px !important;
}
</style>
