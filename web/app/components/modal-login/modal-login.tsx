import "./modal-login.css"
import {useRef, useState} from "react";

type ModalLogin = {
    showModal: boolean
    showModalHandler: any
}



export function ModalLogin(props:ModalLogin) {
    const [email, setEmail] = useState("HTML");
    const [password, setPassword] = useState("")

    function handleChangeEmail(e: any) {
        setEmail(e.target.value);
    }
    function handleChangePassword(e: any) {
        setPassword(e.target.value);
    }

    function handleLoginClick() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!(emailRegex.test(email))) {
            alert("Неверно введен email адрес")
        }
        else if (!password) {
            alert("Введите пароль")
        }
        else {props.showModalHandler(false)}
    }

    if (props.showModal) {
        return (
            <>
                <div className={"background"}>
                    <h2>Вход</h2>
                    <input placeholder={"Почта"} className={"emailInput"} onChange={handleChangeEmail} />
                    <input placeholder={"Пароль"} className={"passwordInput"} onChange={handleChangePassword} />
                    <a>Регистрация</a>
                    <a>Восстановление пароля</a>
                    <div className={"confirmButton"} onClick={handleLoginClick}>Вход</div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className={"background"}>
                    <h2>Вход</h2>
                </div>
            </>
        )
    }
}