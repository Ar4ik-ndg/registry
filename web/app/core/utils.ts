import {
    type RegistryUserRequest,
    type User,
    type Message,
    type AuthRequest,
    type UserResponse,
    type Staff,
    type BusyTimeRequest,
    type CreateTicketRequest,
    type Ticket,
    type TicketResponse,
    type UpdateTicketRequest
} from "./models"
import {
    CancelTicket,
    CreateTicket,
    CreateTicketStaff, GetAllTickets,
    GetBusyTime,
    GetDoctorList,
    GetProfs, GetTicketListByDoctor, GetTicketListByStatus,
    GetTicketsList, GetUserByEmail,
    LoginUser,
    RegisterUser, UpdateTicket
} from "~/core/api";
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

export function getBusyTime(date:BusyTimeRequest ,isSuccess:any, handleResult:any){
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

export function createTicketStaff(request:CreateTicketRequest, isSuccess:any, handleResult:any, handleMessage:any){
    CreateTicketStaff(request).then((r :TicketResponse) => {
        handleMessage(r.message);
        handleResult(r.ticket);
        isSuccess(true);
    }).catch((e:Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        isSuccess(false);
    })
}

export function cancelTicket(id:string, handleResult:any, handleIsAvaliable: any){
    CancelTicket(id).then((r:TicketResponse) => {
        handleResult(r.ticket)
        handleIsAvaliable(false);
        localStorage.setItem("message", r.message)
    }).catch((e:Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        handleIsAvaliable(true);
    })
}

export function getTicketsConfirmation(status: string, handleResult:any, handleIsSuccess: any){
    GetTicketListByStatus(status).then((r:Array<Ticket>) => {
        handleResult(r)
        handleIsSuccess(true);
    }).catch((e:Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        handleIsSuccess(false);
    })
}

export function getTicketsDaily(doctorId:string,handleResult:any,handleIsSuccess:any){
    GetTicketListByDoctor(doctorId).then((r:Array<Ticket>) => {
        handleResult(r)
        handleIsSuccess(true)
    }).catch((e:Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        handleIsSuccess(false);
    })
}

export function getUserByEmail(email:string,handleResult:any,handleIsSuccess:any){
    GetUserByEmail(email).then((r:User) => {
        handleResult(r)
        handleIsSuccess(true)
    }).catch((e:Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        handleIsSuccess(false);
    })
}

export function getAllTickets(handleResult:any,handleIsSuccess:any){
    GetAllTickets().then((r:Array<Ticket>) => {
        handleResult(r)
        handleIsSuccess(true)
    }).catch((e:Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        handleIsSuccess(false);
    })
}

export function updateTicket(id:string, request: UpdateTicketRequest, handleResult:any, handleIsAvaliable: any){
    UpdateTicket(id, request).then((r:TicketResponse) => {
        handleResult(r.ticket)
        handleIsAvaliable(false);
        localStorage.setItem("message", r.message)
    }).catch((e:Error) => {
        console.error(e)
        localStorage.setItem("message", e.message)
        handleIsAvaliable(true);
    })
}

export function formatDate(date: Date) {
    return format(date, "dd.MM.yyyy HH:mm")
}

export function formatDateWithoutTime(date:Date){
    return format(date, "dd.MM.yyyy")
}

export function sortArrayTickets(l: Array<Ticket>) {
    const sorted = l.sort((a:Ticket,b:Ticket)=>{
        const now = new Date().getTime()
        return Math.abs( new Date(a.date).getTime()-now) - Math.abs(new Date(b.date).getTime() - now)
    })
    return sorted
}