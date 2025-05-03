import "./modal-account.css";
import { Link} from "react-router";
import { getUser, logout } from "~/core/utils";
import {useRef, useEffect} from "react";

type ModalAccountProps = {
    showModal: boolean
    handleShowModal: any
    isAuth: boolean
    handleIsAuth: any
}

export function ModalAccount(props:ModalAccountProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const userId = getUser()?.id;

    useEffect(() => {
        function handleClickOutside(event: globalThis.MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                props.handleShowModal(false);
            }
        }

        if (props.showModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [props.showModal]);

    if (props.isAuth && userId){
        return (
            <>
                <div ref={modalRef} className={`burger ${props.showModal? "open" : ""}`}>
                    <div className={`line`}><Link to={`/account/${userId}`}>Личный кабинет</Link></div>
                    <div className={"divider"}></div>
                    <Link to={"/"} className={"line"} onClick={() => {
                        logout();
                        props.handleShowModal(false);
                        props.handleIsAuth()
                    }}>Выход</Link>
                </div>
            </>
        )
    }
}