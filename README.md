# LingoAce.OPS教学管理系统

LingoAce教学管理系统是内部各业务团队使用的管理后台系统，包含丰富的功能模块，保证教学服务正常进行，提升服务客户的水平。

## 开始

这些说明将为您提供一个项目的副本，并在您的本地计算机上运行，用于开发和测试目的。有关如何在活动系统上部署项目的说明，请参见部署。


### 环境准备

安装软件需要什么东西以及如何安装

```
+ npm 6.14.11
+ node 14.15.5
```

### 安装与启动

一系列循序渐进的示例，告诉您如何运行起来这个项目

安装`package`依赖

```
npm install
```
启动项目
```
npm run dev
```

## 使用到的框架

+ Webpack `^4.44.2`
+ Vue `^2.6.10`
+ element-ui `^2.10.1`
+ axios `^0.19.0`


## 代码风格
统一编码风格，命名规范，注释要求，在团队协作中输出可读性强，易维护，风格一致的代码
### Vue Component
#### 基本结构
```
<template>
    <div class="xxxx-wrap"></div> 
</template>
<script>
    export defalut {
        name: 'ComponentName',
        props: {},
        components: {},
        data() {
            return {

            }
        },
        computed:{},
        watch:{},
        methods:{},
        created(){},
        mounted(){}
    }
</script>
<!-- 声明语言，并且添加scoped -->
<style lang="scss" scoped></style>
```
#### 方法声明顺序
```
- components
- props
- data
- computed
- watch
- metods
- created
- mounted
- activited
- update
- beforeRouteUpdate
```
#### 组件命名规范
1. 组件名应该始终是多个单词的，根组件 App 除外
2. 有意义的名词、简短、具有可读性
3. 命名遵循 PascalCase(单词首字母大写命名) 约定
4. 导入及注册组件时，遵循 PascalCase(单词首字母大写命名) 约定
5. 必须符合自定义元素规范: 切勿使用保留字

#### props 命名规范
在声明 prop 的时候，其命名应该始终使用 lingoaceCase，而在模板中应该始终使用 lingoace-case
```
<!-- 推荐 -->
<script>
  props: {
    lingoaceCase: {
        type: String,
        default: ""
    }
  }
</script>

<welcome-message lingoace-case="hi"></welcome-message>

<!-- 不推荐 -->
<script>
  props: ['lingoaceCase'],
</script>

<welcome-message lingoaceCase="hi"></welcome-message>

```
#### 注释规范
以下情况，务必添加注释
1. 公共组件使用说明
2. 各组件中重要函数或者类说明
3. 复杂的业务逻辑处理说明
4. 特殊情况的代码处理说明,对于代码中特殊用途的变量、存在临界值、函数中使用的hack、使用了某种算法或思路等需要进行注释描述
5. 注释块必须以/（至少两个星号）开头/；
6. 单行注释使用//；
7. 多重 if 判断语句

#### 编码规范
1. 使用 ES6 风格编码源码
2. 定义变量使用 let ,定义常量使用 const
3. 静态字符串一律使用单引号或反引号，动态字符串使用反引号
4. v-for 循环必须加上 key 属性，在整个 for 循环中 key 需要唯一
5. 请使用VSCode作为IDE，并安装ESLint&&Beautify

### Git提交规范
```
# 主要type
feat:     增加新功能
fix:      修复bug

# 特殊type
docs:     只改动了文档相关的内容
style:    不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
build:    构造工具的或者外部依赖的改动，例如webpack，npm
refactor: 代码重构时使用
revert:   执行git revert打印的message

# 暂不使用type
test:     添加测试或者修改现有测试
perf:     提高性能的改动
ci:       与CI（持续集成服务）有关的改动
chore:    不修改src或者test的其余修改，例如构建过程或辅助工具的变动
```

## 打包部署
```
npm run build-testxxx `xxx指环境` 
e.g. 
    npm run build-test240
```
部署测试环境可使用 `FTP`/`Jump堡垒机`/`SSH`，目录为 `:data/work/xxxx/cms_manager` xxxx指环境名 `e.g. test240`

## 贡献者
+ 超哥
+ 芳丽
+ 阿明
+ 阿毛
+ 旭哥
+ 胥涛
+ 张露
+ 谷大聪明