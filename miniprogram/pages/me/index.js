// pages/me/index.js
// 1.导入
const computedBehavior = require('miniprogram-computed').behavior

// 1.导入mobx仓库
import { userBehavior } from '../../behaviors/user-behavior'

Page({
    // 2.注册 userBehavior必须在前面
    behaviors: [userBehavior, computedBehavior],

    /**
     * 页面的初始数据
     */
    data: {
        nickName: ''
    },
    // 计算属性使用
    computed: {
        // 过滤手机号码隐藏中间四位
        // 但是现在只有微信名称
        filterName (data) {
            let name = data.nickName
            // if (name !== '') {
            //     name = name.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
            // }
            return name
        },
    },
    login () {
        wx.navigateTo({
            url: '/pages/login/index'
        })
    },
    // 隐私政策
    gotoCustomPage (e) {
        const { code } = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/custom-page/index?code=${code}`
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad () {

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
        if (wx.getStorageSync('userInfo')) {
            this.setData({
                // 不在调用内存中的数据，改用 mobx仓库user
                // nickName:wx.getStorageSync('userInfo').nickName
                nickName: this.data.user.userInfo.nickName
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