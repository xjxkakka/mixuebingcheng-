// pages/menu/index.js

import { createStoreBindings } from "mobx-miniprogram-bindings";
import { global } from "../../models/global.js";
import swiper from '../../api/swiper'
import goodsApi from '../../api/goods'
import goodsCategoryApi from '../../api/goods-category'

import { cart } from '../../models/cart';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        headerStyle: '',
        swiperList:[],
        goodsList:[],
        // 左侧点击的index 赋值，并且传递给goodsList 让其定位
        currentCategoryIndex:null,
        // 右侧滑动到的index值
        sidebarCurrent:null,
        goodsDialogShow:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        this.makeHeaderStyle();
        this.storeBindings = createStoreBindings(this, {
            store:global,
            fields: ["currentStore"],
        });
        this.cartBindings = createStoreBindings(this, {
            store:cart,
            fields: ["selectedGoods"],
            actions: ["selectGoods"],
        });

        // 获取轮播图
        swiper.list().then(res => {
            this.setData({
                swiperList: res.data
            })
        })
        // 初始化数据 左右两侧数据
        this.fetchData()
    },
    fetchData(){
        goodsApi.listWithCategory().then(res=>{
            // console.log(res)
            this.setData({
                goodsList:res.result
            })
        })
    },
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
    // 返回上一页
    switchCurrentStore(){
        wx.navigateBack()
    },
    // 子组件点击左侧后传递点击的index
    onSideBarChange(e){
        this.setData({
            currentCategoryIndex:e.detail.index
        })
    },
    // goodsList 右侧滚动 发生改变执行的方法接收值为，当前滚动到第几条了
    onGoodsListChange(e){
        // 减少赋值
        if (this.data.sidebarCurrent === e.detail.index) return
        // console.log(e.detail.index)
        this.setData({
            sidebarCurrent:e.detail.index
        })
    },
    //  商品选中后传递回来的商品详情
    onGoodsSelected(e){
        // console.log(e.detail)
        this.selectGoods(e.detail)
        this.setData({
            goodsDialogShow:true,
            // selectedGoods:e.detail
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
        this.storeBindings.destroyStoreBindings();
        this.cartBindings.destroyStoreBindings();
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