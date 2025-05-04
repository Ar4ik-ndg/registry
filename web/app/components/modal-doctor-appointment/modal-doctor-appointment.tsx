import "./modal-doctor-appointment.css"
import {type Ticket, TicketStatus} from "~/core/models";
import {useState} from "react";

type ModalDoctorAppointment = {
    showModal: boolean;
    handleShowModal: any;
    ticket: Ticket;
}

export function ModalDoctorAppointment(props: ModalDoctorAppointment) {
    const ticket = props.ticket;

    function handleClick() {
        console.log(props.showModal);
        props.handleShowModal(true);
    }

    function closeAppointment() {
        //обновление тикета (статус -> TicketStatus.completed) PUT http://localhost:8080/api/v0.1/med/tickets/update/<ticketId>
    }

    function continueAppointment() {
        //обновление тикета (статус -> TicketStatus.processing; PUT http://localhost:8080/api/v0.1/med/tickets/update/<ticketId>
    }

    return (
        <>
            <div className={"card"} onClick={()=> {
                handleClick()
            }}>
                <div className={"card-header"}>
                    <div className={"card-name"}>Прием {ticket.date.split(" ")[0]}</div>
                    <div className={"ticket-status"}>Статус: {ticket.status}</div>
                </div>
                <div className={"card-description"}>
                    <div className={"doctor"}>Специалист: {ticket.doctor.fullName}</div>
                    <div className={"results"}>Результат:<br/>{ticket.results ?? "пока нет результата"}</div>
                    <div className={"description"}>Жалоба:<br/>{ticket.description}</div>
                    <div className={"time"}>Время: {ticket.date.split(" ")[1]}</div>
                </div>
            </div>
            <div className={`card-fs${props.showModal ? " open" : ""}`}>
                <div className={"card"}>
                    <div className={"close"} onClick={()=>props.handleShowModal(false)}>x</div>
                    <div className={"card-header"}>
                        <div className={"card-name"}>Прием {ticket.date.split(" ")[0]}</div>
                        <div className={"ticket-status"}>Статус: {ticket.status}</div>
                    </div>
                    <div className={"card-description"}>
                        <div className={"doctor"}>Специалист: {ticket.doctor.fullName}</div>
                        <div className={"results"}>Результат:<br/><textarea placeholder={"Введите результат осмотра"}/></div>
                        <div className={"description"}>Жалоба:<br/>{ticket.description}</div>
                        <div className={"time"}>Время: {ticket.date.split(" ")[1]}</div>
                    </div>
                    <div className={"card-buttons"}>
                        <div className={"confirm-button"} onClick={closeAppointment}>Закрыть прием</div>
                        <div className={"continue-button"} onClick={continueAppointment}>Отправить на обработку</div>
                    </div>
                </div>
            </div>
        </>
    )
}