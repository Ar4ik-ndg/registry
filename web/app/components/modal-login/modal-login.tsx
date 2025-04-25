import "./modal-login.css"
import {useRef} from "react";

type ModalLogin = {
    showModal: boolean
    showModalHandler: any
}



export function ModalLogin(props:ModalLogin) {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    function handleLoginClick() {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        if (!(email && email.includes("@") && email.includes("."))) {
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
                    <input ref={emailRef} placeholder={"Почта"} className={"emailInput"}/>
                    <input ref={passwordRef} placeholder={"Пароль"} className={"passwordInput"}/>
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