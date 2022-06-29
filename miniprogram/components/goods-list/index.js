// components/goods-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Array,
      value:[]
    },
    // 根据左侧点击的index 传递过来，直接定位
    current:{
      type:Number,
      value:null
    }
  },
  options:{
    multipleSlots:true, // 开启插槽模式
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 开启滚动事件,
    onScroll(e) {
      // 这里的rootTop表示当前滚动条距离顶部的高度 因为上面有个轮播图所以需要计算  当下面子节点的高度小于152代表已经到达了顶部 0px
      const rootTop = e.target.offsetTop
      // console.log(e.target)
      // 下面这里可以获取所有 section节点 距离父节点的高距离以及底部距离
      this.createSelectorQuery().selectAll('.section').boundingClientRect(
          rects => {
            // console.log(rects)
            // find方法返回整个item
            const result = rects.find(item=>{
              //  返回 top小于 152 的 并且 bottom 大于 152的 这样代表 元素还在展示区域内
              return item.top <= rootTop && item.bottom >= rootTop
            })
            // console.log(result)
            // 因为存在undefined 所以要判断后在执行下面的方法  如果 不存在 取反变成存在就不会执行后面的方法
            !result || this.changeIndex(result.dataset.index)
          }
      ).exec()
    },
    // 把当前滚动到第几条 传递给左侧组件
    changeIndex(currentIndex) {
      // 这段赋值没必要
      // this.setData({
      //   currentIndex
      // })
      // console.log(currentIndex)
      this.triggerEvent('on-change', {index:currentIndex})
    },

    // 点击添加商品 传递商品详情过去
    selectGoods(e){
      const {item} = e.currentTarget.dataset
      console.log(item)
      // 触发自定义事件
      this.triggerEvent("on-selected",item)
    },
  }
})
