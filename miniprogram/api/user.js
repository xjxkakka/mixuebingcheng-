// const db = wx.cloud.database()
import { db } from './cloud-init'
// 添加手机号码到数据库
const create = (phone)=>{
    return db.collection('user').add({
        data:{
            phone_number:phone

        }
    })
}

const me = (phone)=>{
    return db.collection('user').where({
        // 这里必须是字符串
        phone_number:String(phone),
    }).get()

}
export default {
    create,me
}