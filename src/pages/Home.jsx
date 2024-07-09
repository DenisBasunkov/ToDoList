import { createRef, useContext, useRef, useState } from "react";
import "./Home.scss";
import { CardItem } from "../components/Card_Item/CardItem";
import { useDrop } from "react-dnd";
import { ToDODataContext } from "../Script/ToDoContext";
import { Auth, FormAddCard, FormBoard, FormCard, Registr, RemoveAll, RemoveBoard, SearchForm } from "../Script/DataCommand";

export const Home = () => {
    const { setCardList, cardList, UserData, setUserData, isSave } = useContext(ToDODataContext)

    const [isOpenFormBoard, setIsOpenFormBoard] = useState(false)
    const [isOpenFormAuth, setIsOpenFormAuth] = useState(false)
    const [isOpenFormRegister, setIsOpenFormRegister] = useState(false)
    const [FormBoardStatus, setFormBoardStatus] = useState("create");

    const readBoard = (BoardId, NewTitle) => {
        setCardList(cardList.map((board) => ({
            ...board,
            title: board.id === BoardId ? NewTitle : board.title
        })
        ))
    }

    const exit = () => {
        setUserData({});
        setCardList([])
        sessionStorage.removeItem("UserData")
        sessionStorage.removeItem("data")
    }

    return (
        <>
            <header className="header_nav">

                {
                    Object.keys(UserData).length == 0 ? null :
                        <div style={{ display: "grid", gridTemplateRows: "auto auto", gap: "5px", textAlign: "center" }}>
                            <h2>{UserData.Name}</h2>
                            <button className="btn" onClick={exit}>выйти</button>
                        </div>
                }

            </header>
            <main className="main_container">

                {
                    Object.keys(UserData).length == 0 ? <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "25px", marginTop: "25px" }}>
                        <button className="btn" onClick={() => setIsOpenFormAuth(true)}>Вход</button>
                        <button className="btn" onClick={() => setIsOpenFormRegister(true)}>Регистрация</button>
                    </div> :
                        <>
                            <div style={{ display: "flex", gap: "15px", alignItems: "center", marginTop: "15px", borderBottom: "3px solid #4c81af", padding: "5px 5px 10px" }}>
                                <RemoveAll />
                                <SearchForm />
                            </div>
                            <nav style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
                                {/* <button className="btn_add" onClick={() => { setIsOpenFormBoard(true); setFormBoardStatus("create") }}>
                                    <img src="./Add.png" alt="Add" />
                                </button> */}
                                {/* <div>
                                    <FormAddCard BoardID={1} />
                                </div> */}
                            </nav>
                            {cardList.map((board) => (
                                <Board setCardList={setCardList} readBoard={readBoard} setFormBoardStatus={setFormBoardStatus} setIsOpenFormBoard={setIsOpenFormBoard} key={board.id} board={board} />
                            ))
                            }
                            <button className="btn_add_board" onClick={() => { setIsOpenFormBoard(true); setFormBoardStatus("create") }}>Добавить список задач</button>
                        </>

                }


            </main>

            <footer className="footerContainer"></footer>

            <Auth open={isOpenFormAuth} setOpen={setIsOpenFormAuth} />
            <Registr open={isOpenFormRegister} setOpen={setIsOpenFormRegister} />

            <FormBoard open={isOpenFormBoard} setOpen={setIsOpenFormBoard} status={FormBoardStatus} />
        </>
    );
};

const Board = ({ board, setBoardTitle }) => {

    const { setCardList, searchValue, DnDBetweenBoard } = useContext(ToDODataContext)

    const [isOpen, setIsOpen] = useState(false)
    const [isOpenBoardForm, setIsOpenBoardForm] = useState(false)
    const [statusCard, setStatusCard] = useState("create")

    const [{ isOver }, dropBoardRef] = useDrop({
        accept: "Card",
        drop(item) {
            DnDBetweenBoard(item.data, board);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })

    });




    return (
        <div ref={dropBoardRef} style={{ boxShadow: "0 0 6px 0 hsla(0,0%,0%,.3)", padding: "5px 10px", borderRadius: "15px", }
        } >

            <div className="Board_Title"  >

                <h2>{board.title} </h2>
                {/* {
                            board.title !== "Основной" ? <><input type="text" onChange={(e) => setTitle(e.target.value)} value={title} />border: isOver ? "2px dotted red" : "none" 
                            <button onClick={() => readBoard(board.id, title)}>d</button></> : null
                            } */}

                {
                    board.title !== "Основной" ?
                        <div className="Board_nav">
                            <img src="./Add.png" onClick={() => { setIsOpen(true); setStatusCard("create") }} />
                            <img onClick={() => { setIsOpenBoardForm(true) }} src="./Edit.png" />
                            <RemoveBoard id={board.id} />
                        </div>
                        : <div className="Board_nav">
                            <img src="./Add.png" onClick={() => setIsOpen(true)} />
                        </div>
                }
            </div>

            <details>
                <summary>
                    Задачи ({board.items.filter(item => {
                        return item.text.toString().includes(searchValue)
                    }).length})
                </summary>
                {/* <div>
                    <FormAddCard BoardID={board.id} />
                </div> */}
                <div style={{ display: "grid", gridTemplateRows: "55px", gap: "15px", padding: "5px 15px" }}>
                    {board.items.filter(item => {
                        return item.text.toString().includes(searchValue)
                    }).map((item) => (
                        <CardItem BoardID={board.id} key={item.id} data={item} />
                    ))}
                </div>
            </details>

            <FormCard open={isOpen} setOpen={setIsOpen} BoardID={board.id} status={statusCard} />
            <FormBoard open={isOpenBoardForm} setOpen={setIsOpenBoardForm} status={"rename"} Board={board} />
        </div >



    );
};