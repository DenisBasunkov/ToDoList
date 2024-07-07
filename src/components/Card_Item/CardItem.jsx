import { useState } from "react"
import stiles from "./CardItem.module.scss"
import { useDrag } from "react-dnd"
import { FormCard } from "../FormCard/FormCard"


export const CardItem = ({ data, dropCard, checedCard, BoardID, setCardList }) => {

    const [s, setS] = useState(data.status)
    const [isOpen, setIsOpen] = useState(false)

    const [{ isDragging }, dragRef] = useDrag({
        type: "Card",
        item: { data: data, boardID: BoardID },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const dropItem = () => {
        if (confirm("Удалить Задачу?")) {
            dropCard(data.id)
        }
    }

    return <div className={stiles.CardItem} ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <img src="./Menu.png" width={25} style={{ cursor: "grab" }} />
        <div>

            <label className={stiles.custom_checkbox}>
                <input type="checkbox" onChange={() => { setS(!s), checedCard(data.id, !s) }} checked={s} />
                <span className={stiles.checkmark}></span>
            </label>
        </div>
        <h3>{data.text}</h3>
        <div className={stiles.btn_nav}>
            <img src="./Eye.png" />
            <img src="./Edit.png" onClick={() => setIsOpen(true)} />
            <img onClick={dropItem} src="./Cancel.png" />
        </div>

    </div>


}