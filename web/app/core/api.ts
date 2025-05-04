import type {
    Message,
    AuthRequest,
    UserResponse,
    RegistryUserRequest,
    User,
    CreateTicketRequest,
    Ticket, TicketResponse, Staff, BusyTimeRequest, UpdateTicketRequest
} from "~/core/models";
import {getToken} from "~/core/utils";

const API_LINK = "http://backend:8080"

const API_VERSION = "v0.1"

// RegisterUser - регистрация пользователя
export async function RegisterUser(request: RegistryUserRequest) {
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/auth/register`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    })

    if (!response.ok) {
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка сервера");
    }

    return await response.json() as UserResponse;
}

export async function LoginUser(request: AuthRequest) {
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/auth/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    })

    if (!response.ok) {
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка сервера");
    }

    return await response.json() as UserResponse;
}

export async function CreateTicket(request: CreateTicketRequest) {
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/user/tickets/new`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': getToken()
        },
        body: JSON.stringify(request)
    })

    if (!response.ok){
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка создания тикета на стороне сервера")
    }
    return await response.json() as TicketResponse
}

export async function CreateTicketStaff(request: CreateTicketRequest) {
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/med/tickets/new`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': getToken()
        },
        body: JSON.stringify(request)
    })

    if (!response.ok){
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка создания тикета на стороне сервера")
    }
    return await response.json() as TicketResponse
}

export async function GetProfs(){
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/user/med/profs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getToken(),
        },
    })

    if (!response.ok){
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка на стороне сервера")
    }

    return await response.json() as Array<string>
}

export async function GetBusyTime(req:BusyTimeRequest){
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/user/tickets/busy`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': getToken(),
        },
        body: JSON.stringify(req)
    })
    if (!response.ok){
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка на стороне сервера")
    }

    return await response.json() as Array<string>
}

export async function GetDoctorList(prof :string){
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/user/med/${prof}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getToken(),
        }
    })

    if (!response.ok){
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка на стороне сервера")
    }

    return await response.json() as Array<Staff>
}

export async function GetTicketsList(id:string){
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/user/tickets/${id}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getToken(),
        }
    })

    if (!response.ok){
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка на стороне сервера")
    }

    return await response.json() as Array<Ticket>
}

export async function GetUserByEmail(email :string){
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/user/email/${email}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getToken(),
        }
    })

    if (!response.ok){
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка на стороне сервера")
    }

    return await response.json() as User
}

export async function GetTicketListByStatus(status :string){
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/med/tickets/status/${status}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getToken(),
        }
    })

    if (!response.ok){
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка на стороне сервера")
    }

    return await response.json() as Array<Ticket>
}

export async function GetAllTickets(){
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/med/tickets/all`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getToken(),
        }
    })

    if (!response.ok){
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка на стороне сервера")
    }

    return await response.json() as Array<Ticket>
}

export async function GetTicketListByDoctor(doctor :string){
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/med/tickets/doctor/${doctor}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getToken(),
        }
    })

    if (!response.ok){
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка на стороне сервера")
    }

    return await response.json() as Array<Ticket>
}

export async function UpdateTicket(id: String, request: UpdateTicketRequest) {
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/med/tickets/update/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': getToken()
        },
        body: JSON.stringify(request)
    })

    if (!response.ok){
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка обновления тикета на стороне сервера")
    }
    return await response.json() as TicketResponse
}

export async function CancelTicket(id:string) {
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/user/tickets/cancel/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getToken(),
        }
    })

    if (!response.ok){
        const error = await response.json() as Message
        throw new Error(error.message?? error.error?? "ошибка обновления тикета на стороне сервера")
    }
    return await response.json() as TicketResponse
}