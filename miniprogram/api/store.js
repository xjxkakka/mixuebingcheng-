// const db = wx.cloud.database();
import { db } from './cloud-init'

const _ = db.command

const list = (longitude, latitude) => {
    return db.collection('store').where({
        // 下面这里需要添加索引 路径 数据库-global-索引管理-添加索引-索引名称 geno - 唯一 - 索引字段要写location
        // location 这个字段自己手动添加的
        location: _.geoNear({
            // 起始点位
            geometry: db.Geo.Point(longitude, latitude),
            // 筛选最远距离
            maxDistance: 5000
        })
    }).limit(10).get()
}
export default {
    list
}