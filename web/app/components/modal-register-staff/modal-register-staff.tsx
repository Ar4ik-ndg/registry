import "./modal-register-staff.css"
import {useEffect, useState} from "react";
import {ModalLogin} from "~/components/modal-login/modal-login";
import {ModalTypes, type RegistryStaffRequest, type RegistryUserRequest} from "~/core/models";
import {getMessage, registryUser} from "~/core/utils";
import {ModalMessageBox} from "~/components/modal-message-box/modal-message-box";
import {useNavigate} from "react-router";

type ModalRegisterStaff = {
    showModal: boolean
    handleShowModal: any
}

export function ModalRegisterStaff(props: ModalRegisterStaff) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [prof, setProf] = useState(null);
    const [role, setRole] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    function setAllValues(setValue: any){
        setEmail(setValue)
        setPassword(setValue)
        setFullName(setValue)
        setPhone(setValue)
        setProf(setValue)
        setRole(setValue)
    }

    function handleChangeFullName(e: any) {
        setFullName(e.target.value);
    }

    function handleChangePhone(e: any) {
        setPhone(e.target.value);
    }

    function handleChangeProf(e: any) {
        setProf(e.target.value);
    }

    function handleChangeRole(e: any) {
        setRole(e.target.value);
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
        else if (!password || !fullName || !phone || !role) {
            alert("Не все данные введены")
        }
        if (prof === "") handleChangeProf(null);

        else {
            let request : RegistryStaffRequest = {
                fullName: fullName,
                phone: phone,
                email: email,
                prof: prof,
                role: role
            }
            // registryUser(request , (response:boolean) => {
            //     if (response) {
            //         props.handleShowModal(false)
            //         setAllValues("")
            //         navigate("/")
            //     }
            //     else {
            //         handleShowModalMessage(true)
            //         handleMessage(getMessage())
            //     }
            // });
        }
    }

    useEffect(() => {
        setAllValues("")
    }, [])

    return (
        <>
            <div className={`blackout-auth ${props.showModal ? "open" : ""}`}>
                <form autoComplete={"off"} className={`register-box ${props.showModal ? "open" : ""}`}>
                    <h2>Регистрация</h2>
                    <div className={"close"} onClick={() => {
                        props.handleShowModal(false)
                        setAllValues("")
                    }}>x</div>
                    <input required placeholder={"ФИО"} name={"fullName"}
                           onChange={handleChangeFullName} value={fullName} type={"text"}/>
                    <input required placeholder={"Почта"} autoComplete={"email"} name={"email"}
                           onChange={handleChangeEmail} value={email} type={"email"} className={"email-input"}/>
                    <input required placeholder={"Номер телефона"} autoComplete={"tel"} name={"phone"}
                           onChange={handleChangePhone} value={phone} maxLength={12}/>
                    <input required placeholder={"Специальность"} name={"prof"}
                           onChange={handleChangeProf} value={prof??""} maxLength={10}/>
                    <input required placeholder={"Роль"} name={"snils"}
                           onChange={handleChangeRole} value={role} maxLength={11}/>
                    <input required placeholder={"Пароль"} autoComplete={"current-password"} name={"password"}
                           onChange={handleChangePassword} value={password} type={"password"} className={"password-input"}/>
                    <ModalMessageBox showModal={showMessage} handleShowModal={handleShowModalMessage} message={message} handleMessage={handleMessage}/>
                    <div className={"bottom-content"}>
                        <div className={"confirm-button"} onClick={handleConfirmClick}>Регистрация</div>
                    </div>
                </form>
            </div>
        </>
    )
}