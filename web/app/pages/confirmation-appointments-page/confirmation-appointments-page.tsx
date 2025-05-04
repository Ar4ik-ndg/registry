import "./confirmation-appointments-page.css"
import {useEffect, useState} from "react";
import {type Ticket, TicketStatus} from "~/core/models";
import {ModalRegistryAppointment} from "~/components/modal-registry-appointment/modal-registry-appointment";
import {getTicketsConfirmation, getTicketsList, sortArrayTickets} from "~/core/utils";
import {ModalDoctorAppointment} from "~/components/modal-doctor-appointment/modal-doctor-appointment";

export default function ConfirmationAppointmentsPage() {
    const [ticketsList, setTicketsList] = useState<Array<Ticket>>([])
    const [isSuccessGetTickets, setIsSuccessGetTickets] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)

    function handleShowModal(u: boolean) {
        setShowModal(u)
    }

    function handleTicketsList(l: any) {
        setTicketsList(sortArrayTickets(l));
    }

    function handleIsSuccess(u: boolean) {
        setIsSuccessGetTickets(u);
    }

    function updatePage() {
        getTicketsConfirmation(TicketStatus.confirmed, handleTicketsList, handleIsSuccess);
    }

    useEffect(() => {
        getTicketsConfirmation(TicketStatus.confirmed, handleTicketsList, handleIsSuccess);
    },[])

    return (
        <>
            <main className="confirmation-appointments-page">
                <div className="update-page" onClick={updatePage}>Обновить</div>
                <div className={"appointments-container"}>
                    {ticketsList?.map((ticket: Ticket) => {
                        return (<ModalRegistryAppointment ticket={ticket}/>)
                    })}
                </div>
            </main>

        </>
    )
}