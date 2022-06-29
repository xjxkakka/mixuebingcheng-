import specsCategoryApi from '../../api/specs-category.js'
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { cart } from '../../models/cart'

Component({
    // 通过storeBindingsBehavior来实现自动绑定
    // behaviors: [cartBehavior],
    behaviors: [storeBindingsBehavior],
    storeBindings: {
        store: cart,
        fields: {
            list: 'list',
            totalPrice:'totalPrice'
        },
        actions: {
            addCart: "addCart",
        },
    },

    properties: {
        goods: {
            type: Object,
            value: null,
            observer: function(newValue, oldVal, changedPath) {
                // console.log(newValue,25)
                // 获取新的商品参数 然后发请求在获取具体详情
                this.fetchSpecsCategories(newValue['specs_categories'])
            }

        }
    },
    data: {
        specsCategories: [],
        shopPrice:0
    },
    methods: {
        async fetchSpecsCategories (categoryIds) {
            const result = await specsCategoryApi.list(categoryIds)
            // console.log(result.result,321)
            const specsCategories = result.result.map(item => {
                // 给口味，底料，加料，这一层设置一个当前高亮值 默认第一个高亮
                // 让子类数据高亮根据这一值来高亮
                item.specsIndex = 0
                return item
            })
            console.log(specsCategories, 123)
            this.setData({
                specsCategories
            })
            // console.log(this.specsCategories)
            // 计算当前商品的价格
            this.calculateTotalPrice()
        },
        calculateTotalPrice() {
            let shopPrice = 0
            // 首先获取当前商品的金额 先复制
            shopPrice += this.properties.goods.price

            // 这里计算的是 配料可选值 需要另外加钱 就 商品金额+=配料钱
            this.data.specsCategories.forEach(item=>{
                // 如果有长度的话就执行后面的语句 || 为false就会执行后面
                !item.specs.length ||  (shopPrice += item.specs[item.specsIndex].price)
            })

            this.setData({
                shopPrice
            })
        },
        onSpecsTap (e) {
            // 点击的详情数据，和点击的下标
            const { specs, specsCategoryIndex } = e.target.dataset
            console.log(specs, specsCategoryIndex)
            let specsCategories = this.data.specsCategories
            // findIndex 返回符合条件的第一个数据的索引位置
            const index = specsCategories[specsCategoryIndex].specs.findIndex(item => {
                return item._id === specs._id
            })
            // 把父类的specsIndex改为当前点击子类的下标 让其高亮
            specsCategories[specsCategoryIndex].specsIndex = index
            // console.log(specsCategories[specsCategoryIndex], 321)
            // console.log(index)
            // 重置
            this.setData({
                specsCategories
            })
            this.calculateTotalPrice()
        },

        // 点击加入购物车'
        add () {
            // console.log(this.properties.goods)
            let goods = this.properties.goods
            // console.log(goods)
            let specs = []
            const specsCategories = this.data.specsCategories
            // console.log(specsCategories)
            // 遍历 specsCategories 里面有口味 底料 加料等数组
            specsCategories.forEach(item=>{
                // 把高亮选项添加到 specs
                specs.push(item.specs[item.specsIndex])
            })
            // console.log(specs) // ["草莓味+原味", "双炫"]
            // 给goods 添加 specs字段 把["草莓味+原味", "双炫"]放进去
            goods['specs'] = specs
            console.log(goods)
            this.addCart(goods)
        },
    }
});
