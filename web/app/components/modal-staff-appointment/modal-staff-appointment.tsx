import "./modal-staff-appointment.css"
import {type Ticket, TicketStatus} from "~/core/models";
import {useState} from "react";

type ModalStaffAppointment = {
    showModal: boolean
    handleShowModal: any
    ticket: Ticket;
}

export function ModalStaffAppointment(props: ModalStaffAppointment) {
    const ticket = props.ticket;
    const [showCancel, setShowCancel] = useState(false)

    function confirmAppointment() {
        //обновление тикета (статус -> TicketStatus.scheduled) PUT http://localhost:8080/api/v0.1/med/tickets/update/<ticketId>
    }

    function cancelAppointment(reason: string) {
        //обновление тикета (статус -> TicketStatus.canceled; result -> отклонено по причине: ${reason}) PUT http://localhost:8080/api/v0.1/med/tickets/update/<ticketId>
    }

    if (props.showModal) {
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
                    <div className={"card-buttons"}>
                        <div className={"confirm-button"} onClick={()=>{}}>Подтвердить</div>
                        <div className={"cancel-button"} onClick={()=>{}}>Отклонить</div>
                    </div>
                </div>
            </>
        )
    }
}