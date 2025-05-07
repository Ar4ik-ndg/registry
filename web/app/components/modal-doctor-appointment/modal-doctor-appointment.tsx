import "./modal-doctor-appointment.css"
import {type Ticket, TicketStatus, type UpdateTicketRequest} from "~/core/models";
import {useEffect, useState} from "react";
import {updateTicket} from "~/core/utils";

type ModalDoctorAppointment = {
    showModal: boolean;
    handleShowModal: any;
    ticket: Ticket;
}

export function ModalDoctorAppointment(props: ModalDoctorAppointment) {
    const [ticket, setTicket] = useState<Ticket>(props.ticket);
    const [results, setResults] = useState<string|null>("");
    const [showFs, setShowFs] = useState<boolean>(false);

    function handleSetTicket(ticket: Ticket) {
        setTicket(ticket);
    }

    function handleSetShowFs(u: boolean) {
        setShowFs(u);
    }

    function handleSetResults(u: any) {
        if (u.target.value == "" || u == "") {setResults(null);} else { setResults(u.target.value); }
    }

    function closeAppointment() {
        const updTicket: UpdateTicketRequest = {
            date: null,
            description: null,
            results: results,
            doctor: props.ticket.doctor.id,
            status: TicketStatus.completed,
            user: props.ticket.user.id,
        }
        updateTicket(ticket.id, updTicket, handleSetTicket, handleSetShowFs)
        if (!showFs) {
            handleSetResults(null);
            props.handleShowModal(false)
        }
        //обновление тикета (статус -> TicketStatus.completed) PUT http://localhost:8080/api/v0.1/med/tickets/update/<ticketId>
    }

    function continueAppointment() {
        const updTicket: UpdateTicketRequest = {
            date: null,
            description: null,
            results: results,
            doctor: props.ticket.doctor.id,
            status: TicketStatus.processing,
            user: props.ticket.user.id,
        }
        updateTicket(ticket.id, updTicket, handleSetTicket, handleSetShowFs)
        if (!showFs) {
            handleSetResults(null);
            props.handleShowModal(false)
        }
        //обновление тикета (статус -> TicketStatus.processing; PUT http://localhost:8080/api/v0.1/med/tickets/update/<ticketId>
    }


    if(props.showModal){
        return (
            <>
                <div className={"card"} onClick={() => {
                    handleSetShowFs(true)
                }}>
                    <div className={"card-header"}>
                        <div className={"card-name"}>Прием {ticket.date.split(" ")[0]}</div>
                        <div className={"ticket-status"}>Статус: {ticket.status}</div>
                    </div>
                    <div className={"card-description"}>
                        <div className={"doctor"}>Специалист: {ticket.doctor.fullName}<br/>{ticket.doctor.prof}</div>
                        <div className={"results"}>Результат:<textarea value={ticket.results?? "пока нет результата"} readOnly={true}/></div>
                        <div className={"description"}>Жалоба:<textarea value={ticket.description} readOnly={true}/></div>
                        <div className={"time"}>Время: {ticket.date.split(" ")[1]}</div>
                    </div>
                </div>
                <div className={`card-fs${showFs ? " open" : ""}`}>
                    <div className={"card"}>
                        <div className={"close"} onClick={() => handleSetShowFs(false)}>x</div>
                        <div className={"card-header"}>
                            <div className={"card-name"}>Прием {ticket.date.split(" ")[0]}</div>
                            <div className={"ticket-status"}>Статус: {ticket.status}</div>
                        </div>
                        <div className={"card-description"}>
                            <div className={"doctor"}>Специалист: {ticket.doctor.fullName}<br/>{ticket.doctor.prof}
                            </div>
                            <div className={"results"}>Результат:<br/><textarea
                                placeholder={"Введите результат осмотра"} onChange={handleSetResults}
                                value={results ?? ""}/></div>
                            <div className={"description"}>Жалоба:<textarea value={ticket.description} readOnly={true}/>
                            </div>
                            <div className={"time"}>Время: {ticket.date.split(" ")[1]}</div>
                        </div>
                        <div className={"card-buttons"}>
                            <div className={"confirm-button"} onClick={closeAppointment}>Закрыть прием</div>
                            <div className={"continue-button"} onClick={continueAppointment}>Отправить на обработку
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}