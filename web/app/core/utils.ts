import { type User } from "./models"

export function getUser(): User {
    let user: User = {id: "123", name: "Test"}
    return user
}

export function checkAuth(): boolean {
    if (localStorage.getItem("token") !== null) { return true }
    else {return false}
}

export function setToken(token: string) {
    localStorage.setItem("token", token)
}