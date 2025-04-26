import type { Route } from "./+types/test";
import { ModalRegister } from "~/components/modal-register/modal-register";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Test page" },
        { name: "description", content: "Testing modules, pages, etc." },
    ];
}

export default function Home() {
    const [showModal, setShowModal] = useState(true);

    function handleShowModal(change: any) {
        setShowModal(change);
    }

    return (
        <div>
            <ModalRegister showModal={showModal} handleShowModal={handleShowModal} />
        </div>
    );
}