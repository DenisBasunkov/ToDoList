import { useContext, useRef, useState } from "react"
import { ToDODataContext } from "./ToDoContext"
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

export const RemoveBoard = ({ id }) => {

    const { setCardList } = useContext(ToDODataContext)

    const removeBoard = () => {
        setCardList((board) => {
            const data = board.filter(item => item.id !== id)
            // sessionStorage.setItem("data", JSON.stringify(data))
            return data
        })
    }

    return <img onClick={removeBoard} src="./Cancel.png" />
}

export const RemoveAll = () => {
    const { setCardList } = useContext(ToDODataContext)
    const removeAll = () => {
        if (confirm("fss")) {
            setCardList([
                {
                    id: uuidv4(), title: "Основной", items: []
                }])
            // sessionStorage.setItem("data", JSON.stringify([
            //     {
            //         id: 1, title: "Основной", items: []
            //     }]))
        }
    }
    return <img onClick={removeAll} className="btn_remove_all" src="./Remove.png" alt="Remove All" />

}

export const RemoveCard = ({ CardID }) => {
    const { setCardList } = useContext(ToDODataContext)

    const removeCard = () => {
        if (confirm("Удалить Задачу?")) {
            setCardList((cardList) => {
                const data = cardList.map((board) => {
                    const newItems = board.items.filter((i) => i.id !== CardID);
                    return { ...board, items: newItems };
                })
                // sessionStorage.setItem("data", JSON.stringify(data))
                return data
            })
        }

    }
    return <img onClick={removeCard} src="./Cancel.png" />

}

export const ChecedCard = ({ CardId, DataStatus }) => {

    const [s, setS] = useState(DataStatus)
    const { setCardList } = useContext(ToDODataContext)

    const checedCard = (CardStatus) => {
        setCardList((cardList) => {
            const data = cardList.map((board) => ({
                ...board,
                items: board.items.map(item =>
                    item.id === CardId ? { ...item, status: CardStatus } : item
                )
            }))
            // sessionStorage.setItem("data", JSON.stringify(data))
            return data
        })
    }

    return <input type="checkbox" onChange={() => { setS(!s), checedCard(!s) }} checked={s} />

}


export const FormAddCard = ({ BoardID, setClose }) => {

    const { setCardList } = useContext(ToDODataContext)


    const AddCardFormRef = useRef(null)
    const addNewCard = (e) => {
        e.preventDefault()
        const dataForm = new FormData(AddCardFormRef.current)

        let date = new Date()

        setCardList((prevCardList) => {
            const data = prevCardList.map((board) => {
                if (board.id === BoardID) {
                    return { ...board, items: [...board.items, { id: uuidv4(), text: dataForm.get("title"), status: false, Description: dataForm.get("text"), dataCreation: date.toLocaleString(), expCompTime: dataForm.get("expCompTime") }] };
                }
                return board;
            });
            // sessionStorage.setItem("data", JSON.stringify(data))
            return data
        })


        setTimeout(() => {
            AddCardFormRef.current.reset()
            setClose(false)
        }, 500);
    }


    return <form className="add_form" onSubmit={addNewCard} ref={AddCardFormRef} style={{ display: "grid", gap: "5px", border: "none", padding: "5px" }}>
        <label htmlFor="" >Название задачи</label>
        <input required type="text" placeholder="Название задачи" name="title" className="input_add" style={{ border: "2px solid #4c81af" }} />
        <label htmlFor="">Описание задачи</label>
        <textarea rows={5}
            required
            placeholder="Описание задачи"
            name="text"
            style={{ border: "2px solid #4c81af", padding: "5px" }}
        ></textarea>

        <input type="date" name="expCompTime" />
        <button type="submit" style={{ border: "2px solid #4c81af" }}>Добавить задачу</button>
    </form>

}

export const FormRenameCard = ({ BoardID, card, setClose }) => {

    const { setCardList } = useContext(ToDODataContext)
    const [valTitle, setValTitle] = useState(card.text || null)
    const [valDescription, setValDescription] = useState(card.Description || null)
    const [ValExpCompTime, setValExpCompTime] = useState(card.expCompTime || null)

    const AddCardFormRef = useRef(null)
    const addNewCard = (e) => {
        e.preventDefault()
        const dataForm = new FormData(AddCardFormRef.current)

        setCardList((prevCardList) => {
            const data = prevCardList.map((board) => {
                if (board.id === BoardID) {
                    return {
                        ...board, items: board.items.map((item) => {
                            if (item.id === card.id) {
                                return { ...item, text: dataForm.get("title"), Description: dataForm.get("text"), expCompTime: dataForm.get("expCompTime") }
                            }
                            return item
                        })
                    }
                }
                return board;
            });
            // sessionStorage.setItem("data", JSON.stringify(data))
            return data
        })


        setTimeout(() => {
            AddCardFormRef.current.reset()
            setClose(false)
        }, 500);
    }


    return <form className="add_form" onSubmit={addNewCard} ref={AddCardFormRef} style={{ display: "grid", gap: "5px", border: "none", padding: "5px" }}>
        <label htmlFor="">Название задачи</label>
        <input required type="text"
            style={{ border: "2px solid #4c81af" }}
            placeholder="Название задачи" name="title" className="input_add" onChange={(e) => setValTitle(e.target.value)} value={valTitle} />
        <label htmlFor="" >Описание задачи</label>
        <textarea rows={5}
            required
            placeholder="Описание задачи"
            name="text"
            onChange={(e) => setValDescription(e.target.value)}
            value={valDescription}
            style={{ border: "2px solid #4c81af", padding: "5px" }}
        ></textarea>
        <label htmlFor="" >Ожидаемое время выполнения</label>
        <input type="date" name="expCompTime" value={ValExpCompTime} onChange={(e) => setValExpCompTime(e.target.value)} />
        <button type="submit" style={{ border: "2px solid #4c81af" }}>Изменить задачу</button>
    </form>

}

export const SearchForm = () => {
    const { setSearchValue, searchValue } = useContext(ToDODataContext)
    return <div style={{ width: "100%", position: "relative" }}>
        <input
            type="text"
            className="input_search"
            placeholder="Поиск"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
        />
        <img className="btn_clear" onClick={() => setSearchValue('')} src="./Clear.png" alt="Clear" />
    </div>

}

export const Auth = ({ open, setOpen }) => {

    const formRef = useRef(null)

    const { UserData, setUserData, setCardList } = useContext(ToDODataContext)

    const Close = () => {
        setOpen(false)
    }

    const fd = async (e) => {
        e.preventDefault()
        const formData = new FormData(formRef.current)
        const { data } = await axios({
            method: "get",
            url: "https://todolistserver-9yzt.onrender.com/api/User",
            params: {
                Login: formData.get("Login"),
                Password: formData.get("Password")
            }
        })
        if (data.status) {
            setUserData(data.dataUSER)
            sessionStorage.setItem("UserData", JSON.stringify(data.dataUSER))
            setCardList(JSON.parse(data.data.TasksData))
            sessionStorage.setItem("data", JSON.stringify(JSON.parse(data.data.TasksData)))
            formRef.current.reset()
            Close()
        }
    }

    return <dialog open={open} style={{
        position: "absolute",
        zIndex: "100",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "hsla(0, 0%, 0%, .4)",

        display: open ? "grid" : "none",
        placeItems: "center"

    }}>
        <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "15px", boxShadow: " 0 0 6px 0 hsla(0, 0%, 0%, .4)" }}>


            <img onClick={Close} src="./Cancel.png" width={20} style={{ cursor: "pointer" }} />
            <form onSubmit={fd} ref={formRef} style={{ display: "grid", gap: "15px", margin: "15px 0px", gridAutoColumns: "250px" }}>
                <input required type="text" name="Login"
                    placeholder="Логин"
                    style={{ border: "2px solid black", width: "100%", padding: "5px 10px", borderRadius: "15px" }} />
                <input required type="password" name="Password"
                    placeholder="Пароль"
                    style={{ border: "2px solid black", width: "100%", padding: "5px 10px", borderRadius: "15px" }}
                />
                <button type="submit"
                    style={{ border: "none", backgroundColor: "transparent", boxShadow: "0 0 6px 0 hsla(0, 0%, 0%, .4)", padding: "5px 10px", borderRadius: "15px", cursor: "pointer" }}
                >Войти</button>
            </form>

        </div>
    </dialog>

}

export const Registr = ({ open, setOpen }) => {

    const formRef = useRef(null)

    const { setCardList, setUserData } = useContext(ToDODataContext)

    const Close = () => {
        setOpen(false)
    }

    const fd = async (e) => {
        e.preventDefault()
        const formData = new FormData(formRef.current)
        const { data } = await axios({
            method: "put",
            url: "https://todolistserver-9yzt.onrender.com/api/User",
            params: {
                Login: formData.get("Login"),
                Password: formData.get("Password"),
                Name: formData.get("Name")
            }
        })
        if (data.status) {
            setUserData(data.dataUSER)
            sessionStorage.setItem("UserData", JSON.stringify(data.dataUSER))
            setCardList(JSON.stringify(JSON.parse(data.data)))
            sessionStorage.setItem("data", JSON.stringify(JSON.parse(data.data)))
            formRef.current.reset()
            Close()
        }
    }

    return <dialog open={open} style={{
        position: "absolute",
        zIndex: "100",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "hsla(0, 0%, 0%, .4)",

        display: open ? "grid" : "none",
        placeItems: "center"

    }}>
        <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "15px", boxShadow: " 0 0 6px 0 hsla(0, 0%, 0%, .4)" }}>


            <img onClick={Close} src="./Cancel.png" width={20} style={{ cursor: "pointer" }} />
            <form onSubmit={fd} ref={formRef} style={{ display: "grid", gap: "15px", margin: "15px 0px", gridAutoColumns: "250px" }}>
                <input required type="text" name="Name"
                    placeholder="Имя"
                    style={{ border: "2px solid black", width: "100%", padding: "5px 10px", borderRadius: "15px" }} />
                <input required type="text" name="Login"
                    placeholder="Логин"
                    style={{ border: "2px solid black", width: "100%", padding: "5px 10px", borderRadius: "15px" }} />
                <input required type="password" name="Password"
                    placeholder="Пароль"
                    style={{ border: "2px solid black", width: "100%", padding: "5px 10px", borderRadius: "15px" }}
                />
                <button type="submit"
                    style={{ border: "none", backgroundColor: "transparent", boxShadow: "0 0 6px 0 hsla(0, 0%, 0%, .4)", padding: "5px 10px", borderRadius: "15px", cursor: "pointer" }}
                >Зарегистрироваться</button>
            </form>

        </div>
    </dialog>

}


export const FormCard = ({ open, setOpen, BoardID, status, Card }) => {

    return <dialog open={open} style={{
        position: "fixed",
        zIndex: "100",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "hsla(0, 0%, 0%, .4)",
        display: open ? "grid" : "none",
        placeItems: "center"

    }}>
        <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "15px", boxShadow: " 0 0 6px 0 hsla(0, 0%, 0%, .4)" }}>
            <img src="./Cancel.png" width={20} onClick={() => setOpen(false)} style={{ cursor: "pointer" }} />

            {
                status == "create" ? <FormAddCard BoardID={BoardID} setClose={setOpen} /> :
                    status == "edit" ? <FormRenameCard BoardID={BoardID} card={Card} setClose={setOpen} /> :
                        <div className="add_form" style={{ display: "grid", gap: "5px", border: "none", padding: "5px" }}>
                            <label htmlFor="">Дата создания: {Card.dataCreation}</label>
                            <label htmlFor="" >Название задачи</label>
                            <input readOnly value={Card.text} type="text" placeholder="Название задачи" name="title" className="input_add" style={{ border: "2px solid #4c81af" }} />
                            <label htmlFor="">Описание задачи</label>
                            <textarea rows={5}
                                readOnly
                                placeholder="Описание задачи"
                                name="text"
                                style={{ border: "2px solid #4c81af", padding: "5px" }}
                            >{Card.Description}</textarea>
                            <label htmlFor="">Ожидаемое время выполнение: {Card.expCompTime}</label>
                        </div>
            }

        </div>
    </dialog>

}


export const FormBoard = ({ open, setOpen, status, Board }) => {

    const formRef = useRef(null)
    const { setCardList } = useContext(ToDODataContext)
    const [BoardValue, setBoardValue] = useState(Board ? Board.title : null)

    const Close = () => {
        formRef.current.reset()
        setOpen(false)
    }

    const fd = async (e) => {
        e.preventDefault()
        const formData = new FormData(formRef.current)
        switch (status) {
            case "create":
                setCardList((PrevItem) => ([...PrevItem, { id: uuidv4(), title: formData.get("Title"), items: [] }]))
                break;
            case "rename":
                setCardList((PrevItem) => PrevItem.map((item) => {
                    if (item.id == Board.id) {
                        return { ...item, title: formData.get("Title") }
                    }
                    return item
                }))
                break;
            default:
                break;
        }

        formRef.current.reset()
        Close()
    }

    return <dialog open={open} style={{
        position: "fixed",
        zIndex: "100",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "hsla(0, 0%, 0%, .4)",

        display: open ? "grid" : "none",
        placeItems: "center"

    }}>
        <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "15px", boxShadow: " 0 0 6px 0 hsla(0, 0%, 0%, .4)" }}>
            <img src="./Cancel.png" width={20} onClick={() => setOpen(false)} style={{ cursor: "pointer" }} />
            <form onSubmit={fd} ref={formRef} style={{ display: "grid", gap: "15px", margin: "15px 0px", gridAutoColumns: "250px" }}>
                <input required type="text" name="Title"
                    placeholder="Название Списка"
                    onChange={(e) => setBoardValue(e.target.value)}
                    value={status != "create" ? BoardValue : null}
                    style={{ border: "2px solid black", width: "100%", padding: "5px 10px", borderRadius: "15px" }} />

                <button
                    type="submit"
                    style={{ border: "none", backgroundColor: "transparent", boxShadow: "0 0 6px 0 hsla(0, 0%, 0%, .4)", padding: "5px 10px", borderRadius: "15px", cursor: "pointer" }}
                >{status == "create" ? "Добавить список" : "Изменить список"}</button>
            </form>


        </div>
    </dialog>

}