export type User = {
    id: string,
    birthday: string,
    email: string,
    fullName: string,
    medPolicy: string,
    passport: string,
    phone: string,
    snils: string,
    role: string,
}

export type Staff = {
    id: string,
    fullName: string,
    phone: string,
    email: string,
    prof: string|null,
    role: string,
}

export type Ticket = {
    id: string,
    date: string,
    description: string,
    result: string|null,
    doctor: Staff,
    status: TicketStatus,
    user: User
}

export type Message = {
    message: string|null,
    error: string|null
}

export enum ModalTypes {
    Login,
    Register,
    Recovery,
}

export enum TicketStatus {
    canceled = "отменен",
    confirmed = "подтверждается",
    scheduled = "запланирован",
    processing = "обработка",
    completed = "завершен"
}

export enum Roles {
    USER = "USER",
    DOCTOR = "DOCTOR",
    REGISTRAR = "REGISTRAR",
    ADMIN = "ADMIN"
}

export type RegistryUserRequest = {
    birthday: string,
    email: string,
    fullName: string,
    medPolicy: string,
    passport: string,
    phone: string,
    snils: string,
    password: string
}

export type UserUpdateRequest = {
    birthday: string | null,
    email: string | null,
    fullName: string | null,
    medPolicy: string | null,
    passport: string | null,
    phone: string | null,
    snils: string | null,
    role: string | null
}

export type CreateTicketRequest = {
    date: string,
    description: string,
    result: string|null,
    doctor: string,
    status: string|null,
    user: UserUpdateRequest
}

export type AuthRequest = {
    email: string,
    password: string
}

export type UserResponse = {
    token: string,
    user: User|Staff
}

export type TicketResponse = {
    message: string,
    ticket: Ticket
}

export type BusyTimeRequest = {
    date: string,
    doctor: string
}