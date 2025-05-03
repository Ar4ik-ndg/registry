import "./modal-message-box.css"

type ModalMessageBoxProps = {
    showModal: boolean;
    handleShowModal: any;
    message: string|null;
    handleMessage: any;
}

export function ModalMessageBox(props: ModalMessageBoxProps) {
    if (props.message) {
        return (
            <>
                <div className={`blackout-message ${props.showModal ? "open" : ""}`}>
                    <div className={"message-box"}>
                        <p className={"message"}>{props.message}</p>
                        <div className={"close-message"} onClick={() => {
                            props.handleShowModal(false)
                            props.handleMessage()
                        }}>закрыть</div>
                    </div>
                </div>
            </>
        )
    }
}