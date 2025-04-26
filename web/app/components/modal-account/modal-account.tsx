import "./modal-account.css";
import { Link} from "react-router";

type ModalAccountProps = {
    showModal: boolean
    handleShowModal: any
    isAuthenticated: boolean
    userName: string
}

export function ModalAccount(props:ModalAccountProps) {
    if (props.isAuthenticated){
        return (
            <>
                <div className={`burger ${props.showModal? "open" : ""}`}>
                    {/*тут в Link /account/userId */}
                    <div className={"line"}><Link to="/account/">Личный кабинет</Link></div>
                    <div className={"divider"}></div>
                    <div className={"line"}>Выход</div>
                </div>
            </>
        )
    }
}