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
    status: string,
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

export type AuthRequest = {
    email: string,
    password: string
}

export type UserResponse = {
    token: string,
    user: User|Staff
}