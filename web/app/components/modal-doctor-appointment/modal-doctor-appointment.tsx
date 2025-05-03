import "./modal-doctor-appointment.css"
import {type Ticket, TicketStatus} from "~/core/models";
import {useState} from "react";

type ModalDoctorAppointment = {
    showModal: boolean;
    handleShowModal: any;
    ticket: Ticket;
}

export function ModalRegistryAppointment(props: ModalDoctorAppointment) {
    const ticket = props.ticket;
    const [showCancel, setShowCancel] = useState(false)
    const [reason, setReason] = useState("")

    function handleShowCancel(e: boolean) {
        setShowCancel(e)
    }

    function handleReason(e: any) {
        setReason(e.target.value)
    }

    function confirmAppointment() {
        //обновление тикета (статус -> TicketStatus.scheduled) PUT http://localhost:8080/api/v0.1/med/tickets/update/<ticketId>
    }

    function cancelAppointment(reason: string) {
        if (reason !== "") {
            handleShowCancel(false)
            setReason("")
        }
        else {
            // временно
            console.log("Необходимо ввести причину")
        }
        //обновление тикета (статус -> TicketStatus.canceled; result -> отклонено по причине: ${reason}) PUT http://localhost:8080/api/v0.1/med/tickets/update/<ticketId>
    }

    return (
        <>
            <div className={"card"}>
                <div className={"card-header"}>
                    <div className={"card-name"}>Прием {ticket.date.split(" ")[0]}</div>
                    <div className={"ticket-status"}>Статус: {ticket.status}</div>
                </div>
                <div className={"card-description"}>
                    <div className={"doctor"}>Специалист: {ticket.doctor}</div>
                    <div className={"result"}>Результат:<br/>{ticket.result ?? "пока нет результата"}</div>
                    <div className={"description"}>Жалоба:<br/>{ticket.description}</div>
                    <div className={"time"}>Время: {ticket.date.split(" ")[1]}</div>
                </div>
            </div>
            <div className={`card-fs${props.showModal ? " open" : ""}`}>
                <div className={"card-header"}>
                    <div className={"card-name"}>Прием {ticket.date.split(" ")[0]}</div>
                    <div className={"ticket-status"}>Статус: {ticket.status}</div>
                </div>
            </div>
        </>
    )
}