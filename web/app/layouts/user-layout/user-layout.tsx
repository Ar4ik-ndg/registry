import "./user-layout.css"
import logo from "~/assets/logo.png";

import {Link, Outlet, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {ModalAccount} from "~/components/modal-account/modal-account";
import {ModalLogin} from "~/components/modal-login/modal-login";
import { ModalTypes } from "~/core/models";
import type {User} from "~/core/models";
import {checkAuth, getMessage, getUser} from "~/core/utils";

export default function UserLayout() {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(ModalTypes.Login);
    const [user, setUser] = useState<User|null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const [message, setMessage] = useState<string|null>(null);
    const navigate = useNavigate();
    const allowedRoles: string[] = ["ADMIN", "USER"];

    useEffect(() => {
        debugger
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

    debugger
    if (isAuth) {
        return (
            <>
                <header>
                    <div className="logo">
                        <img src={logo} alt="logo"/>
                        <Link to={"/"} className={"logo"}>Медицинский центр</Link>
                    </div>
                    <div className="nav-buttons">
                        <Link to={`/appointment/${user?.id}/new`} className="nav-button back-btn">Запись на приём</Link>
                        <div onClick={() => handleChangeShowModal(!showModal)}
                             className={`userName nav-button`}>{user?.fullName}</div>
                        <ModalAccount showModal={showModal} handleShowModal={handleChangeShowModal} isAuth={true} handleIsAuth={handleIsAuth}/>
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
    else {
        navigate("/")
    }
}