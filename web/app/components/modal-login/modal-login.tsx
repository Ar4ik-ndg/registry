import "./modal-login.css"
import {useEffect, useState} from "react";
import { ModalRegister} from "~/components/modal-register/modal-register";
import {type AuthRequest, ModalTypes} from "~/core/models";
import {getMessage, loginUser} from "~/core/utils";
import {ModalMessageBox} from "~/components/modal-message-box/modal-message-box";
import {useNavigate} from "react-router";

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
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    function handleChangeEmail(e: any) {
        setEmail(e.target.value);
    }
    function handleChangePassword(e: any) {
        setPassword(e.target.value);
    }

    function handleShowModalMessage(e: any){
        setShowMessage(e)
    }

    function handleMessage(e: any) {
        if (e === null && getMessage()) {
            localStorage.removeItem("message");
        }
        setMessage(e)
    }

    function handleLoginClick() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!(emailRegex.test(email))) {
            handleMessage("Неверно введен email адрес")
            handleShowModalMessage(true)
        }
        else if (!password) {
            handleMessage("Введите пароль")
            handleShowModalMessage(true)
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
                    navigate("/")
                }
                else {
                    handleShowModalMessage(true)
                    handleMessage(getMessage())
                }
            });
        }
    }

    useEffect(() => {
        setEmail("")
        setPassword("")
    }, [])

    if(!props.isAuth){
        switch (props.modalType) {
            case ModalTypes.Login:
                return(
                    <>
                        <div className={`blackout-auth ${props.showModal ? "open" : ""}`}>
                            <div className={`login-box ${props.showModal ? "open" : ""}`}>
                                <h2>Вход</h2>
                                <div className={"close"} onClick={() => {
                                    props.handleShowModal(false)
                                    setEmail("")
                                    setPassword("")
                                }}>x
                                </div>
                                <input required placeholder={"Почта"} type={"email"} className={"email-input"}
                                       onChange={handleChangeEmail} value={email} autoComplete="email"/>
                                <input required placeholder={"Пароль"} type={"password"} className={"password-input"}
                                       onChange={handleChangePassword} value={password} autoComplete="password"/>
                                <ModalMessageBox showModal={showMessage} handleShowModal={handleShowModalMessage} message={message} handleMessage={handleMessage}/>
                                <div className={"bottom-content"}>
                                    <div className={"register"}
                                         onClick={() => {
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