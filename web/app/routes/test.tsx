import type { Route } from "./+types/test";
import Loading from "~/assets/loading.svg"
import { ModalUserAppointment } from "~/components/modal-user-appointment/modal-user-appointment";
import {useEffect, useState} from "react";
import {getMessage, getUser} from "~/core/utils";
import {Roles, type Ticket, TicketStatus, type User} from "~/core/models"
import {addDays, format} from "date-fns";
import { ModalStaffAppointment } from "~/components/modal-staff-appointment/modal-staff-appointment";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Test page" },
        { name: "description", content: "Testing modules, pages, etc." },
    ];
}


export default function Home() {
    const [showModal, setShowModal] = useState(true);
    const [message, setMessage] = useState<string|null>(null);
    const [user, setUser] = useState<User|null>(null);

    const ticket: Ticket = {id: "123",
        date: format(addDays(new Date(),2), "dd.MM.yyyy HH:mm"),
        description: "test description",
        result: null,
        doctor: "ТЕст тест",
        status: TicketStatus.confirmed,
        user: user? user : { id: "123",
            birthday: "string",
            email: "string",
            fullName: "string",
            medPolicy: "string",
            passport: "string",
            phone: "string",
            snils: "string",
            role: "Roles",}}

    function handleShowModal(change: any) {
        setShowModal(change);
    }

    function handleMessage(msg: string|null) {
        if (msg === null && getMessage()) {
            localStorage.removeItem("message");
        }
        setMessage(msg);
    }

    useEffect(() => {
        setMessage(getMessage());
        setUser(getUser());
    },[])

    return (
        <>
            <div className={"button"} style={{color:"black", cursor:"pointer"}} onClick={()=> handleShowModal(true)}><img src={Loading} alt={"не загрузилось"} className={"loading"}/></div>
            {/*<ModalStaffAppointment showModal={showModal} handleShowModal={handleShowModal} ticket={ticket}/>*/}
        </>
    );
}