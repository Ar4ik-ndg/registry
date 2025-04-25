// импортируем css
import './modal-appointment.css'

type ModalOrderProps = {
    showModal: boolean
    showModalHandler: any //function (doChangeStateOfModal:bool) => void
    date: string
    status: string
    doctor: any // TODO: заменить на тип из domain/models
}

// ModalOrder - Модальное окно записи
export function ModalOrder(props:ModalOrderProps){
    // React mojet vernut' tolko 1 result from function
    if (props.showModal){
        return (
            <>
                {/*используем css*/}
                <div className={"red"}>
                    {/* вызов хука через анонимную функцию т.к это ссылка*/}
                    <span onClick={()=>props.showModalHandler(false)}>Закрыть</span>
                    Приём <h1>{props.date}</h1>
                    <p>Статус: {props.status}</p>
                    <p>Специалист: {props.doctor}</p>
                </div>
            </>
        )
    }else{
        return (
            <></>
        )
    }
}
