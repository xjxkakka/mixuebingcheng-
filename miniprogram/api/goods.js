import { db , cloud } from './cloud-init'

const list = ()=>{
    return db.collection('goods').get()
}

// 聚合  联表查询
const listWithCategory = ()=>{
    return cloud.callFunction({
        name:'goods-list-with-category'
    })
}

export default {
    list,
    listWithCategory
}