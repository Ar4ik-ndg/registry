import type {Message, AuthRequest, UserResponse, RegistryUserRequest, User} from "~/core/models";

const API_LINK = "http://localhost:8080"

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
        throw new Error(error.message);
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
        throw new Error(error.message);
    }

    return await response.json() as UserResponse;
}