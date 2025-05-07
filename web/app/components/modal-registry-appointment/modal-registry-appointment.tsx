import "./modal-registry-appointment.css"
import {type Ticket, TicketStatus, type UpdateTicketRequest} from "~/core/models";
import {useState} from "react";
import {getMessage, updateTicket} from "~/core/utils";
import {ModalMessageBox} from "~/components/modal-message-box/modal-message-box";

type ModalRegistryAppointment = {
    ticket: Ticket;
}

export function ModalRegistryAppointment(props: ModalRegistryAppointment) {
    const [ticket, setTicket] = useState<Ticket>(props.ticket);
    const [showModal, setShowModal] = useState(true);
    const [showModalMessage, setShowModalMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [showCancel, setShowCancel] = useState(false)
    const [reason, setReason] = useState("")

    function handleSetTicket(ticket: Ticket) {
        setTicket(ticket);
    }

    function handleShowModal(e: boolean) {
        setShowModal(e)
    }

    function handleShowCancel(e: boolean) {
        setShowCancel(e)
    }

    function handleSetShowModalMessage(e: boolean) {
        setShowModalMessage(e)
    }

    function handleSetMessage(e: any) {
        if (e === null && getMessage()) {
            localStorage.removeItem("message");
        }
        setMessage(e)
    }

    function handleReason(e: any) {
        setReason(e.target.value)
    }

    function confirmAppointment() {
        const updTicket: UpdateTicketRequest = {
            date: null,
            description: null,
            results: null,
            doctor: props.ticket.doctor.id,
            status: TicketStatus.scheduled,
            user: props.ticket.user.id,
        }
        updateTicket(ticket.id, updTicket, handleSetTicket, handleShowModal)
        //обновление тикета (статус -> TicketStatus.scheduled) PUT http://localhost:8080/api/v0.1/med/tickets/update/<ticketId>
    }

    function cancelAppointment(reason: string) {
        if (reason !== "") {
            handleShowCancel(false)
            const updTicket: UpdateTicketRequest = {
                date: null,
                description: null,
                results: reason,
                doctor: props.ticket.doctor.id,
                status: TicketStatus.canceled,
                user: props.ticket.user.id,
            }
            updateTicket(ticket.id, updTicket, handleSetTicket, handleShowModal)
            setReason("")
        }
        else {
            handleSetMessage("Необходимо указать причину отмены")
            handleSetShowModalMessage(true)
        }
        //обновление тикета (статус -> TicketStatus.canceled; results -> отклонено по причине: ${reason}) PUT http://localhost:8080/api/v0.1/med/tickets/update/<ticketId>
    }

    if (showModal) {
        return (
            <>
                <ModalMessageBox showModal={showModalMessage} handleShowModal={handleSetShowModalMessage} message={message} handleMessage={handleSetMessage}/>
                <div className={"card"}>
                    <div className={"card-header"}>
                        <div className={"card-name"}>Прием {ticket.date.split(" ")[0]}</div>
                        <div className={"ticket-status"}>Статус: {ticket.status}</div>
                    </div>
                    <div className={"card-description"}>
                        <div className={"doctor"}>Специалист: {ticket.doctor.fullName}<br/>{ticket.doctor.prof}</div>
                        <div className={"results"}>Результат:<textarea value={ticket.results ?? "пока нет результата"} readOnly={true}/></div>
                        <div className={"description"}>Жалоба:<textarea value={ticket.description} readOnly={true}/></div>
                        <div className={"time"}>Время: {ticket.date.split(" ")[1]}</div>
                    </div>
                    <div className={"card-buttons"}>
                        <div className={"confirm-button"} onClick={confirmAppointment}>Подтвердить</div>
                        <div className={"cancel-button"} onClick={() => handleShowCancel(true)}>Отклонить</div>
                        <div className={`card-blackout${showCancel ? " open" : ""}`}>
                            <div className={`cancel-reason`}>
                                <div className={"close-cancel"} onClick={()=>handleShowCancel(false)}>x</div>
                                <input required={true} list={"reasons"} type={"text"} name={"reason"}
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
                                <div className={"cancel-button"} onClick={() => cancelAppointment(reason)}>Отклонить
                                    прием
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}