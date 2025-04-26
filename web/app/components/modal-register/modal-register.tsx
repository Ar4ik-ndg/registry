import "./modal-register.css"
import {useState} from "react";
import {ModalLogin} from "~/components/modal-login/modal-login";
import { ModalTypes } from "~/core/models";

type ModalRegister = {
    showModal: boolean
    handleShowModal: any
    modalType: ModalTypes
    handleModelType: any
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

    function handleConfirmClick() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!(emailRegex.test(email))) {
            alert("Неверно введен email адрес")
        }
        else if (!password || !fullName || !phone || !passport || !medPolicy || !snils || !birthday) {
            alert("Не все данные введены")
        }
        else {
            props.handleShowModal(false)
            setEmail("")
            setPassword("")
            setFullName("")
            setPhone("")
            setPassport("")
            setMedPolicy("")
            setSnils("")
            setBirthday("")
            // Отправка на регистрацию (/register)
        }
    }
    switch (props.modalType) {
        case ModalTypes.Register:
            return (
            <>
                <div className={`blackout ${props.showModal ? "open" : ""}`}>
                    <div className={`register-box ${props.showModal ? "open" : ""}`}>
                        <h2>Регистрация</h2>
                        <div className={"close"} onClick={() => {
                            props.handleShowModal(false)
                            setEmail("")
                            setPassword("")
                        }}>x
                        </div>
                        <input required placeholder={"ФИО"} onChange={handleChangeFullName} value={fullName}/>
                        <input required placeholder={"Почта"} type={"email"} className={"email-input"} onChange={handleChangeEmail} value={email}/>
                        <input required placeholder={"Номер телефона"} onChange={handleChangePhone} value={phone} maxLength={12}/>
                        <p className={"birthday-input"}>
                            Дата рождения {birthday}
                            <input required placeholder={"Дата рождения"} onChange={handleChangeBirthday} value={birthday} type={"date"}/>
                        </p>

                        <input required placeholder={"Паспорт"} onChange={handleChangePassport} value={passport} maxLength={10}/>
                        <input required placeholder={"СНИЛС"} onChange={handleChangeSnils} value={snils} maxLength={11}/>
                        <input required placeholder={"Номер мед. полиса"} onChange={handleChangeMedPolicy} value={medPolicy} maxLength={16}/>
                        <input required placeholder={"Пароль"} type={"password"} className={"password-input"}
                               onChange={handleChangePassword} value={password}/>
                        <div className={"bottom-content"}>
                            <div className={"login"} onClick={() => props.handleModelType(ModalTypes.Login)}>Уже есть аккаунт? Вход</div>
                            <p className={"recovery"}>Восстановление пароля</p>
                            <div className={"confirm-button"} onClick={handleConfirmClick}>Вход</div>
                        </div>
                    </div>
                </div>
            </>
        )
        case ModalTypes.Login:
            return (<ModalLogin showModal={props.showModal} handleShowModal={props.handleShowModal} modalType={props.modalType} handleModelType={props.handleModelType}/>)
    }
}