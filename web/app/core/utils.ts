import {
    type RegistryUserRequest,
    type User,
    type Message,
    type AuthRequest,
    type UserResponse, type Staff, type BusyTimeRequest, type CreateTicketRequest, type Ticket, type TicketResponse
} from "./models"
import {CreateTicket, GetBusyTime, GetDoctorList, GetProfs, GetTicketsList, LoginUser, RegisterUser} from "~/core/api";
import {format} from "date-fns";

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

export function getTicketsList(id:string,isSuccess:any, handleResult:any){
    GetTicketsList(id).then((r:Array<Ticket>) => {
        isSuccess(true);
        handleResult(r)
    }).catch((e:Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        isSuccess(false);
    })
}

export function getBusyTime(date:BusyTimeRequest,isSuccess:any, handleResult:any){
    GetBusyTime(date).then((r:Array<string>) => {
        handleResult(r);
        isSuccess(true);
    }).catch((e:Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        isSuccess(false);
    })
}

export function createTicket(request:CreateTicketRequest, isSuccess:any, handleResult:any, handleMessage:any){
    CreateTicket(request).then((r :TicketResponse) => {
        handleMessage(r.message);
        handleResult(r.ticket);
        isSuccess(true);
    }).catch((e:Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        isSuccess(false);
    })
}

export function formatDate(date: Date) {
    return format(date, "dd.MM.yyyy HH:mm")
}

export function formatDateWithoutTime(date:Date){
    return format(date, "dd.MM.yyyy")
}