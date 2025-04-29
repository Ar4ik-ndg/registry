import "./modal-login.css"
import { useState } from "react";
import { ModalRegister} from "~/components/modal-register/modal-register";
import {type AuthRequest, ModalTypes} from "~/core/models";
import {loginUser} from "~/core/utils";

type ModalLogin = {
    showModal: boolean
    handleShowModal: any
    modalType: ModalTypes
    handleModelType: any
    isAuth: boolean
    handleIsAuth: any
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
            let request : AuthRequest = {
                password: password,
                email: email
            }

            loginUser(request,(response:boolean) => {
                if (response) {
                    props.handleShowModal(false)
                    props.handleModelType(ModalTypes.Login)
                    props.handleIsAuth(true)
                    setEmail("")
                    setPassword("")
                }
            });
        }
    }
    if(!props.isAuth){
        switch (props.modalType) {
            case ModalTypes.Login:
                return(
                    <>
                        <div className={`blackout ${props.showModal ? "open" : ""}`}>
                            <div className={`login-box ${props.showModal ? "open" : ""}`}>
                                <h2>Вход</h2>
                                <div className={"close"} onClick={() => {
                                    props.handleShowModal(false)
                                    setEmail("")
                                    setPassword("")
                                }}>x
                                </div>
                                <input required placeholder={"Почта"} type={"email"} className={"email-input"}
                                       onChange={handleChangeEmail} value={email}/>
                                <input required placeholder={"Пароль"} type={"password"} className={"password-input"}
                                       onChange={handleChangePassword} value={password}/>
                                <div className={"bottom-content"}>
                                    <div className={"register"}
                                         onClick={() => {
                                             debugger;
                                             props.handleModelType(ModalTypes.Register)
                                         }}>Регистрация
                                    </div>
                                    <p className={"recovery"}>Восстановление пароля</p>
                                    <div className={"confirm-button"} onClick={handleLoginClick}>Вход</div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            case ModalTypes.Register:
                return(<ModalRegister showModal={props.showModal} handleShowModal={props.handleShowModal} modalType={props.modalType} handleModelType={props.handleModelType} isAuth={props.isAuth} handleIsAuth={props.handleIsAuth}/>)
        }
    }
}