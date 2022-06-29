// 1.导入
import { configure } from '../miniprogram_npm/mobx-miniprogram'

// 引入模型

export { global } from './global'

// 开启严格模式
// observable : 在某处观察到的所有状态都需要通过动作进行更改。在正式应用中推荐此严格模式。
configure({ enforceActions: "observable" })