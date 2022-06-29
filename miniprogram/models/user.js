import { observable, action } from "mobx-miniprogram";

const userInStorage = wx.getStorageSync('userInfo')
const userLocation = wx.getStorageSync('location')
// 创建 以 user 为名的仓库
export const user = observable({
    userInfo: userInStorage ? userInStorage : {},
    location:userLocation ? userLocation : null,
    // action
    update_userInfo: action( function() {
        this.userInfo = userInStorage
    }),
    // 存储最近的门店
    update_location: action( function() {
        this.location = userLocation
    }),
})