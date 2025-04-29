import "./create-appointment-page.css"
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from "react-datepicker"
import {format, addDays, set} from "date-fns";
import { ru } from "date-fns/locale";
import type { Route } from "./+types/create-appointment-page"
import {useEffect, useState} from "react";
import {Link} from "react-router";

export default function CreateAppointmentPage({params}: Route.ComponentProps) {
    const [showDocs, setShowDocs] = useState(false)
    const [showDescriptionAndDate, setShowDescriptionAndDate] = useState(false)
    const [showButton, setShowButton] = useState(false)
    const [prof, setProf] = useState("")
    const [doctor, setDoctor] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState<Date| null>(null)
    const [busyTime, setBusyTime] = useState<string[]>([])

    function handleChangeProf(e: string) {
        setProf(e)
        setShowDocs(true)
        setShowDescriptionAndDate(false)
    }

    function handleChangeDoctor(e: string) {
        setDoctor(e)
        setShowDescriptionAndDate(true)
    }

    function handleChangeDescription(e: any) {
        setDescription(e.target.value)
        if (description !== "" && description !== null && date !== null) { setShowButton(true) }
    }

    function handleChangeDate(e: any) {
        setDate(e)
        if (description !== "" && description !== null && date !== null) { setShowButton(true) }
    }

    function handleSubmit() {

    }

    useEffect(() => {
        //тут надо получение занятого времени GET http://localhost:8080/api/v0.1/user/tikets/busy/{date}
        setBusyTime([
            "30.04.2025 08:30",
            "01.05.2025 08:00",
        ])
    }, [])

    function formatDate(date: Date) {
        return format(date, "dd.MM.yyyy HH:mm")
    }

    const filterTime = (time: Date) =>  {
        const formattedDate = formatDate(time)
        return !busyTime.includes(formattedDate)
    }

    return (
        <main className={"create-appointment-page"}>
            <h1>Запись к специалисту</h1>
            <div className={"tiket-creator-box"}>
                <div className="prof">
                    <h3>Выбор специальности</h3>
                    <ul className={"list"}>
                        {/*тут список специальностей врачей GET http://localhost:8080/api/v0.1/user/med/profs
                           пример:*/}
                        <li className={"line"} onClick={() => handleChangeProf("Терапевт")}>Терапевт</li>
                        <li className={"line"} onClick={() => handleChangeProf("Тест")}>Тест</li>
                        <li className={"line"} onClick={() => handleChangeProf("Тест")}>Тест</li>
                        <li className={"line"} onClick={() => handleChangeProf("Тест")}>Тест</li>
                    </ul>
                </div>
                <div className={`doctor${showDocs ? " open" : ""}`}>
                    <h3>Выбор врача</h3>
                    <ul className={"list"}>
                        {/*тут список врачей данной специальности GET http://localhost:8080/api/v0.1/user/med/<profession>
                           пример:*/}
                        <li className={"line"} onClick={() => handleChangeDoctor("Тест")}>Тест</li>
                    </ul>
                </div>
                <div className={`content-container${showDescriptionAndDate ? " open" : ""}`}>
                    <div className="description">
                        <h3>Ввод жалобы</h3>
                        <textarea required={true} value={description} onChange={handleChangeDescription}
                                  name="description" autoComplete={"off"} placeholder={"Введите жалобу"}/>
                    </div>
                    <div className={"date-container"}>
                        <h3>Выбор даты</h3>
                        <DatePicker
                            selected={date}
                            onChange={handleChangeDate}
                            locale={ru}
                            showTimeSelect
                            timeIntervals={15}
                            filterTime={filterTime}
                            minDate={addDays(new Date(), 1)}
                            maxDate={addDays(new Date(), 8)}
                            minTime={date
                                ? set(date.getTime(), {hours: 8, minutes: 0, seconds: 0, milliseconds: 0})
                                : set(addDays(new Date(), 1).getTime(), {
                                    hours: 8,
                                    minutes: 0,
                                    seconds: 0,
                                    milliseconds: 0
                                })}
                            maxTime={date
                                ? set(date, {hours: 16, minutes: 0, seconds: 0, milliseconds: 0})
                                : set(addDays(new Date(), 1), {hours: 16, minutes: 0, seconds: 0, milliseconds: 0})}
                            dateFormat="dd.MM.yyyy HH:mm"
                            timeFormat="HH:mm"
                            timeCaption="Время"
                            inline/>
                    </div>
                </div>
                <Link to={"/"} className={`confirm-button${showButton? " open" : ""}`} onClick={handleSubmit}>Подтвердить</Link>
            </div>
        </main>
    )
}