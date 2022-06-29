// app.js


App({

    globalData: {
        // userInfo:
    },
    onLaunch () {
        // 初始 这样才能使用数据
        wx.cloud.init()



    },

    getUserInfo () {
        return wx.getStorageSync('userInfo')
    }
})