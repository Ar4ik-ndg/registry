import "./modal-staff-appointment.css"
import {type Ticket, TicketStatus} from "~/core/models";
import {useState} from "react";

type ModalStaffAppointment = {
    ticket: Ticket;
}

export function ModalStaffAppointment(props: ModalStaffAppointment) {
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
                <div className={"card-buttons"}>
                    <div className={"confirm-button"} onClick={confirmAppointment}>Подтвердить</div>
                    <div className={"cancel-button"} onClick={()=>handleShowCancel(true)}>Отклонить</div>
                    <div className={`card-blackout${showCancel ? " open" : ""}`}>
                        <div className={`cancel-reason`}>
                            <div className={"close-cancel"}>x</div>
                            <input required={true} list={"reasons"} type={"text"} name={"reasons"}
                                   placeholder={"Введите причину отказа"} onChange={handleReason}
                                   className={"input-cancel"}/>
                            <datalist id={"reasons"}>
                                <option>Врач отсутствует в выбранную дату</option>
                                <option>Повторная запись</option>
                                <option>Данное время уже занято</option>
                                <option>Ошибка при выборе врача или отделения</option>
                                <option>Жалоба отсутствует или не является медицинской</option>
                                <option>Жалоба не соответствует профилю врача</option>
                            </datalist>
                            <div className={"cancel-button"} onClick={() => cancelAppointment(reason)}>Отклонить прием
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}