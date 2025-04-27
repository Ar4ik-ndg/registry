import {type RegistryUserRequest, type User, type ApiError} from "./models"
import {RegisterUser} from "~/core/api";

export function getUser(): User | null {
    let rawUserString = localStorage.getItem("user")

    if ( rawUserString != null ){
        return JSON.parse(rawUserString)
    }
    return null
}

export function checkAuth(): boolean {
    return localStorage.getItem("token") !== null;
}

export function logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export function registryUser(user: RegistryUserRequest) : boolean {
    debugger;
    let registerPromise = RegisterUser(user)
    registerPromise.then(r => {
        localStorage.setItem("user", JSON.stringify(r.user))
        localStorage.setItem("token", r.token)
        return true
    }).catch((e: ApiError) => {
        console.error(e)
        return false
    })

    return false
}