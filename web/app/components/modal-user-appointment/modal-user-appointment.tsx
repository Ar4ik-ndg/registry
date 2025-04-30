import './modal-user-appointment.css'
import type {Tiket} from "~/core/models";
import { TiketStatus } from "~/core/models";
import {useEffect, useState} from "react";
import {format, parse, differenceInHours} from "date-fns";

type ModalOrderProps = {
    showModal: boolean
    handleShowModal: any
    tiket: Tiket
}

export function ModalUserAppointment(props:ModalOrderProps){
    const tiket = props.tiket;
    const [isAvaliable, setAvaliable] = useState(true)

    function checkAvaliable() {
        const today = new Date()
        const tiketDate = parse(tiket.date, "dd.MM.yyyy HH:mm", new Date())
        setAvaliable(Math.abs(differenceInHours(tiketDate, today)) >= 12);
    }

    useEffect(() => {
        checkAvaliable()
    },[])

    function handleCancel() {
        // PUT http://localhost:8080/api/v0.1/user/tikets/cancel/{tiket.id}
        setAvaliable(false)
    }

    if (props.showModal){
        return (
            <>
                <div className={"card"}>
                    {/*tiket обязательно содержит дату формата dd.MM.yyyy HH:mm*/}
                    <div className={"card-header"}>
                        <div className={"card-name"}>Прием {tiket.date.split(" ")[0]}</div>
                        <div className={"tiket-status"}>Статус: {tiket.status}</div>
                    </div>
                    <div className={"card-description"}>
                        <div className={"doctor"}>Специалист: {tiket.doctor}</div>
                        <div className={"description"}>{tiket.result?? "пока нет результата"}</div>
                        <div className={"time"}>Время: {tiket.date.split(" ")[1]}</div>
                    </div>
                    <div className={"buttons"}>
                        {(() => {
                            if ((tiket.status === TiketStatus.confirmed
                            || tiket.status === TiketStatus.scheduled)
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
    }else{
        return (
            <></>
        )
    }
}
