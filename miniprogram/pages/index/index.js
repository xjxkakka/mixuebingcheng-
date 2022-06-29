// pages/index1/index1.ts
import swiper from '../../api/swiper'
import store from '../../api/store'

// 1.引入
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { user } from "../../models/user";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        swiperList: [],
        current: 0,
        isLogin: false,
        nearbyStore:null
    },
    // 当轮播发生变化
    onSwiperChange (e) {
        const { current } = e.detail
        // console.log(e)
        this.setData({
            current
        })
    },

    // 点击轮播图片
    onSwiperTab (e) {
        const { item } = e.currentTarget.dataset
        // 判断type类型跳转不同地方
        item.type === 'url' ? wx.navigateTo({
            url: `/pages/web-view/index?url=${item.target}`
        }) : wx.navigateTo({
            url: `/pages/product/detail?id=${item.target}`
        })
    },

    // 跳转登录
    gotoLogin () {
        wx.navigateTo({
            url: "/pages/login/index"
        })
    },

    // 立即点餐
    onMenuCardClick () {
        wx.switchTab({
            url: `/pages/store/index`
        })
    },
    // 今天喝点啥
    onArticleClick () {
        wx.navigateTo({
            url: `/pages/web-view/index?url=https://baidu.com`
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad () {
        swiper.list().then(res => {
            // console.log(res)
            this.setData({
                swiperList: res.data
            })
        })

        // 2.注册  this.data.userInfo 就能拿到值
        this.storeBindings = createStoreBindings(this, {
            store:user,
            fields: ["userInfo","location"],
            actions: ["update_userInfo","update_location"],
        });
        // 页面初始化进来先授权登录，记录下最近的位置  然后去index页面发情请求获取最近的门店
        this.loadCurrentLocation()

    },
    loadCurrentLocation() {
        // 获取当前坐标
        wx.getLocation({
            isHighAccuracy: true, // 开启地图精准定位
            type: 'gcj02',
            // 使用以上两个定位才准
            // type: 'wgs84',
            success: (res) => {
                const longitude = res.longitude
                const latitude = res.latitude
                wx.setStorageSync('location', { longitude, latitude })
                this.update_location()
                // 发请求获取最近的门店
                store.list(longitude,latitude).then(res=>{
                    // console.log(res)
                    this.setData({
                        nearbyStore:res.data[0]
                    })
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow () {
        // 每次进来都判断下是否登录
        if (wx.getStorageSync('userInfo')) {
            this.setData({
                isLogin: true
            })
        } else {
            this.setData({
                isLogin: false
            })
        }

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {
        // 3.卸载
        this.storeBindings.destroyStoreBindings();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage () {

    }
})