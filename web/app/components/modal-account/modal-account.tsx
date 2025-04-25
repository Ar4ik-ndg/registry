import "./modal-account.css";
import {useState} from "react";
import { Link} from "react-router";
import { ModalLogin } from "~/components/modal-login/modal-login";

type ModalAccountProps = {
    showModal: boolean
    handleShowModal: any
    isAuthenticated: boolean
    userName: string
}

export function ModalAccount(props:ModalAccountProps) {
    const [showLoginModal, setShowLoginModal] = useState(false);

    function showModalHandler(changeState: any) {
        setShowLoginModal(changeState);
    }

    if (props.isAuthenticated){
        return (
            <>
                <div onClick={()=> props.handleShowModal(!props.showModal)} className={`userName nav-button`}>
                    <p>{props.userName.split(" ")[1]}</p>
                    <div className={`burger ${props.showModal? "open" : ""}`}>
                        <div className={"line"}><Link to="/account">Личный кабинет</Link></div>
                        <div className={"divider"}></div>
                        <div className={"line"}>Выход</div>
                    </div>
                </div>
            </>
        )
    }
    else{
        return (
            <>
                <div onClick={() => showModalHandler(true)}>
                    <ModalLogin showModal={showLoginModal} showModalHandler={showModalHandler} />
                </div>
            </>
        )
    }
}