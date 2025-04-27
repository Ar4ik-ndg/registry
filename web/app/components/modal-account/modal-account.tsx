import "./modal-account.css";
import { Link} from "react-router";
import {checkAuth, getUser, logout} from "~/core/utils";

type ModalAccountProps = {
    showModal: boolean
    handleShowModal: any
    isAuth: boolean
    handleIsAuth: any
}

export function ModalAccount(props:ModalAccountProps) {
    const userId = getUser()?.id;
    if (props.isAuth && userId){
        return (
            <>
                <div className={`burger ${props.showModal? "open" : ""}`}>
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