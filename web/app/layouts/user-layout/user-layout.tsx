import "./user-layout.css"

import {Link, Outlet} from "react-router";
import logo from "~/assets/logo.png";
import {ModalAccount} from "~/components/modal-account/modal-account";
import {ModalLogin} from "~/components/modal-login/modal-login";
import {useEffect, useState} from "react";
import { ModalTypes } from "~/core/models";
import type {User} from "~/core/models";
import {checkAuth, getMessage, getUser} from "~/core/utils";

export default function UserLayout(){
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(ModalTypes.Login);
    const [user, setUser] = useState<User>();
    const [isAuth, setIsAuth] = useState(false);
    const [message, setMessage] = useState<string|null>(null);

    useEffect(() => {
        setIsAuth(checkAuth())
        let user = getUser();
        if (user !== null) setUser(user)
    }, [isAuth])

    function handleChangeShowModal(changeState: boolean) {
        setShowModal(changeState);
    }

    function handleChangeModalType(changeState: ModalTypes) {
        setModalType(changeState);
    }

    function handleIsAuth() {
        setIsAuth(checkAuth())
    }

    function handleMessage(msg: string|null) {
        if (msg === null && getMessage()) {
            localStorage.removeItem("message");
        }
        setMessage(msg);
    }

    return (
        <>
            <header>
                <div className="logo">
                    <img src={logo} alt="logo"/>
                    <Link to={"/"} className={"logo"}>Медицинский центр</Link>
                </div>
                <div className="nav-buttons">{(() => {
                    if (isAuth) {
                        return (
                            <>
                                <Link to={`/appointment/${user?.id}/new`} className="nav-button back-btn">Запись на приём</Link>
                                <div onClick={() => handleChangeShowModal(!showModal)}
                                     className={`userName nav-button`}>{user?.fullName}</div>
                                <ModalAccount showModal={showModal} handleShowModal={handleChangeShowModal} isAuth={true} handleIsAuth={handleIsAuth}/>
                            </>
                        )
                    } else {
                        return (
                            <>
                                <div onClick={()=> handleChangeShowModal(true)} className="nav-button back-btn">Запись на прием</div>
                                <div onClick={()=> handleChangeShowModal(true)} className={`userName nav-button`}>Вход</div>
                                <ModalLogin showModal={showModal} handleShowModal={handleChangeShowModal} modalType={modalType} handleModelType={handleChangeModalType} isAuth={isAuth} handleIsAuth={handleIsAuth}/>
                            </>
                        )
                    }
                    })()}
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