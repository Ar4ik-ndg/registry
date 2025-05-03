import "./admin-layout.css"

import {Link, Navigate, Outlet, useNavigate} from "react-router";
import logo from "~/assets/logo.png";
import {ModalAccount} from "~/components/modal-account/modal-account";
import {useEffect, useState} from "react";
import type {User} from "~/core/models";
import {checkAuth, getMessage, getUser, logout} from "~/core/utils";
import {ModalRegisterStaff} from "~/components/modal-register-staff/modal-register-staff";

export default function AdminLayout(){
    const [showModalAccount, setShowModalAccount] = useState(false);
    const [showModalRegisterStaff, setShowModalRegisterStaff] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const allowedRoles: string[] = ["ADMIN"];
    const navigate = useNavigate();

    useEffect(() => {
        let userStorage = getUser()
        let auth = checkAuth()

        if (!auth || userStorage === null ) {
            logout();
            setIsAuth(false);
            navigate("/auth");
        } else {
            setIsAuth(true);
            setUser(userStorage);
        }

    }, []);

    function handleChangeShowModalAccount(changeState: boolean) {
        setShowModalAccount(changeState);
    }

    function handleChangeShowModalRegisterStaff(changeState: boolean) {
        setShowModalRegisterStaff(changeState);
    }

    function handleIsAuth() {
        setIsAuth(checkAuth())
    }

    if (isAuth === null) return (<></>)

    if(!isAuth || !user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <header>
                <div className="logo">
                    <img src={logo} alt="logo"/>
                    <Link to={"/admin"} className={"logo"}>Медицинский центр</Link>
                </div>
                <div className="nav-buttons">
                    <div className={"nav-button back-btn"} onClick={()=>handleChangeShowModalRegisterStaff(true)}>Добавить нового сотрудника</div>
                    <ModalRegisterStaff handleShowModal={handleChangeShowModalRegisterStaff} showModal={showModalRegisterStaff}/>
                    <div onClick={() => handleChangeShowModalAccount(!showModalAccount)}
                         className={`userName nav-button`}>{user?.fullName}</div>
                    {/*надо заменить на ссылку на страницу с приемами врача*/}
                    <ModalAccount showModal={showModalAccount} handleShowModal={handleChangeShowModalAccount} isAuth={true}
                                  handleIsAuth={handleIsAuth}/>
                </div>
            </header>
            <Outlet/>
            <footer>
                <p>Адрес: ул. Медицинская, 3</p>
                <p>Телефон регистратуры: +7(343)777-88-66</p>
                <a href={"mailto:4musketeer.registry@yandex.ru"}>Электронная почта:
                    4musketeer.registry@yandex.ru</a>
            </footer>
        </>
    )
}