import './modal-user-appointment.css'
import {type Ticket, TicketStatus} from "~/core/models";
import {useEffect, useState} from "react";
import {differenceInHours, parse} from "date-fns";
import {cancelTicket} from "~/core/utils";

type ModalOrderProps = {
    showModal: boolean
    handleShowModal: any
    ticket: Ticket
}

export function ModalUserAppointment(props:ModalOrderProps){
    const [ticket, setTicket] = useState<Ticket>();
    const [isAvaliable, setAvaliable] = useState(true)

    function handleTicket(e:Ticket) {
        setTicket(e);
    }

    function handleIsAvaliable(u: boolean) {
        setAvaliable(u);
    }

    function checkAvaliable() {
        const today = new Date()
        const ticketDate = parse((ticket??props.ticket).date, "dd.MM.yyyy HH:mm", new Date())
        setAvaliable(Math.abs(differenceInHours(ticketDate, today)) >= 12 && ((ticket??props.ticket).status == TicketStatus.confirmed || (ticket??props.ticket).status == TicketStatus.scheduled));
    }

    useEffect(() => {
        checkAvaliable()
        handleTicket(props.ticket)
    },[])

    function handleCancel() {
        // PUT http://localhost:8080/api/v0.1/user/tickets/cancel/{ticket.id}
        cancelTicket(props.ticket.id, handleTicket, handleIsAvaliable)

        if (ticket) {
            debugger
            handleTicket(ticket);
            handleIsAvaliable(false);
        }
    }

    if (props.showModal){
        return (
            <>
                <div className={"card"}>
                    {/*ticket обязательно содержит дату формата dd.MM.yyyy HH:mm*/}
                    <div className={"card-header"}>
                        <div className={"card-name"}>Прием {(ticket??props.ticket).date.split(" ")[0]}</div>
                        <div className={"ticket-status"}>Статус: {(ticket??props.ticket).status}</div>
                    </div>
                    <div className={"card-description"}>
                        <div className={"doctor"}>Специалист: {(ticket??props.ticket).doctor.fullName}<br/>{(ticket??props.ticket).doctor.prof}</div>
                        <div className={"results"}>Результат:<textarea value={(ticket??props.ticket).results ?? "пока нет результата"}
                                                                       readOnly={true}/></div>
                        <div className={"description"}>Жалоба:<textarea value={(ticket??props.ticket).description} readOnly={true}/>
                        </div>
                        <div className={"time"}>Время: {(ticket ?? props.ticket).date.split(" ")[1]}</div>
                    </div>
                    <div className={"card-buttons"}>
                        {(() => {
                            if (((ticket??props.ticket).status === TicketStatus.confirmed
                            || (ticket??props.ticket).status === TicketStatus.scheduled)
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
