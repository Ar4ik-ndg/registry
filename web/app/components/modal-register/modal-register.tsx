import "./modal-register.css"
import {useEffect, useState} from "react";
import {ModalLogin} from "~/components/modal-login/modal-login";
import {ModalTypes, type RegistryUserRequest} from "~/core/models";
import {RegisterUser} from "~/core/api";
import {getMessage, registryUser} from "~/core/utils";
import {ModalMessageBox} from "~/components/modal-message-box/modal-message-box";
import {useNavigate} from "react-router";

type ModalRegister = {
    showModal: boolean
    handleShowModal: any
    modalType: ModalTypes
    handleModelType: any
    isAuth: boolean
    handleIsAuth: any
}

export function ModalRegister(props: ModalRegister) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [passport, setPassport] = useState("");
    const [medPolicy, setMedPolicy] = useState("");
    const [snils, setSnils] = useState("");
    const [birthday, setBirthday] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    function setAllValues(setValue: any){
        setEmail(setValue)
        setPassword(setValue)
        setFullName(setValue)
        setPhone(setValue)
        setPassport(setValue)
        setMedPolicy(setValue)
        setSnils(setValue)
        setBirthday(setValue)
    }

    function handleChangeFullName(e: any) {
        setFullName(e.target.value);
    }

    function handleChangePhone(e: any) {
        setPhone(e.target.value);
    }

    function handleChangePassport(e: any) {
        setPassport(e.target.value);
    }

    function handleChangeMedPolicy(e: any) {
        setMedPolicy(e.target.value);
    }

    function handleChangeSnils(e: any) {
        setSnils(e.target.value);
    }

    function handleChangeBirthday(e: any) {
        setBirthday(e.target.value);
    }

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

    function handleConfirmClick() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!(emailRegex.test(email))) {
            alert("Неверно введен email адрес")
        }
        else if (!password || !fullName || !phone || !passport || !medPolicy || !snils || !birthday) {
            alert("Не все данные введены")
        }
        else {
            let request : RegistryUserRequest = {
                medPolicy: medPolicy,
                passport: passport,
                password: password,
                phone: phone,
                snils: snils,
                birthday: birthday,
                email: email,
                fullName: fullName
            }
            registryUser(request , (response:boolean) => {
                if (response) {
                    props.handleShowModal(false)
                    props.handleModelType(ModalTypes.Login)
                    props.handleIsAuth(true)
                    setAllValues("")
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
        setAllValues("")
    }, [])

    if(!props.isAuth){
        switch (props.modalType) {
            case ModalTypes.Register:
                return (
                    <>
                        <div className={`blackout ${props.showModal ? "open" : ""}`}>
                            <form autoComplete={"off"} className={`register-box ${props.showModal ? "open" : ""}`}>
                                <h2>Регистрация</h2>
                                <div className={"close"} onClick={() => {
                                    props.handleShowModal(false)
                                    props.handleModelType(ModalTypes.Login)
                                    setAllValues("")
                                }}>x
                                </div>
                                <input required placeholder={"ФИО"} name={"fullName"}
                                       onChange={handleChangeFullName} value={fullName} type={"text"}/>
                                <input required placeholder={"Почта"} autoComplete={"email"} name={"email"}
                                       onChange={handleChangeEmail} value={email} type={"email"} className={"email-input"}/>
                                <input required placeholder={"Номер телефона"} autoComplete={"tel"} name={"phone"}
                                       onChange={handleChangePhone} value={phone} maxLength={12}/>
                                <p className={"birthday-input"}>
                                    Дата рождения
                                    <input required placeholder={"Дата рождения"} autoComplete={"bday"} name={"birthday"}
                                           onChange={handleChangeBirthday} value={birthday} type={"date"}/>
                                </p>

                                <input required placeholder={"Паспорт"} name={"passport"}
                                       onChange={handleChangePassport} value={passport} maxLength={10}/>
                                <input required placeholder={"СНИЛС"} name={"snils"}
                                       onChange={handleChangeSnils} value={snils} maxLength={11}/>
                                <input required placeholder={"Номер мед. полиса"} name={"medPolicy"}
                                       onChange={handleChangeMedPolicy} value={medPolicy} maxLength={16}/>
                                <input required placeholder={"Пароль"} autoComplete={"current-password"} name={"password"}
                                       onChange={handleChangePassword} value={password} type={"password"} className={"password-input"}/>
                                <ModalMessageBox showModal={showMessage} handleShowModal={handleShowModalMessage} message={message} handleMessage={handleMessage}/>
                                <div className={"bottom-content"}>
                                    <div className={"login"} onClick={() => props.handleModelType(ModalTypes.Login)}>Уже есть аккаунт? Вход</div>
                                    <p className={"recovery"}>Восстановление пароля</p>
                                    <div className={"confirm-button"} onClick={handleConfirmClick}>Регистрация</div>
                                </div>
                            </form>
                        </div>
                    </>
                )
            case ModalTypes.Login:
                return (<ModalLogin showModal={props.showModal} handleShowModal={props.handleShowModal} modalType={props.modalType} handleModelType={props.handleModelType} isAuth={props.isAuth} handleIsAuth={props.handleIsAuth}/>)
        }
    }
}