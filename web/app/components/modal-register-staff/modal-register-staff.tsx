import "./modal-register-staff.css"
import {useEffect, useState} from "react";
import {ModalLogin} from "~/components/modal-login/modal-login";
import {ModalTypes, type RegistryStaffRequest, type RegistryUserRequest, Roles} from "~/core/models";
import {getMessage, registryStaff, registryUser} from "~/core/utils";
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
    const [role, setRole] = useState(Roles.ADMIN);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    function setAllValues(setValue: any){
        setEmail(setValue)
        setPassword(setValue)
        setFullName(setValue)
        setPhone(setValue)
        setProf(setValue)
    }

    function handleChangeFullName(e: any) {
        setFullName(e.target.value);
    }

    function handleChangePhone(e: any) {
        setPhone(e.target.value);
    }

    function handleChangeProf(e: any) {
        e? setProf(e.target.value) : setProf(null)
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
        console.log(fullName, phone, prof, role, email, password);
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
                role: role,
                password: password
            }
            registryStaff(request , (response:boolean) => {
                if (response) {
                    props.handleShowModal(false)
                    setAllValues("")
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
                    <input placeholder={"Специальность"} name={"prof"}
                           onChange={handleChangeProf} value={prof??""} maxLength={10}/>
                    <select onChange={handleChangeRole} value={role} className={"role-select"}>
                        <option value={Roles.ADMIN}>{Roles.ADMIN}</option>
                        <option value={Roles.DOCTOR}>{Roles.DOCTOR}</option>
                        <option value={Roles.REGISTRAR}>{Roles.REGISTRAR}</option>
                    </select>
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