import "./admin-page.css"
import {useEffect, useState} from "react";
import type {Ticket, User} from "~/core/models";
import {ModalDoctorAppointment} from "~/components/modal-doctor-appointment/modal-doctor-appointment";
import {getAllTickets, getTicketsDaily, getUser, sortArrayTickets} from "~/core/utils";

export default function ConfirmationAppointmentsPage() {
    const [ticketsList, setTicketsList] = useState<Array<Ticket>>([])
    const [user, setUser] = useState<User | null>(null)
    const [showModal, setShowModal] = useState<boolean>(false)

    function handleSetUser(user: User|null) {
        setUser(user)
    }

    function handleSetTicketsList(l: Array<Ticket>) {
        setTicketsList(sortArrayTickets(l))
    }

    function handleShowModal(change:any) {
        setShowModal(change)
    }

    function updatePage() {
        getAllTickets(handleSetTicketsList, handleSetUser)
    }

    useEffect(() => {
        handleSetUser(getUser())
        getAllTickets(handleSetTicketsList, handleShowModal)
    }, [])

    return (
        <>
            <div className="admin-page">
                <div className={"update-page"} onClick={updatePage}>Обновить</div>
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