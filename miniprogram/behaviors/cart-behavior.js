import { BehaviorWithStore } from "mobx-miniprogram-bindings";
import { cart } from "../models/cart";

export const cartBehavior = BehaviorWithStore({
    storeBindings: [{
        namespace: "cart",
        store: cart,
        fields: ["list","totalPrice"],
        actions: ["addCart","removeCart"],
    }]
});
