import "./account-page.css"
import type { Route } from "./+types/account-page"
import type {Ticket, User} from "~/core/models"
import {useEffect, useState} from "react";
import {getTicketsList, getUser} from "~/core/utils";

export default function AccountPage({loaderData}: Route.ComponentProps) {
    // тут должно загружаться по примеру: loaderData.user.fullName (т.е. loader должен возвращать user: User)

    const [user,setUser] = useState<User | null>(null)

    const [isSuccessGetTickets, setIsSuccessGetTickets] = useState<boolean>(false)
    const [ticketsList, setTicketsList] = useState<Array<Ticket>>([])

    function handleSetUser(u:any){
        setUser(u)
    }

    function handleSetTicketsList(l:any){
        setTicketsList(l)
    }

    function handleSetIsSuccessGetTickets(a:any){
        setIsSuccessGetTickets(a)
    }

    useEffect(() => {
        handleSetUser(getUser())
        getTicketsList(user?.id!!, handleSetIsSuccessGetTickets, handleSetTicketsList)
    }, []);

    return (
        <>
            <main className="account-page">
                <h2>Ваши приемы</h2>
                <div className="appointments">
                </div>
                <h2 className="user-info">Личная информация</h2>
                <div className="user-info">
                    <ul>
                        <li className={"fullName "}>
                            <p>ФИО</p>
                            <input readOnly={true}/>
                        </li>
                        <li className={"birthday "}>
                            <p>Дата рождения</p>
                            <input readOnly={true} type="date"/>
                        </li>
                        <li className={"passport "}>
                            <p>Серия, номер паспорта</p>
                            <input readOnly={true} maxLength={10}/>
                        </li>
                        <li className={"snils "}>
                            <p>СНИЛС</p>
                            <input readOnly={true} maxLength={11}/>
                        </li>
                        <li className={"medPolicy "}>
                            <p>Номер мед. полиса</p>
                            <input readOnly={true} maxLength={16}/>
                        </li>
                        <li className={"email "}>
                            <p>Email</p>
                            <input readOnly={true} type="email"/>
                        </li>
                        <li className={"phone "}>
                            <p>Номер телефона</p>
                            <input readOnly={true} type="tel"/>
                        </li>
                    </ul>
                    <div className="buttons">
                        <div className="change-button">Изменить данные</div>
                        <div className="change-button">Изменить пароль</div>
                        <div className="cancel-button">Выйти</div>
                    </div>
                    <div>
                        {ticketsList.map((t:Ticket) => {
                            return (<li>{t.description} {t.date} {t.doctor}</li>)
                        })}
                    </div>
                </div>
            </main>
        </>
    )
}