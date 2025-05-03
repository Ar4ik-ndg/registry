import "./auth-page.css"
import logo from "~/assets/logo.png";
import {Link, Outlet, useNavigate} from "react-router";
import { useEffect, useState } from "react";
import { ModalLogin } from "~/components/modal-login/modal-login";
import MainPage from "~/pages/main-page/main-page"
import { ModalTypes } from "~/core/models";
import { checkAuth } from "~/core/utils";

export default function AuthPage() {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(ModalTypes.Login);
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsAuth(checkAuth())
        if (checkAuth()) navigate("/");
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

    if (!isAuth) {
        return (
            <>
                <header>
                    <div className="logo">
                        <img src={logo} alt="logo"/>
                        <Link to={"/"} className={"logo"}>Медицинский центр</Link>
                    </div>
                    <div className="nav-buttons">
                        <div onClick={() => handleChangeShowModal(true)}
                             className="nav-button back-btn">Запись на прием
                        </div>
                        <div onClick={() => handleChangeShowModal(true)}
                             className={`userName nav-button`}>Вход
                        </div>
                        <ModalLogin showModal={showModal} handleShowModal={handleChangeShowModal}
                                    modalType={modalType} handleModelType={handleChangeModalType}
                                    isAuth={isAuth} handleIsAuth={handleIsAuth}/>
                    </div>
                </header>
                <MainPage />
                <footer>
                    <p>Адрес: ул. Медицинская, 3</p>
                    <p>Телефон регистратуры: +7(343)777-88-66</p>
                    <a href={"mailto:4musketeer.registry@yandex.ru"}>Электронная почта:
                        4musketeer.registry@yandex.ru</a>
                </footer>
            </>
        )
    }
}