import "./update-appointment-page.css"
import type { Route } from "./+types/update-appointment-page"
import {type User, type Staff} from "~/core/models";
import { useState } from "react";

export async function loader(params: Route.LoaderArgs) {
    return {/*Загрузка тикета по id, передающемся в ссылке (params)*/}
}

export default function UpdateAppointmentPage({params}: Route.ComponentProps) {
    const [user, setUser] = useState<User | null>(null);
    const [doctor, setDoctor] = useState<Staff | null>(null);

    return (
        <>
            <main className="update-appointment-page">
            </main>
        </>
    )
}