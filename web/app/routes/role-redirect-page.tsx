import { type User} from "~/core/models";
import loading from "~/assets/loading.svg"

import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {getUser} from "~/core/utils";

export default function roleRedirect(){
    const navigate = useNavigate();

    useEffect(() => {
        let userStorage: User | null = getUser();
        if (userStorage !== null){
            switch (userStorage.role){
                case "ADMIN":
                    navigate("/admin");
                    break;
                case "USER":
                    navigate("/main");
                    break;
            }
        }
        else { navigate("/auth"); }
    }, [navigate])

    return (
        <>
            <img src={loading} alt={"Загрузка ..."} className={"loading"}/>
        </>
    )
}