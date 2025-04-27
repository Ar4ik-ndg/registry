import "./account-page.css"
import type { Route } from "./+types/account-page"
import type { User } from "~/core/models"
import {useState} from "react";

export async function loader({params}: Route.LoaderArgs) {
    return {}
}

export default function AccountPage({params}: Route.ComponentProps) {
    const name = params.userId
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

                </div>
            </main>
        </>
    )
}