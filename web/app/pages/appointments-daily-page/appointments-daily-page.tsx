import "./appointments-daily-page.css"
import { useState } from "react";
import type {Ticket} from "~/core/models";
import {ModalDoctorAppointment} from "~/components/modal-doctor-appointment/modal-doctor-appointment";

export default function ConfirmationAppointmentsPage() {
    const [ticketsList, setTicketsList] = useState<Array<Ticket>>([])
    const [showModal, setShowModal] = useState<boolean>(false)

    function handleShowModal(change:any) {
        setShowModal(change)
    }

    // тикеты со статусом scheduled

    return (
        <>
            <div className="appointments-daily-page">
                <div className={"update-page"} onClick={()=>{/*Обновление списка тикетов*/}}>Обновить</div>
                <div className={"appointments-container"}>
                    {ticketsList?.map((ticket: Ticket) => {
                        return (<ModalDoctorAppointment ticket={ticket} handleShowModal={handleShowModal}
                                                        showModal={showModal}/>)
                    })}
                </div>
            </div>

        </>
    )
}