import type {RegistryResponse, RegistryUserRequest, User} from "~/core/models";

const API_LINK = "http://localhost:8080"

const API_VERSION = "v0.1"

// RegisterUser - регистрация пользователя
export async function RegisterUser(request: RegistryUserRequest) {
    debugger;
    const response = await fetch(`${API_LINK}/api/${API_VERSION}/auth/register`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    })

    if (!response.ok) {
        throw new Error(await response.json());
    }

    return await response.json() as RegistryResponse;
}