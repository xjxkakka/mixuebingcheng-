// pages/global/index.js
import storeApi from '../../api/store'


// 获取距离 引入SDK核心类，js文件根据自己业务，位置可自行放置
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;

var key = 'PWUBZ-PSN6P-KJUDM-VMCNK-RAYLZ-37FZN'; //使用在腾讯位置服务申请的key
var referer = 'mixue'; //调用插件的app的名称
// 地图选点插件引入
const chooseLocation = requirePlugin('chooseLocation');
// 导入mobx
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { global } from "../../models/global.js";

Page({
    // 导入computed
    behaviors: [ require('miniprogram-computed').behavior],
    /**
     * 页面的初始数据
     */
    data: {
        // 下面两个参数地图坐标
        longitude: 0,
        latitude: 0,

        // 门店列表
        storeList: [],
        dict: {
            'OPENING': '营业中',
            'CLOSED': '已关闭'
        },
        mapShow: true,
        storeDetailShow: false,
        currentStore: null, // 商店展示详情
    },
    mapContext: null,
    // 计算属性
    computed: {
        markers (data) {
            return data.storeList.map((item, index) => {
                return {
                    id: index + 1,
                    title: item.name,
                    longitude: item.location.longitude,
                    latitude: item.location.latitude,
                    iconPath: '../../assets/images/marker.png',
                    width: '55rpx', height: '69rpx'
                }
            })

        },

    },
    isShow () {
        this.setData({
            mapShow: !this.data.mapShow
        })

    },

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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取坐标
        this.loadCurrentLocation()
        // 初始化map
        this.initMapContext()

        // 初始化API这个方法用于计算距离
        this.initMapSdk()

        // 使用mobx
        this.storeBindings = createStoreBindings(this, {
            store:global,
            fields: ["currentStore"],
            actions: ["setCurrentStore"],
        });

    },
    // 点击地图上的标记点
    onMarkerTab (e) {
        const { markerId } = e.detail
        const store = this.data.storeList[markerId - 1]
        // 弹出，并且修改弹出层内的信息
        this.setData({
            storeDetailShow: true,
            currentStore: store
        })
        console.log(e)
    },
    // 获取当前坐标
    loadCurrentLocation () {
        // 获取当前坐标
        wx.getLocation({
            isHighAccuracy: true, // 开启地图精准定位
            type: 'gcj02',
            // 使用以上两个定位才准
            // type: 'wgs84',
            success: (res) => {
                const longitude = res.longitude
                const latitude = res.latitude
                this.setData({
                    latitude,
                    longitude
                })
                console.log(res)
                // 获取门店列表
                this.fetchStoreList()
            }
        })
    },
    // 请求接口获取门店列表
    fetchStoreList () {
        const { longitude, latitude } = this.data
        // 这里的数据记得要去云开发，数据库设置权限不然获取不到
        storeApi.list(longitude, latitude).then(res => {
            console.log(res)
            // 计算距离最近的排序
            this.makeStoreList(res.data)
        })
    },
    // 距离排序
    makeStoreList (storeList) {
        // 进来的时候判断下长度是否等于0，因为如果等于0是执行不到下面的success，数据会重复
        if (storeList.length === 0) {
            this.setData({
                storeList: []
            })
        }
        // 因为data传过来的数据有很多，这里只需要坐标
        const locationList = storeList.map(item => {
            return {
                longitude: item.location.longitude,
                latitude: item.location.latitude
            }
        })
        // 排序
        qqmapsdk.calculateDistance({
            // 三个值 mode默认不行 from默认当前坐标 to终点坐标，
            from: {
                longitude: this.data.longitude,
                latitude: this.data.latitude
            },
            // to传Object格式，把数组中的经纬度传过去
            to: locationList,
            success: (res) => {
                // res.result.elements这个数组里的distance可以拿到距离多少m
                // 遍历给storeList添加distance这个字段
                storeList.forEach((item, key) => {
                    // storeList是个数组，数组中是个对象，通过storeList[key][]添加一个新的字段
                    // 返回的数据以m为单位，这里直接转换成km   保留两位小数
                    storeList[key]['distance'] = (res.result.elements[key].distance / 1000).toFixed(2)
                })
                this.setData({
                    storeList
                })
                console.log(res)
            }
        })
    },


    // 初始化地图获取DOM节点赋值
    initMapContext () {
        wx.createSelectorQuery().select('#store-map').context((res) => {
            this.mapContext = res.context // 节点对应的 Context 对象。如：选中的节点是 <video> 组件，那么此处即返回 VideoContext 对象
        }).exec()
    },

    initMapSdk () {
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key
        });
    },

    // 点击右下角回到当前位置
    goToCurrentLocation () {
        /*测试执行了多久*/
        // console.time('test')
        // 回到自身定位
        this.mapContext.moveToLocation()
        // console.timeEnd('test')

        // 当用户定位到其他地方查看完门店后，点击了恢复按钮应该也跟着恢复当前定位附近的门店
        // 重新获取下当前位置
        this.loadCurrentLocation()
    },
    // 点击导航的图标
    navigateLocation (e) {
        const { longitude, latitude } = e.currentTarget.dataset.location
        // wx.openLocation(Object object) 使用微信内置地图查看位置
        wx.openLocation({
            latitude,
            longitude
        })
    },
    call (e) {
        const { phone } = e.currentTarget.dataset
        wx.makePhoneCall({
            phoneNumber: String(phone)
        })
    },

    // 弹出层
    popupStoreDetail (e) {
        const { store } = e.currentTarget.dataset
        // 弹出，并且修改弹出层内的信息
        this.setData({
            storeDetailShow: true,
            currentStore: store
        })
        // 把store详情赋值给global仓库
        this.setCurrentStore(store)
    },
    // 进入菜单
    goToMenu () {
        wx.navigateTo({
            url: '/pages/menu/index'
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
        const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
        // 第一次进来为空，要if不然报错
        if (location) {
            console.log(location)
            // 地图选点回来后拿到坐标
            const { latitude, longitude } = location
            this.setData({
                latitude,
                longitude
            })
            // 拿到坐标后，重新发起请求 获取门店列表
            this.fetchStoreList()
        }

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
        chooseLocation.setLocation(null);
        this.storeBindings.destroyStoreBindings();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

})