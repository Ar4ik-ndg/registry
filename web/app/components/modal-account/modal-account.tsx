import "./modal-account.css";
import { Link} from "react-router";
import {checkAuth, logout} from "~/core/utils";

type ModalAccountProps = {
    showModal: boolean
    handleShowModal: any
    isAuth: boolean
    handleIsAuth: any
}

export function ModalAccount(props:ModalAccountProps) {
    if (props.isAuth){
        return (
            <>
                <div className={`burger ${props.showModal? "open" : ""}`}>
                    {/*тут в Link /account/userId */}
                    <div className={"line"}><Link to="/account/">Личный кабинет</Link></div>
                    <div className={"divider"}></div>
                    <div className={"line"} onClick={() => {
                        logout();
                        props.handleShowModal(false);
                        props.handleIsAuth()
                    }}>Выход</div>
                </div>
            </>
        )
    }
}