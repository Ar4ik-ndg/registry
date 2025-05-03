import "./appointments-daily-page.css"
import {ModalStaffAppointment} from "~/components/modal-staff-appointment/modal-staff-appointment"
import { useState } from "react";
import type {Ticket} from "~/core/models";

export default function ConfirmationAppointmentsPage() {
    const [ticketsList, setTicketsList] = useState<Array<Ticket>>([])

    // тикеты со статусом scheduled

    return (
        <>
            <div className={"appointments-container"}>
                {ticketsList?.map((ticket: Ticket) => {
                    return (<ModalStaffAppointment ticket={ticket}/>)
                })}
            </div>
        </>
    )
}