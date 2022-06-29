import { db } from './cloud-init'

const page = (code)=>{
    return db.collection('page').where({
        code
    }).get()
}

export default {
    page
}