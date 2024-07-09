import { useContext, useRef, useState } from "react"
import stiles from "./CardItem.module.scss"
import { useDrag, useDrop } from "react-dnd"
import { ChecedCard, FormCard, RemoveCard } from "../../Script/DataCommand"
import { ToDODataContext } from "../../Script/ToDoContext"


export const CardItem = ({ data, BoardID }) => {

    const { setCardList } = useContext(ToDODataContext)
    const [isOpen, setIsOpen] = useState(false)
    const [statusCard, setStatusCard] = useState("create")
    const ref = useRef(null);

    const [{ isDragging }, dragRef] = useDrag({
        type: "Card",
        item: { data: data, boardID: BoardID },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: 'Card',
        collect: (monitor) => ({
            isOver: monitor.isOver()
        }),
        drop(draggedItem) {

            if (draggedItem.data.id !== data.id) {
                setCardList((prevItems) => {
                    const newCardList = [...prevItems];
                    const currentBoard = newCardList.find((board) => board.id === BoardID);
                    const draggedIndex = currentBoard.items.findIndex(item => item.id === draggedItem.data.id);
                    const hoverIndex = currentBoard.items.findIndex(item => item.id === data.id);
                    if (draggedIndex !== hoverIndex) {
                        const updatedItems = [...currentBoard.items];
                        const [draggedItem] = updatedItems.splice(draggedIndex, 1);
                        updatedItems.splice(hoverIndex, 0, draggedItem);
                        const updatedBoard = {
                            ...currentBoard,
                            items: updatedItems,
                        };

                        return newCardList.map((board) =>
                            board.id === BoardID ? updatedBoard : board
                        );
                    }

                    return newCardList;
                });
            }
        },
    });


    dragRef(drop(ref));

    const date = new Date()

    const isActive = date < new Date(data.expCompTime)

    return <div className={stiles.CardItem} ref={ref} style={{ border: isOver ? "1px dashed gray" : "none", opacity: isDragging ? ".5" : "1" }}>
        <img src="./Menu.png" width={25} style={{ cursor: "grab" }} />
        <div>

            <label className={stiles.custom_checkbox}>
                <ChecedCard CardId={data.id} DataStatus={data.status} />
                <span className={stiles.checkmark}></span>
            </label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <h3>{data.text} </h3>
            <p style={{ fontWeight: "800", color: isActive ? "green" : "red" }}>({isActive ? "Активка" : "Просрочена"})</p>
        </div>
        <div className={stiles.btn_nav}>
            <img src="./Eye.png" onClick={() => { setIsOpen(true); setStatusCard("view") }} />
            <img src="./Edit.png" onClick={() => { setIsOpen(true); setStatusCard("edit") }} />
            <RemoveCard CardID={data.id} />
        </div>

        <FormCard open={isOpen} setOpen={setIsOpen} BoardID={BoardID} status={statusCard} Card={data} />

    </div>


}