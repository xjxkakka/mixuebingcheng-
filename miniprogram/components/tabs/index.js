// components/tabs/index.js

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        tabs:{
            type:Array,
            value:[]
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        current: 0,
        linePositionX: 0,
        linePositionWidth: 0
    },
    // 生命周期
    lifetimes:{
        // 挂载完后
        attached () {
            this.calculateLinePositionX()
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 点击改变current
        onTab(e){
            const {index} = e.currentTarget.dataset
            this.setData({
                current:index
            })
            this.calculateLinePositionX(index)
        },
        calculateLinePositionX(index = 0) {
            // 在组件中获取dom节点要用this.  不要用 wx.
            this.createSelectorQuery().selectAll('.tab').boundingClientRect(results=>{
                const rect = results[index]
                const currentCenterX = rect.left + rect.width / 2
                const linePositionWidth = rect.width * 0.8
                const linePositionX = (currentCenterX - linePositionWidth / 2) - results[0].left
                this.setData({
                    linePositionWidth,
                    linePositionX
                })
            }).exec()
        }
    }
})
