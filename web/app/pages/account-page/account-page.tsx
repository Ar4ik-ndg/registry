import "./account-page.css"
import type { Route } from "./+types/account-page"
import type {Ticket, User} from "~/core/models"
import {useEffect, useState} from "react";
import {getTicketsList, getUser, logout, sortArrayTickets} from "~/core/utils";
import {ModalUserAppointment} from "~/components/modal-user-appointment/modal-user-appointment";
import {Link, Navigate} from "react-router";

export default function AccountPage() {
    const [user,setUser] = useState<User | null>(null)
    const [fullname,setFullname] = useState<string>("")
    const [email,setEmail] = useState<string>("")
    const [birthday,setBirthday] = useState<string>("")
    const [passport,setPassport] = useState<string>("")
    const [snils,setSnils] = useState<string>("")
    const [medPolicy,setMedPolicy] = useState<string>("")
    const [phone,setPhone] = useState<string>("")
    const [isSuccessGetTickets, setIsSuccessGetTickets] = useState<boolean>(false)
    const [ticketsList, setTicketsList] = useState<Array<Ticket>>([])

    function handleSetUser(u:any){
        setUser(u)
    }

    function handleSetFullname(u:any){
        setFullname(u)
    }
    function handleSetEmail(u:any){
        setEmail(u)
    }
    function handleSetBirthday(u:any){
        setBirthday(u)
    }
    function handleSetPassport(u:any){
        setPassport(u)
    }
    function handleSetSnils(u:any){
        setSnils(u)
    }
    function handleSetMedPolicy(u:any){
        setMedPolicy(u)
    }
    function handleSetPhone(u:any){
        setPhone(u)
    }

    function handleSetTicketsList(l:any){
        setTicketsList(sortArrayTickets(l))
    }

    function handleSetIsSuccessGetTickets(a:any){
        setIsSuccessGetTickets(a)
    }

    useEffect(() => {
        let userStorage = getUser()
        if (userStorage) {
            handleSetUser(userStorage)
            getTicketsList(userStorage.id!!, handleSetIsSuccessGetTickets, handleSetTicketsList)
            handleSetFullname(userStorage.fullName)
            handleSetEmail(userStorage.email)
            handleSetBirthday(userStorage.birthday)
            handleSetMedPolicy(userStorage.medPolicy)
            handleSetPhone(userStorage.phone)
            handleSetPassport(userStorage.passport)
            handleSetSnils(userStorage.snils)
        }
    }, []);

    return (
        <>
            <main className="account-page">
                <h2>Ваши приемы</h2>
                <div className="appointments">
                    {ticketsList.map((t: Ticket) => {
                        return (<ModalUserAppointment showModal={true} handleShowModal={() => {
                        }} ticket={t}/>)
                    })}
                    <div className={"opacity"}></div>
                </div>
                <div className="user-info">
                    <h2>Личная информация</h2>
                    <ul>
                        <li className={"fullName "}>
                            <p>ФИО</p>
                            <input readOnly={true} value={fullname} onChange={handleSetFullname}
                                    name={"fullName"}/>
                        </li>
                        <li className={"birthday "}>
                            <p>Дата рождения</p>
                            <input readOnly={true} value={birthday} onChange={handleSetBirthday}
                                   type="date" name={"birthday"} />
                        </li>
                        <li className={"passport "}>
                            <p>Серия, номер паспорта</p>
                            <input readOnly={true}  maxLength={10} value={passport} onChange={handleSetPassport}
                                    name={"passport"}/>
                        </li>
                        <li className={"snils "}>
                            <p>СНИЛС</p>
                            <input readOnly={true} maxLength={11} value={snils} onChange={handleSetSnils}
                                    name="snils"/>
                        </li>
                        <li className={"medPolicy "}>
                            <p>Номер мед. полиса</p>
                            <input readOnly={true} maxLength={16} value={medPolicy} onChange={handleSetMedPolicy}
                                    name="medPolicy"/>
                        </li>
                        <li className={"email "}>
                            <p>Email</p>
                            <input readOnly={true} type="email" value={email} onChange={handleSetEmail}
                                    name="email"/>
                        </li>
                        <li className={"phone "}>
                            <p>Номер телефона</p>
                            <input readOnly={true} type="tel" value={phone} onChange={handleSetPhone}
                                    name="phone"/>
                        </li>
                    </ul>
                    <div className="buttons">
                        <Link to={"/auth"} className="cancel-button" onClick={() => {logout()}}>Выйти</Link>
                    </div>
                </div>
            </main>
        </>
    )
}