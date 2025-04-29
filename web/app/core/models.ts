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

export type Tiket = {
    id: string,
    date: string,
    description: string,
    result: string|null,
    doctor: string,
    status: TiketStatus,
    user: User
}

export type Message = {
    message: string
}

export enum ModalTypes {
    Login,
    Register,
    Recovery,
}

export enum TiketStatus {
    отменен = "отменен",
    подтверждается = "подтверждается",
    запланирован = "запланирован",
    обработка = "обработка",
    завершен = "завершен"
}

export enum Roles {
    USER,
    DOCTOR,
    REGISTRAR,
    ADMIN
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

export type CreateTiketRequest = {
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