import type {Route} from "./+types/test";
import Loading from "~/assets/loading.svg"
import {useEffect, useState} from "react";
import {getMessage, getUser} from "~/core/utils";
import {type Ticket, TicketStatus, type User, type Staff} from "~/core/models"
import {ModalRegisterStaff} from "~/components/modal-register-staff/modal-register-staff";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Test page" },
        { name: "description", content: "Testing modules, pages, etc." },
    ];
}


export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState<string|null>(null);
    const [user, setUser] = useState<User|null>(null);

    const test_ticket: Ticket = {
        id: "608280f5-1f7f-4735-a102-fbcaf396c171",
        date: "01.01.2001 00:00",
        description: "test",
        result: null,
        doctor: {
            id: "e0db2437-e7b1-449a-a73f-acc6889995c1",
            fullName: "test user",
            phone: "test",
            email: "test doc",
            prof: "Терапевт",
            role: "DOCTOR"
        },
        status: TicketStatus.confirmed,
        user: {
            id: "1231232",
            email: "pacient@clinic.ru",
            birthday: "12.3.4567",
            fullName: "Иван Иванов Иванович",
            medPolicy: "1234567890",
            passport: "1234567890",
            phone: "+79120000000",
            snils: "1234567890",
            role: "USER"
        }
    }

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
            <ModalRegisterStaff handleShowModal={handleShowModal} showModal={showModal}/>
        </>
    );
}