// pages/login/index.js
import user from '../../api/user'
// 1.导入mobx 存储用户名
import { userBehavior } from '../../behaviors/user-behavior'

Page({
    // 2.注册
    behaviors: [userBehavior],
    /**
     * 页面的初始数据
     */
    data: {},
    // 获取手机号码  获取不到需要认证
    // getPhoneNumber (e) {
    //     console.log(e)
    // },
    login () {
        wx.getUserProfile({
            desc: '用于完善用户信息',
            success: (res) => {
                //这里只获取到头像之类的信息
                wx.setStorageSync('userInfo', res.userInfo)
                // 存储到内存中后，调用mobx user仓库中的方法给userInfo赋值
                this.update_userInfo(res.userInfo)

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


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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

    }
})