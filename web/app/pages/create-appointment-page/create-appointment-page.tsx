import "./create-appointment-page.css"
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from "react-datepicker"
import {format, addDays, set} from "date-fns";
import { ru } from "date-fns/locale";
import type { Route } from "./+types/create-appointment-page"
import { useEffect, useState } from "react";
import {Link, Navigate, useLoaderData, useNavigate} from "react-router";
import type {Staff, Ticket, User} from "~/core/models";
import {
    createTicket,
    formatDate,
    formatDateWithoutTime,
    getBusyTime,
    getDoctorList,
    getProfs,
    getUser
} from "~/core/utils";
import {ModalMessageBox} from "~/components/modal-message-box/modal-message-box";

export default function CreateAppointmentPage({params}: Route.ComponentProps) {
    const [showDocs, setShowDocs] = useState(false)
    const [showDescriptionAndDate, setShowDescriptionAndDate] = useState(false)
    const [showButton, setShowButton] = useState(false)
    const [prof, setProf] = useState("")
    const [doctor, setDoctor] = useState("")
    const [doctorsList, setDoctorsList] = useState<Array<Staff>>()
    const [description, setDescription] = useState("")
    const [date, setDate] = useState<Date| null>(null)
    const [busyTime, setBusyTime] = useState<string[]>([])
    const [isProfsSuccess, setIsProfsSuccess] = useState<boolean>()
    const [profs, setProfs] = useState<Array<string>>()
    const [showMessageBox, setShowMessageBox] = useState<boolean>(false)
    const [message,setMessage] = useState<string>("")
    const [ticket,setTicket] = useState<Ticket>()
    const [isSuccessSubmit, setIsSuccessSubmit] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null)
    const navigate = useNavigate()

    function handleSetShowButton(u: boolean) {
        setShowButton(u)
    }

    function handleSetUser(u:any){
        setUser(u)
    }

    function handleSetProfs(l:any){
        setProfs(l)
    }

    function handleIsProfsSuccess(l:any){
        setIsProfsSuccess(l)
    }

    function handleDoctorsList (l:any){
        setDoctorsList(l)
    }

    function handleChangeProf(e: string) {
        setProf(e)
        getDoctorList(e, setShowDocs, handleDoctorsList)
        setShowDescriptionAndDate(false)
    }

    function handleChangeDoctor(e: string) {
        setDoctor(e)
        setDate(null)
        setDescription("")
        setShowDescriptionAndDate(true)
    }

    function handleChangeDescription(e: any) {
        if (e == "") { setDescription("") }
        filterTime(date!!)
        if (e.target.value !== "" && date !== null && filterTime(date)) { handleSetShowButton(true) } else { handleSetShowButton(false) }
        setDescription(e.target.value)
    }

    const [isSuccessChangeDate, setIsSuccessChangeDate] = useState<boolean>()

    function handleIsSuccessChangeDate(e:any){
        setIsSuccessChangeDate(e)
    }

    function handleBusyDate(e:any){
        setBusyTime(e)
    }

    function handleChangeDate(e: any) {
        if (e == null) {setDate(e)}
        else {
            setDate(e)
            getBusyTime({
                date: formatDateWithoutTime(e),
                doctor: doctor
            }, handleIsSuccessChangeDate, (bTime: any)=>{
                const f = formatDate(e)
                handleBusyDate(bTime)
                if (e !== null && !bTime.includes(f) && description !=="") { handleSetShowButton(true) } else { handleSetShowButton(false) }
            })
        }
    }

    function handleSetMessage(e:any){
        setMessage(e)
    }

    function handleIsSuccessSubmit(e:any){
        setIsSuccessSubmit(e)
    }

    function handleSetShowMessageBox(e:any){
        setShowMessageBox(e)
        if (e == false){
            debugger
            if (isSuccessSubmit) { navigate(`/account/${user?.id}`) }
            if (!isSuccessSubmit){
                handleChangeDate(null)
                handleSetShowButton(false)
            }
        }
    }

    function handleSetTicket(e:any){
        setTicket(e)
    }

    function handleSubmit() {
        // создание тикета POST http://localhost:8080/api/v0.1/user/tickets/new
        createTicket({
            results: null,
            status: null,
            date: formatDate(date!!) ?? "",
            description: description,
            doctor: doctor,
            user: {
                email: user?.email ?? null,
                birthday: user?.birthday ?? null,
                fullName: user?.fullName ?? null,
                medPolicy: user?.medPolicy ?? null,
                passport: user?.passport ?? null,
                phone: user?.phone ?? null,
                snils: user?.snils ?? null,
                role: user?.role ?? null,
            }
        }, handleIsSuccessSubmit, handleSetTicket, handleSetMessage)
        handleSetShowMessageBox(true)
    }

    useEffect(() => {
        handleSetUser(getUser())
        getProfs(handleIsProfsSuccess,handleSetProfs)
    }, [])

    const filterTime = (time: Date) =>  {
        const formattedDate = formatDate(time)
        return !busyTime.includes(formattedDate)
    }

    return (
        <main className={"create-appointment-page"}>
            <ModalMessageBox showModal={showMessageBox} handleShowModal={handleSetShowMessageBox} message={message} handleMessage={handleSetMessage}/>
            <h1>Запись к специалисту</h1>
            <div className={"ticket-creator-box"}>
                <div className="prof">
                    <h3>Выбор специальности</h3>
                    <ul className={"list"}>
                        {profs?.map((prof) => {
                            if (prof !== null && prof !=="") {
                                return (<li className={"line"} onClick={() => handleChangeProf(prof)}>{prof}</li>)
                            }
                        })}
                    </ul>
                </div>
                <div className={`doctor${showDocs ? " open" : ""}`}>
                    <h3>Выбор врача</h3>
                    <ul className={"list"}>
                        {doctorsList?.map((doctor:Staff) =>{
                            return (<li className={"line"} onClick={() => handleChangeDoctor(doctor.id)}>{doctor.fullName}</li>)
                        })}
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
                <div className={`confirm-appointment-button${showButton? " open" : ""}`} onClick={handleSubmit}>Подтвердить</div>
            </div>
        </main>
    )
}