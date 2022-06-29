// components/sidebar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Array,
      value:[]
    },
    // 右侧滚动条滚动到的index值
    defaultCurrent:{
      type:Number,
      value:null
    }
  },
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

  /**
   * 组件的初始数据
   */
  data: {
      current:0, // 当前选中
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switch(e){
      const { current } = e.currentTarget.dataset
      this.setData({
        current
      })
      this.triggerEvent('on-change', { index: current })
    }
  }
})
