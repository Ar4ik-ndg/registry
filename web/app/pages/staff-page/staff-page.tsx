import "./staff-page.css"
import type { Route } from "./+types/staff-page"
import {Link} from "react-router";

export default function StaffPage() {

    return (
        <>
            <main className="staff-page">
                <div className="left-box">
                    <h1>Регистратура</h1>
                    <Link to="registry" className={"link-button"}>Перейти</Link>
                </div>
                <div className="right-box">
                    <h1>Врач</h1>
                    {/*Переход на ссылку с приемами врача*/}
                    <Link to="registry" className={"link-button"}>Перейти</Link>
                </div>
            </main>
        </>
    )
}