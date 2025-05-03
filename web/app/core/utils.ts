import {
    type RegistryUserRequest,
    type User,
    type Message,
    type AuthRequest,
    type UserResponse, type Staff
} from "./models"
import {GetDoctorList, GetProfs, LoginUser, RegisterUser} from "~/core/api";

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

export function getToken(): string{
    let token = localStorage.getItem("token") ?? ""
    return `Bearer ${token}`
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

export function loginUser(user: AuthRequest, isSuccess: any) {
    LoginUser(user).then((r: UserResponse) => {
        localStorage.setItem("user", JSON.stringify(r.user))
        localStorage.setItem("token", r.token)
        isSuccess(true);
    }).catch((e: Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        isSuccess(false);
    })
}

export function getDoctorList(req: string, isSuccess: any, handleResult: any){
    GetDoctorList(req).then((r:Array<Staff>) =>{
        handleResult(r)
        isSuccess(true)
    }).catch((e:Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        isSuccess(false);
    })
}

export function getProfs(isSuccess:any, handleResult:any){
    GetProfs().then((r:Array<string>) => {
        isSuccess(true);
        handleResult(r)
    }).catch((e:Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        isSuccess(false);
    })
}