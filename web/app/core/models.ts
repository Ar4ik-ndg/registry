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

export type ApiError = {
    error: string
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

export type RegistryResponse = {
    token: string,
    user: User
}