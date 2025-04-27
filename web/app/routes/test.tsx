import type { Route } from "./+types/test";
import { ModalMessageBox } from "~/components/modal-message-box/modal-message-box";
import {useEffect, useState} from "react";
import {getMessage} from "~/core/utils";
import {color} from "motion-dom";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Test page" },
        { name: "description", content: "Testing modules, pages, etc." },
    ];
}


export default function Home() {
    const [showModal, setShowModal] = useState(true);
    const [message, setMessage] = useState<string|null>(null);

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
    })

    return (
        <>
            <div className={"button"} style={{color:"black", cursor:"pointer"}} onClick={()=> handleShowModal(true)}>[]</div>
            <ModalMessageBox showModal={showModal} handleShowModal={handleShowModal} message={message} handleMessage={handleMessage}/>
        </>
    );
}