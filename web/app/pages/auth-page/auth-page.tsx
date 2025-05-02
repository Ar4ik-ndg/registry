import "./auth-page.css"
import logo from "~/assets/logo.png";
import {Link, Outlet, useNavigate} from "react-router";
import { useEffect, useState } from "react";
import { ModalLogin } from "~/components/modal-login/modal-login";
import { ModalTypes } from "~/core/models";
import { checkAuth } from "~/core/utils";

export default function AuthPage() {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(ModalTypes.Login);
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsAuth(checkAuth())
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
        debugger
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
                <main className="main-page">
                    <div className="left-box">
                        <h1>Наши преимущества</h1>
                        <ul>
                            <li>Полный перечень работающих специалистов с возможностью записи на приём на удобное для
                                Вас время
                            </li>
                            <li>Возможность оценить приём или перенести его на другое время</li>
                            <li>Отслеживание статуса приёма в реальном времени в личном кабинете: отклонён, принят на
                                запись или уже пройден
                            </li>
                            <li>История приёмов с их результатами и комментариями от специалиста в личном кабинете</li>
                            <li>Минимум информации для регистрации личного кабинета</li>
                            <li>Быстрая и удобная запись на приём в реальном времени</li>
                        </ul>
                    </div>

                    <div className="right-box">
                        <h1>О нас</h1>
                        <p>Во время основания нашего медицинского центра было решено, что традиционный формат
                            регистратуры с бумагами и очередями в современном мире с его стремительными темпами жизни
                            уже утратил актуальность. У людей зачастую нет времени на это, в связи с чем забота о себе
                            раз за разом откладывается на следующую неделю. Мы беспокоимся о здоровье поколений, поэтому
                            стараемся облегчить заботу о нём, ведь это - самое главное. В этих целях была разработана
                            онлайн-регистратура, на главной странице которой Вы сейчас находитесь. Здесь вы сможете
                            ознакомиться со списком специалистов нашего центра и запланировать приём у одного или
                            нескольких из них. Благодаря продуманной системе это не опимет у Вас много времени: для
                            регистрации понадобится вести данные лишь нескольких основных документов, а для записи на
                            приём - просто перейти на соответствующую страницу сайта. И будьте здоровы!</p>
                    </div>
                </main>
                <footer>
                    <p>Адрес: ул. Медицинская, 3</p>
                    <p>Телефон регистратуры: +7(343)777-88-66</p>
                    <a href={"mailto:4musketeer.registry@yandex.ru"}>Электронная почта:
                        4musketeer.registry@yandex.ru</a>
                </footer>
            </>
        )
    }
    else {
        navigate("/")
        return (<></>)
    }
}