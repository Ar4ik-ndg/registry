import "./staff-layout.css"

import {Link, Outlet, useNavigate} from "react-router";
import logo from "~/assets/logo.png";
import {ModalAccount} from "~/components/modal-account/modal-account";
import {ModalLogin} from "~/components/modal-login/modal-login";
import {useEffect, useState} from "react";
import { ModalTypes } from "~/core/models";
import type {User} from "~/core/models";
import {checkAuth, getMessage, getUser} from "~/core/utils";

export default function StaffLayout(){
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(ModalTypes.Login);
    const [user, setUser] = useState<User>();
    const [isAuth, setIsAuth] = useState(false);
    const allowedRoles: string[] = ["ADMIN", "USER"];
    const navigate = useNavigate();

    useEffect(() => {
        setIsAuth(checkAuth())
        let userApi = getUser()
        if (userApi !== null) {
            setUser(userApi)
            if (!allowedRoles.includes(userApi.role)) { navigate("/login") }
        }
        else navigate("/")
    }, [allowedRoles, navigate])

    function handleChangeShowModal(changeState: boolean) {
        setShowModal(changeState);
    }

    function handleChangeModalType(changeState: ModalTypes) {
        setModalType(changeState);
    }

    function handleIsAuth() {
        setIsAuth(checkAuth())
    }

    return (
        <>
            <header>
                <div className="logo">
                    <img src={logo} alt="logo"/>
                    <Link to={"/"} className={"logo"}>Медицинский центр</Link>
                </div>
                <div className="nav-buttons">
                    <div onClick={()=> handleChangeShowModal(true)} className="nav-button back-btn">Запись на прием</div>
                    <div onClick={()=> handleChangeShowModal(true)} className={`userName nav-button`}>Вход</div>
                    <ModalLogin showModal={showModal} handleShowModal={handleChangeShowModal} modalType={modalType} handleModelType={handleChangeModalType} isAuth={isAuth} handleIsAuth={handleIsAuth}/>
                </div>
            </header>
            <Outlet/>
            <footer>
                <p>Адрес: ул. Медицинская, 3</p>
                <p>Телефон регистратуры: +7(343)777-88-66</p>
                <a href={"mailto:4musketeer.registry@yandex.ru"}>Электронная почта: 4musketeer.registry@yandex.ru</a>
            </footer>
        </>
    )
}