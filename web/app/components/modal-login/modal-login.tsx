import "./modal-login.css"
import { useState } from "react";

type ModalLogin = {
    showModal: boolean
    handleShowModal: any
}



export function ModalLogin(props:ModalLogin) {
    const [email, setEmail] = useState("");
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
        else {
            props.handleShowModal(false)
            setEmail("")
            setPassword("")
        }
    }

    return (
        <>
            <div className={"login-button"} onClick={() => props.handleShowModal(true)}>Вход</div>
            <div className={`blackout ${props.showModal ? "open" : ""}`}>
                <div className={`login ${props.showModal ? "open" : ""}`}>
                    <h2>Вход</h2>
                    <div className={"close"} onClick={() => {
                        props.handleShowModal(false)
                        setEmail("")
                        setPassword("")
                    }}>x</div>
                    <input placeholder={"Почта"} type={"email"} className={"email-input"} onChange={handleChangeEmail} value={email}/>
                    <input placeholder={"Пароль"} type={"password"} className={"password-input" } onChange={handleChangePassword} value={password}/>
                    <div className={"bottom-content"}>
                        <p className={"registration"}>Регистрация</p>
                        <p className={"recovery"}>Восстановление пароля</p>
                        <div className={"confirm-button"} onClick={handleLoginClick}>Вход</div>
                    </div>

                </div>
            </div>
        </>
    )
}