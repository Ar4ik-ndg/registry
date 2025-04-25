import "./modal-account.css";
import {useState} from "react";
import { Link} from "react-router";
import { ModalLogin } from "~/components/modal-login/modal-login";

type ModalAccountProps = {
    showModal: boolean
    setShowModal: any
    isAuthenticated: boolean
    userName: string
}

export function ModalAccount(props:ModalAccountProps) {


    if (props.isAuthenticated){
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <div onClick={() => setIsOpen(!isOpen)} className={`userName ${isOpen ? "open" : ""} nav-button`}>
                    <p>{props.userName.split(" ")[1]}</p>
                    <div className={`burger ${isOpen? "open" : ""}`}>
                        <div className={"line"}><Link to="/account">Личный кабинет</Link></div>
                        <div className={"divider"}></div>
                        <div className={"line"}>Выход</div>
                    </div>
                </div>
            </>
        )
    }
    else{
        const [showLoginModal, setShowLoginModal] = useState(false);

        function showModalHandler(changeState: any) {
            setShowLoginModal(changeState);
        }
        return (
            <>
                <div onClick={() => showModalHandler(true)}>
                    <ModalLogin showModal={showLoginModal} showModalHandler={showModalHandler} />
                </div>
            </>
        )
    }
}