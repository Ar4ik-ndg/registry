import {type RegistryUserRequest, type User, type ApiError, type RegistryResponse} from "./models"
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

export function registryUser(user: RegistryUserRequest, isSuccsess: any) {
    RegisterUser(user).then((r:RegistryResponse) => {
        localStorage.setItem("user", JSON.stringify(r.user))
        localStorage.setItem("token", r.token)
        console.log(`ответ registryUser ${true}`)
        isSuccsess(true);
    }).catch((e: Error) => {
        console.error(e)
        console.log(`ответ registryUser ${false}`)
        isSuccsess(false);
    })
}