import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import {ModalOrder} from "~/components/modal-order/modal-order";
import {useState} from 'react'

export function Welcome() {

  const [showModal, setShowModal] = useState(false)

  function handleChangeShowModal(changeState:any) {
      setShowModal(changeState)
  }


  return (
    <div>
      {/* вызов анонимной функции чтобы изменить состояние хука */}
      <div onClick={()=>handleChangeShowModal(true)}>Тестовое модальное окно</div>
      {/*handleChangeShowModal -> ссылка на функцию setShowModal, особенности реакта*/}
      <ModalOrder showModal={showModal} showModalHandler={handleChangeShowModal} date={"some-date"} status={"завершен"} doctor={"Тестов Тест Тестович"}/>

    </div>
  );
}
