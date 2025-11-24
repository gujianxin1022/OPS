<template>
  <div class="top-stats-cps">
    <div class="title">{{$t('数据概况')}}</div>
    <div class="stats">
      <div class="stats-item" style="background: #37a7e5;">
        <div>{{$t('拥有积分用户数')}}
          <el-tooltip :content="integralUserNum" placement="top" @click.stop.prevent>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="num">{{overviewData.coinUserNubmer || 0}}</div>
      </div>
      <div class="stats-item" style="background: #6f81ce;">
        <div>{{$t('用户可用积分')}}
          <el-tooltip :content="integralUsableNum" placement="top" @click.stop.prevent>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="num">{{overviewData.userCoinNubmer || 0}}</div>
      </div>
      <div class="stats-item" style="background: #76caca;">
        <div>{{$t('累积发放积分')}}
          <el-tooltip :content="integralGrantNum" placement="top" @click.stop.prevent>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="num">{{overviewData.provideCoin || 0}}</div>
      </div>
      <div class="stats-item" style="background: #f79100;">
        <div>{{$t('累计消耗积分')}}
          <el-tooltip :content="integralConsumeNum" placement="top" @click.stop.prevent>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="num">{{overviewData.consumeCoin || 0}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {

  data() {
    return {
      overviewData: {},
      integralUserNum:"",
      integralUsableNum:"",
      integralGrantNum:"",
      integralConsumeNum:""
    }
  },
  computed:{
    ...mapGetters([
      'currentLang'
    ])
  },
  watch: {
    currentLang(){
      this.initData()
    }
  },

  created() {
    this.getCoinDataOverview()
    this.initData()
  },

  methods: {
    initData(){
     this.integralUserNum = this.$t('拥有积分的总账户数')
     this.integralUsableNum = this.$t('截止目前，平台上面可以使用的总积分数量')
     this.integralGrantNum = this.$t('从有积分体系以来，累积给用户发放的积分总数')
     this.integralConsumeNum = this.$t('从有积分体系以来，用户累计消耗的积分总数')
    },
    getCoinDataOverview() {
      this.$Api.coinManagement.getCoinDataOverview().then(res => {
        this.overviewData = res.data.data
      })
    }
  }

}

</script>
<style lang="scss" scoped>
.top-stats-cps {
  padding: 15px 0 0 0;

  .title {
    color: #99a9bf;
    font-size: 14px;
    padding: 0 15px;
  }

  .stats {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;

    .stats-item {
      width: 25%;
      margin: 0 15px;
      height: 100px;
      border-radius: 6px;
      color: #fff;
      padding: 15px 10px;
      text-align: center;

      .num {
        font-size: 40px;
        margin-top: 8px
      }
    }
  }
}

</style>
