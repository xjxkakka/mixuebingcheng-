import { BehaviorWithStore } from "mobx-miniprogram-bindings";
import { user } from "../models/user";

export const userBehavior = BehaviorWithStore({
    storeBindings: [{
        namespace: "user",
        store: user,
        fields: ["userInfo","location"],
        actions: ["update_userInfo","update_location"],
    }]
});
