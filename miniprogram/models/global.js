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