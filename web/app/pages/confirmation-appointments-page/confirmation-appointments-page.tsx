import "./confirmation-appointments-page.css"
import { useState } from "react";
import type {Ticket} from "~/core/models";
import {ModalRegistryAppointment} from "~/components/modal-registry-appointment/modal-registry-appointment";

export default function ConfirmationAppointmentsPage() {
    const [ticketsList, setTicketsList] = useState<Array<Ticket>>([])

    // тикеты со статусом confirmed

    return (
        <>
            <main className="confirmation-appointments-page">
                <div className="update-page" onClick={() => {/*обновление списка тикетов*/}}>Обновить</div>
                <div className={"appointments-container"}>
                    {ticketsList?.map((ticket: Ticket) => {
                        return (<ModalRegistryAppointment ticket={ticket}/>)
                    })}
                </div>
            </main>

        </>
    )
}