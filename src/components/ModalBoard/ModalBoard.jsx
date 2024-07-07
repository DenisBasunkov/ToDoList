import { useRef, useState } from "react"
import styles from "./ModalBoard.module.scss"

export const ModalBoard = ({ isOpen, setIsOpen, setCardList, cardList, status, board, readBoard }) => {


    // const [title, setTitle] = useState('')

    const addBoardRef = useRef(null)
    const createBoard = (e) => {
        e.preventDefault()
        const data = new FormData(addBoardRef.current)
        switch (status) {
            case "create":
                setCardList([...cardList, { id: (cardList.length + 1), title: data.get("title"), items: [] }])
                break;
            case "rename":
                readBoard(board.id, data.get("title"))
                break;
            default:
                break;
        }

        addBoardRef.current.reset()
        close()
    }
    const close = () => {
        setIsOpen(false)
    }

    return <dialog open={isOpen} className={isOpen ? styles.Modal_container : null}>

        <div className={styles.form_container}>
            <img onClick={close} src="./Cancel.png" alt="" style={{ width: "30px", cursor: "pointer" }} />
            {
                status == "create" ? <form className="add_form" onSubmit={createBoard} ref={addBoardRef}>
                    <input required type="text" name="title" className="input_add" />
                    <button>Добавить список задач</button>
                </form> :
                    <form className="add_form" onSubmit={createBoard} ref={addBoardRef}>
                        <input required type="text" name="title" className="input_add" placeholder={board !== null ? board.title : ''} />
                        <button>Изменить название списка</button>
                    </form>
            }

        </div>

    </dialog>

}