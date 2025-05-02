import {
    type RegistryUserRequest,
    type User,
    type Message,
    type AuthRequest,
    type UserResponse
} from "./models"
import {LoginUser, RegisterUser} from "~/core/api";

export function getUser(): User | null {
    debugger
    let rawUserString = localStorage.getItem("user")

    if ( rawUserString != null ){
        return JSON.parse(rawUserString)
    }
    return null
}

export function checkAuth(): boolean {
    return localStorage.getItem("token") !== null;
}

export function getMessage(): string {
    return localStorage.getItem("error")??localStorage.getItem("message")??"Ошибка сервера"
}

export function logout(): void {
    localStorage.clear();
}

export function registryUser(user: RegistryUserRequest, isSuccsess: any) {
    RegisterUser(user).then((r:UserResponse) => {
        localStorage.setItem("user", JSON.stringify(r.user))
        localStorage.setItem("token", r.token)
        isSuccsess(true);
    }).catch((e: Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        isSuccsess(false);
    })
}

export function loginUser(user: AuthRequest, isSuccsess: any) {
    LoginUser(user).then((r: UserResponse) => {
        localStorage.setItem("user", JSON.stringify(r.user))
        localStorage.setItem("token", r.token)
        isSuccsess(true);
    }).catch((e: Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        isSuccsess(false);
    })
}