import './modal-user-appointment.css'
import type {Ticket} from "~/core/models";
import { TicketStatus } from "~/core/models";
import {useEffect, useState} from "react";
import {format, parse, differenceInHours} from "date-fns";

type ModalOrderProps = {
    showModal: boolean
    handleShowModal: any
    ticket: Ticket
}

export function ModalUserAppointment(props:ModalOrderProps){
    const ticket = props.ticket;
    const [isAvaliable, setAvaliable] = useState(true)

    function checkAvaliable() {
        const today = new Date()
        const ticketDate = parse(ticket.date, "dd.MM.yyyy HH:mm", new Date())
        setAvaliable(Math.abs(differenceInHours(ticketDate, today)) >= 12);
    }

    useEffect(() => {
        checkAvaliable()
    },[])

    function handleCancel() {
        // PUT http://localhost:8080/api/v0.1/user/tickets/cancel/{ticket.id}
        setAvaliable(false)
    }

    if (props.showModal){
        return (
            <>
                <div className={"card"}>
                    {/*ticket обязательно содержит дату формата dd.MM.yyyy HH:mm*/}
                    <div className={"card-header"}>
                        <div className={"card-name"}>Прием {ticket.date.split(" ")[0]}</div>
                        <div className={"ticket-status"}>Статус: {ticket.status}</div>
                    </div>
                    <div className={"card-description"}>
                        <div className={"doctor"}>Специалист: {ticket.doctor.fullName}</div>
                        <div className={"result"}>Результат:<br/>{ticket.result ?? "пока нет результата"}</div>
                        <div className={"description"}>Жалоба:<br/>{ticket.description}</div>
                        <div className={"time"}>Время: {ticket.date.split(" ")[1]}</div>
                    </div>
                    <div className={"card-buttons"}>
                        {(() => {
                            if ((ticket.status === TicketStatus.confirmed
                            || ticket.status === TicketStatus.scheduled)
                            && isAvaliable) {
                                return (<>
                                    <div className={"cancel-button"} onClick={handleCancel}>Отменить</div>
                                </>)
                            }
                            else return (<></>)
                        })()}
                    </div>
                </div>
            </>
        )
    }
}
