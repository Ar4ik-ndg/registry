import "./account-page.css"
import type { Route } from "./+types/account-page"
import {useState} from "react";

export async function loader({params}: Route.LoaderArgs) {
    return {}
}

export default function AccountPage({params}: Route.ComponentProps) {
    const name = params.userId
    return (
        <>
            <h1>{name}</h1>
        </>
    )
}