#### 开始

app.json设置

```
 "tabBar": {
    "list": [{
      "pagePath": "pages/index/index",
      "text": "首页",
      // 图标路径
      "iconPath": "iconPath",
      // 选中后显示的图标
      "selectedIconPath": "selectedIconPath"
    },
    {
      "pagePath": "pages/menu/index",
      "text": "点餐",
         // 图标路径
      "iconPath": "iconPath",
      // 选中后显示的图标
      "selectedIconPath": "selectedIconPath"
    }]
  },
```

index 页面 操作index.json文件 // 去掉顶部导航栏设置成自定义
"navigationStyle": "custom"

#### 云服务使用

点开云服务，找到内容管理，点击访问内容管理平台,创建新项目 本次使用 1.内容模型，按要求填写，创建，开启展示系统功能字段，然后右侧内容类型，选中图片，按要求填写， 在根据自己需求继续选中填写返回的数据、
2.左侧内容集合，就能看到上面定义的轮播图，点进去新建添加图片进去 3.然后打开云开发，数据库中就能看到自己创建的mixue这个数据库, 点击数据权限，选中第一个，所有用户可读，仅创建者可读写 ！！！不然获取不到数据

###### #4.使用云服务

4.1 在app.js的onLaunch中初始化

```
 onLaunch() {
    // 初始 这样才能使用数据
    wx.cloud.init()
    }
```

4.2 在api的js文件中 指路 swiper.js

```
const db  = wx.cloud.database()   获取到数据库
const list = ()=>{
    return db.collection('mx_swiper').get();
}
export default {
    list
}
```

##### 5.组件的使用

1.首先创建components文件夹，在文件夹下在创建progress-bar文件夹自动生成组件的东西，推荐使用微信工具来创建 2.使用这次在pages/index下使用了，首先注册注册，打开index.json文件注册

```
 "usingComponents": {
    "progress-bar":"../../components/progress-bar/index"
  }
```

3.组件的js定义properties

```
Component({
    properties: {
        value:{
            type:Number,
            value:0
        }
    },
    // 组件的生命周期有好几个
    lifetimes:{
        // 组件挂载的时候
        attached () {

        }
    },
    data: {},
    methods: {}
});

```

4.使用

```
<progress-bar value="{{ 30 }}"></progress-bar>
```

##### 获取用户的手机号码 当前有两种方式获取手机号码，下面一种，云函数一种需要获取到云函数ID

！！！下面这个操作个人账户不能用 所以现在只能获取到他的头像

```
<button open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber"></button>


Page({
  getPhoneNumber (e) {
    console.log(e.detail.code)
  }
})
```

##### 用云函数获取手机号码 上面那个e.detail.cloudID 这个字段可以调用云函数来获取三级号码

首先在miniprogram同级创建一个cloud-functions文件夹，然后打开project.config.json ， 写上 "cloudfunctionRoot": "cloud-functions/"
,然后右键cloud-functions文件夹，同步云函数列表

##### 然后打开 [官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/practice/getphone.html)

```  也可以直接看下面这段代码复制来用
 getPhoneNumber (e) {
        const cloudId = e.detail.cloudID
        wx.cloud.callFunction({
            name: 'get-phone-number',
            data: {
                weRunData: wx.cloud.CloudID(cloudId) // 这个CloudID 值到云函数端会被替换
            }
        }).then(res => {
            console.log(res)
            wx.setStorageSync('phoneNumber',res.result)
            // 返回上一页
           wx.navigateBack()
      
        })
    },
```

####使用computed计算属性，需要安装一个插件，官方提供的
官方推荐 npm 是安装在miniprogram下，由于现在项目存在了package.json和package-lock.json所以npm会安装在外面所以先把这两个删除在安装
[computed使用的官方文档](https://github.com/wechat-miniprogram/computed)
```
npm install --save miniprogram-computed
安装完后，去小程序点击工具，构建npm
```
[如何使用？](./miniprogram/pages/me/index.js)
```
// 1.导入
const computedBehavior = require('miniprogram-computed').behavior

Page({
    // 2.注册
    behaviors: [computedBehavior],  
     // 3. 计算属性使用   计算属性中不能使用this  watch是可以的 所以方法要传一个data进去来使用数据
    computed:{
        // 过滤手机号码隐藏中间四位
        // 但是现在只有微信名称
        filterName(data){
            let name = data.nickName
            if (name !== ''){
                return name.replace(/(\d{2})\d{2}(\d{2})/,"$1**$2")
            }
            return name
        },
    },
   )}
```

#####[地图map的使用微信小程序提供了](https://developers.weixin.qq.com/miniprogram/dev/component/map.html#%E7%A4%BA%E4%BE%8B%E4%BB%A3%E7%A0%81)
在开发者工具中预览效果,打开提供的示例代码 index.wxml 直接粘贴用
```
  <!--
    下面这两个是必填的  中心维度获取当前位置
      latitude="{{latitude}}"
      longitude="{{longitude}}"
      show-location   这个需要写上，显示带有方向的当前定位点
       markers="{{markers}}"  markers 是用来显示你搜索出来的结果他们的坐标的
    -->

  <map
            id="global-map"
            class="global-map"
            latitude="{{latitude}}"
            longitude="{{longitude}}"
            show-location
            markers="{{markers}}"
    >
         <image class="current-icon" src="../../assets/images/current.png" bindtap="goToCurrentLocation"></image>
     </map>
```
####然后使用 wx.getLocation获取用户当前位置
```
 wx.getLocation({
            type: 'wgs84',
            success (res) {
                const latitude = res.latitude
                const longitude = res.longitude
                const speed = res.speed
                const accuracy = res.accuracy
            }
        })
```
```
// 需要去app.js中设置
 "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    }
  }
```

#### 点击右下角的图标回到自身定位   [地图的相关API文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/wx.createMapContext.html)
// 一定要获取地图的上下文 看第二步如何获取
1.在data外定义一个接收 map这个标签的变量
```
    mapContext:null,
```
2.在页面加载的时候获取map的上下文并且赋值
```
  onLoad: function(options) {
  // 通过map上定义的id字段来获取上下文 并且赋值给mapContext
        wx.createSelectorQuery().select('#global-map').context((res) => {
            this.mapContext = res.context 
        }).exec()
    },
```
3.给图片绑定点击事件  执行 moveToLocation()方法  回到自身位置
```
 // 点击右下角回到当前位置
    goToCurrentLocation(){
        // 回到自身定位  
        this.mapContext.moveToLocation()
    },
```
####获取 [距离计算] 文档地址按文档先操作(https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/jsSdkOverview)
1.申请key
2.开通webserviceAPI服务：控制台 ->应用管理 -> 我的应用 ->添加key-> 勾选WebServiceAPI -> 保存
3.下载 JavaScriptSDK v1.2  
4.存放到('../../libs/qqmap-wx-jssdk.js');
5.安全域名设置，在小程序管理后台 -> 开发 -> 开发管理 -> 开发设置 -> “服务器域名” 中设置request合法域名，添加https://apis.map.qq.com
[5.的地址](https://mp.weixin.qq.com/wxamp/devprofile/get_profile?token=798889182&lang=zh_CN)
6.小程序示例 看示例

在pages/global/index.js中使用 
```
// 1. 引入SDK核心类，js文件根据自己业务，位置可自行放置
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

// 2.实例化
 onLoad: function () {
        initMapSdk(){
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'PWUBZ-PSN6P-KJUDM-VMCNK-RAYLZ-37FZN'
        });
    },
    },
```

3.[使用geoNear](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.geoNear.html)

```

const db = wx.cloud.database();

const _ = db.command

const list = (longitude, latitude) => {
    return db.collection('global').where({
        // 下面这里需要添加索引 路径 数据库-global-索引管理-添加索引-索引名称 geno - 唯一 - 索引字段要写location
        // location 这个字段自己手动添加的
        location: _.geoNear({
            // 起始点位
            geometry: db.Geo.Point(longitude, latitude),
            // 筛选最远距离
            maxDistance: 10000
        })
    }).limit(10).get()
}
export default {
    list
}
```
4. js文件中获取当前坐标，获取到后发送请求
```
// 获取当前坐标
    loadCurrentLocation () {
        // 获取当前坐标
        wx.getLocation({
            type: 'wgs84',
            success: (res) => {
                const longitude = res.longitude
                const latitude = res.latitude
                this.setData({
                    latitude,
                    longitude
                })
                // 获取门店列表
                this.fetchStoreList()
            }
        })
    },
    
     // 请求接口获取门店列表
    fetchStoreList () {
         const {longitude,latitude} = this.data
        // 这里的数据记得要去云开发，数据库设置权限不然获取不到
        storeApi.list(longitude,latitude).then(res=>{
            console.log(res)
            // 计算距离最近的排序
            this.makeStoreList(res.data)
        })
    },
    // 距离排序
    makeStoreList(storeList){
        // 因为data传过来的数据有很多，这里只需要坐标
        const locationList = storeList.map(item=>{
            return {
                longitude: item.location.longitude,
                latitude: item.location.latitude
            }
        })
```

```
        // 实例化API核心类
        initMapSdk(){
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'PWUBZ-PSN6P-KJUDM-VMCNK-RAYLZ-37FZN'
        }
```
5.[通过腾讯位置服务提供的  距离计算](https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodCalculatedistance)
calculateDistance(options:Object) 来排序距离最近的几个点，上面获取数据的时候  已经筛选了最远距离 maxDistance: 10000
```     
        qqmapsdk.calculateDistance({
            // mode和from都有默认值，所以不写
            // to传Object格式，把数组中的经纬度传过去  locationList在上面已经获取了只有经纬度的数组
            to:locationList,
            success:(res)=>{
                // res.result.elements这个数组里的distance可以拿到距离多少m
                // 遍历给storeList添加distance这个字段
                storeList.forEach((item,key)=>{
                    // storeList是个数组，数组中是个对象，通过storeList[key][]添加一个新的字段
                    // 返回的数据以m为单位，这里直接转换成km   保留两位小数
                    storeList[key]['distance'] =( res.result.elements[key].distance / 1000).toFixed(2)
                })
                this.setData({
                    storeList
                })
                console.log(res)
            }
        })
    },
```

####弹出层使用小程序提供的组件 [page-container](https://developers.weixin.qq.com/miniprogram/dev/component/page-container.html)

####蜜雪冰城 点餐 搜索 附近门店让用户搜索某个地点附近查看是否有门店
使用腾讯地图开发文档-小程序插件-地图选点插件来完成
[按文档来  接入指引](https://lbs.qq.com/miniProgram/plugin/pluginGuide/locationPicker)
1、插件申请接入：   这个可以直接操作第二步，小程序会弹出来点击就行
2.引入插件包：
```
// app.json
{
    "plugins": {
        "chooseLocation": {
        "version": "1.0.9",
        "provider": "wx76a9a06e5b4e693e"
        }
    }
}  
```
3、设置定位授权：   地图选点插件需要小程序提供定位授权才能够正常使用定位功能：
```
// app.json
{
    "permission": {
        "scope.userLocation": {
        "desc": "你的位置信息将用于小程序定位"
        }
    }
}
```
4.使用插件
在点击搜索框事件中使用  点击后跳转地图提供的组件选好地点后返回当前页面
```
var key = 'PWUBZ-PSN6P-KJUDM-VMCNK-RAYLZ-37FZN'; //使用在腾讯位置服务申请的key
var referer = 'mixue'; //调用插件的app的名称

   // 点击搜索框
    chooseLocation () {
        // 下面两个已经在最外层定义了全局变量
        // const key = ''; //使用在腾讯位置服务申请的key
        // const referer = ''; //调用插件的app的名称

        // 下面这个是当前位置，点击跳转后显示的位置
        const location = JSON.stringify({
            latitude: this.data.latitude,
            longitude: this.data.longitude
        });
        // 下面这两个在当前项目不需要，作用是可以点击的tabs，搜索关于生活服务的场地和娱乐休闲的场地
        // const category = '生活服务,娱乐休闲';

        wx.navigateTo({
            // url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
            url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location
        });
    },
```
5.返回当前页面后拿到用户选中的地点，在根据当前的地点来搜索附近门店
```
// 1.导入插件
const chooseLocation = requirePlugin('chooseLocation');

// 2.在onShow中执行选好地点后
 onShow: function() {
        // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
        const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
        // 第一次进来为空，要if不然报错
        if (location){
            console.log(location)
            // 地图选点回来后拿到坐标
            const { latitude,longitude} = location
            this.setData({
                latitude,
                longitude
            })
            // 拿到坐标后，重新发起请求 获取门店列表
            this.fetchStoreList()
        }
    },


    
    
// 记得写上这个
 onUnload () {
        // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
        chooseLocation.setLocation(null);
    }
```

##### 云开发 CMS 添加查询的操作 [看文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database/query-array-object.html)

#####使用mobX辅助库&全局状态管理  [文档](https://github.com/wechat-miniprogram/mobx-miniprogram-bindings)
```
1.安装
npm install --save mobx-miniprogram mobx-miniprogram-bindings
2.工具-构建npm
3.创建 models 文件夹
```
########mobX的使用
1.在models下创建store.js
```
// 导入
import { observable, action } from "mobx-miniprogram";

export const global = observable({
    // 数据字段
    numA: 1,
    numB: 2,
    // 计算属性
    get sum(){
        return this.numA+this.numB
    },
    // actions 方法，用来修改store中的数据
    updateNum1:action((step)=>{
        this.numA += step
    }),
    updateNum2:action((step)=>{
        this.numB += step
    }),
})
```
###### 在page页面和组件页面使用是不一样的
在page页面中使用
```
1.导入
import {createStoreBindings} from 'mobx-miniprogram-bindings'
import {global} from '../../models/global'
2.在onLoad中创建
  onLoad() {
        // 传递的this代表绑定当前页面的实例
        this.storeBindings = createStoreBindings(this,{
            global,
            fields:['numA','numB','sum'],
            actions:['updateNum1']
        })
    },
    
3.onUnload也要卸载
onUnload() {
        this.storeBindings.destroyStoreBindings()
    },

4.使用 在wxml页面
上面的numA可以直接使用
<view>{{numA}} + {{numB}} = {{sum}}</view>
<button bindtap="dianji" data-step="{{-1}}">
5. actions的使用可以也是直接this.updateNum1传值就能直接使用
5. js页面
dianji(e){
       const {step} = e.currentTarget.dataset
       this.updateNum1(step)
  }
```

在组件component中使用
```
1.导入
import {storeBindingsBehavior} from 'mobx-miniprogram-bindings'
import {global} from '../../models/global'
2.
Component({
    // 通过storeBindingsBehavior来实现自动绑定
    behaviors:[storeBindingsBehavior],
    storeBindings:{
        store:global, // 指定要绑定的store   这里一定要写 store: xxx
        // 指定要绑定的数据
        fields:{
            numA:'numA',
            numB:'numB',
            sum:'sum'
        },
        // 指定要绑定的方法
        actions:{
            // 第一个key是将来要使用的名称可以随便取，第二个值是store中actions的方法名
            updateNum2:'updateNum2'
        }
    },
    
    // 组件的方法列表
    methods:{
        dianji(e){
            const {step} = e.currentTarget.dataset
            this.updateNum2(step)
            // 要获取numA的话
            console.log(this.data.numA)
        }
    }
)}
```

#### mobx当前项目的使用 这里操作是当登录后执行action存储起登录的信息
1.在models中创建index.js
```
// 1.导入
import { configure } from '../miniprogram_npm/mobx-miniprogram'

// 引入模型
import { user } from './user'

// 开启严格模式
// observable : 在某处观察到的所有状态都需要通过动作进行更改。在正式应用中推荐此严格模式。
configure({ enforceActions: "observable" })
```
2.创建user仓库
```
import { observable, action } from "mobx-miniprogram";

// 获取本地存储的个人信息 
const userInStorage = wx.getStorageSync('userInfo')
// 创建 以 user 为名的仓库
export const user = observable({
    userInfo: userInStorage ? userInStorage : {},
    // action
    update_userInfo: action( function() {
        // 登录后调用这个方法 获取本地存储 赋值给userInfo
        this.userInfo = userInStorage

    }),
})
```
3.在 behaviors 文件下 创建 user-behavior.js
```
import { BehaviorWithStore } from "mobx-miniprogram-bindings";
// 引入仓库 在这里封装过后，直接在要用的地方直接引入当插件使用
import { user } from "../models/user";

export const userBehavior = BehaviorWithStore({
    storeBindings: [{
        namespace: "user",
        global: user,
        fields: ["userInfo"],
        actions: ["update_userInfo"],
    }]
});

```
4.在login.js中使用
```
// 1.导入mobx 存储用户名
import { userBehavior } from '../../behaviors/user-behavior'


Page({
    // 2.注册
    behaviors: [userBehavior],
   
   // 3.登录
    login () {
        wx.getUserProfile({
            desc: '用于完善用户信息',
            success: (res) => {
                // 3. 这里只获取到头像之类的信息   存储起来
                wx.setStorageSync('userInfo', res.userInfo)
                // 存储到内存中后，调用mobx user仓库中的方法给userInfo赋值
                this.update_userInfo()  // 这里的action引入后直接this.方法名就能使用

                console.log(res.userInfo);
                // 这里模拟查询数据库手机号码是否存在，未存在就存起来
                user.me(13724815682).then(res => {
                    if (res.data.length === 0) {
                        // 把手机号码添加到数据库
                        user.create(13724815682).then(res => {
                            console.log(res)
                        })
                    }
                    console.log(res)
                })
                wx.navigateBack()
            }
        })
    },
 
   )}
```

#### pages/index/index 下面门店显示实现思路是，本地存储自己位置，然后把自己的位置【发送请求】获取到附近的门店后，赋值给一个变量，在根据这个变量显示，

#### 点餐页面搜索框与胶囊对齐算法
```
 // 计算搜索框与右上角胶囊对齐
    makeHeaderStyle () {
        // 通过 wx.getMenuButtonBoundingClientRect() 获取距离的度数
        const { top, bottom, height } = wx.getMenuButtonBoundingClientRect()
        const menuButtonCenterPoint = top + height / 2
        const headerStyle = `margin-top:calc(${menuButtonCenterPoint}px - 32rpx`
        this.setData({
            headerStyle
        })
    },
```

##### 使用mobx记录门店详情，每当用户在点餐页面，选中门店 弹出的时候就赋值
1.在models中，创建global.js
```
// 导入
import { observable, action } from "mobx-miniprogram";

export const global = observable({
    // 当前门店的详细信息，每当用户点击门店弹出后就赋值
    currentStore:null,
    // 计算属性

    // actions 方法，用来修改store中的数据
    setCurrentStore:action(function(store){
        this.currentStore = store
    }),

})
```
2.在store/index.js
```
// 1.导入
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { global } from "../../models/global.js";

  onLoad() {
     this.storeBindings = createStoreBindings(this, {
            store:global,
            fields: ["currentStore"],
            actions: ["setCurrentStore"],
        });
  },
  
    onUnload: function() {
        this.storeBindings.destroyStoreBindings();
    },
```
3.直接 this.currentStore 即可使用


#####  点餐页面
1.引入云函数  cloud-init.js
```
export const cloud = wx.cloud
```

2.拿数据需要聚合联表

在cloud-functions 下创建 goods-list-with-category
```
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db  = cloud.database()
  const result = await db.collection('goods_category').aggregate()
      .lookup({
        from: 'goods',
        localField: '_id',
        foreignField: 'category',
        as: 'goodsList',
      })
      .end()

  return result.list

}
```
3.goods.js
```
import { db , cloud } from './cloud-init'

const list = ()=>{
    return db.collection('goods').get()
}

// 聚合  联表查询
const listWithCategory = ()=>{
    return cloud.callFunction({
        name:'goods-list-with-category'
    })
}

export default {
    list
}
```
4.拿数据
```
 fetchData(){
        goodsApi.listWithCategory().then(res=>{
            console.log(res)
            this.setData({
                goodsList:res.result
            })
        })
    },
```

5.然后传值给左侧列表组件
```
 <sidebar list="{{goodsList}}"></sidebar>
```

##### 子组件触发父组件自定义方法
使用 triggerEvent
子组件的JS
```
methods: {
    handleItemTap(e){
      const {index} = e.currentTarget.dataset;
      //触发父组件的自定义事件
      //第一个参数是自定义父组件方法名，第二个是携带的参数
      this.triggerEvent("tabItemChange",{index});
    }
  }
```
父组件
```
<Tabs tabs="{{tabs}}"
  bindtabItemChange="handleTabItemChange">
  
  
  handleTabItemChange(e) {
    //1. 获取被点击的标题索引
    const {
      index
    } = e.detail;
    //...
}
```

#### menu 点餐页面 左右两侧联动  
当点击左侧列表的时候，右侧会跟着更改
实现思路  给scroll-view绑定scroll-into-view="section-{{current}}" 可以直接定位到当前ID节点
current 在props中定义 让menu传递过来
```
<!--    scroll-into-view="section-{{current}}" 可以直接定位到这个id节点      -->
<scroll-view class="menu-list" bindscroll="onScroll" scroll-into-view="section-{{current}}" scroll-y show-scrollbar="{{false}}" enhanced>

<!--  遍历的时候给每个字段都加上 id="section-{{ index }}"     -->
<view class="section" wx:for="{{list}}" wx:for-item="goodsCategory" wx:key="index" id="section-{{ index }}" data-index="{{ index }}">

```
menu中 获取到sidebar中点击传过来的字段后 赋值
```
// 子组件点击左侧后传递点击的index
    onSideBarChange(e){
        this.setData({
            currentCategoryIndex:e.detail.index
        })
    },
```
通过 props current字段传递
```
<goods-list list="{{goodsList}}" current="{{currentCategoryIndex}}">
```
实现当点击后可以直接定位到

##### 右侧滚动，根据滚动到的内容区让左侧更换高亮
1.监听滚动条  goods-list.wxml
```
<scroll-view class="menu-list" bindscroll="onScroll" scroll-into-view="section-{{current}}" scroll-y show-scrollbar="{{false}}"
```
2.遍历所有 .section的节点 找到top小于 152 的 并且 bottom 大于 152的，
获取他在wxml中定义的data-index="{{index}}" 然后触发自定义事件on-change,传递当前在区域中的index值
```
 // 开启滚动事件,
    onScroll(e) {
      // 这里的rootTop表示当前滚动条距离顶部的高度 因为上面有个轮播图所以需要计算  当下面子节点的高度小于152代表已经到达了顶部 0px
      const rootTop = e.target.offsetTop
      // console.log(e.target)
      // 下面这里可以获取所有 section节点 距离父节点的高距离以及底部距离
      this.createSelectorQuery().selectAll('.section').boundingClientRect(
          rects => {
            // console.log(rects)
            const result = rects.find(item=>{
              //  返回 top小于 152 的 并且 bottom 大于 152的 这样代表 元素还在展示区域内
              return item.top <= rootTop && item.bottom >= rootTop
            })
            // console.log(result)
            // 因为存在undefined 所以要判断后在执行下面的方法  如果 不存在 取反变成存在就不会执行后面的方法
            !result || this.changeIndex(result.dataset.index)
          }
      ).exec()
    },
    // 把当前滚动到第几条 传递给左侧组件
    changeIndex(currentIndex) {
      // 这段赋值没必要
      // this.setData({
      //   currentIndex
      // })
      // console.log(currentIndex)
      this.triggerEvent('on-change', {index:currentIndex})
    }
  }
```
3.触发自定义事件 on-change     把拿到的值 赋值到data中的sidebarCurrent 然后传递给sidebar组件
```
  <goods-list list="{{goodsList}}" current="{{currentCategoryIndex}}" bind:on-change="onGoodsListChange">
  
   // goodsList 右侧滚动 发生改变执行的方法接收值为，当前滚动到第几条了
    onGoodsListChange(e){
        // 减少赋值
        if (this.data.sidebarCurrent === e.detail.index) return
        // console.log(e.detail.index)
        this.setData({
            sidebarCurrent:e.detail.index
        })
    },
 
```
4.sidebar组件接收参数
```
  properties: {
    // 右侧滚动条滚动到的index值
    defaultCurrent:{
      type:Number,
      value:null
    }
  },
  
```
5.sidebar监听数据变化  然后把defaultCurrent 赋值给data中的current  当前高亮 current
```
 // 数据监听器
  observers:{
      'defaultCurrent':function(defaultCurrent){
        // 返回最新的值,拿到后赋值给当前选中的current
        // console.log(defaultCurrent)
        this.setData({
          current:defaultCurrent
        })
      }
  },
```
