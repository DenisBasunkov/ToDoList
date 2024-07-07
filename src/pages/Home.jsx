import { useRef, useState } from "react";
import "./Home.scss";
import { CardItem } from "../components/Card_Item/CardItem";
import { useDrop } from "react-dnd";
import { ModalBoard } from "../components/ModalBoard/ModalBoard";
import { v4 as uuidv4 } from 'uuid';
import { FormCard } from "../components/FormCard/FormCard";

export const Home = () => {
    const [searchValue, setSearchValue] = useState('');
    const [cardList, setCardList] = useState([
        {
            id: 1, title: "Основной", items: [
                { id: 1, text: "Name #1", status: true, },
                { id: 2, text: "Game #2", status: false, },
                { id: 3, text: "Game #3", status: false, },
                { id: 4, text: "Name #4", status: false, },
                { id: 5, text: "Name #5", status: true, },
                { id: 6, text: "Name #6", status: false, },
                { id: 7, text: "Name #7", status: false, },
                { id: 8, text: "Name #8", status: false, },
                { id: 9, text: "Name #9", status: true, },
            ]
        },
        {
            id: 2, title: "Игры", items: [
                { id: 10, text: "Game #10", status: false, },
                { id: 11, text: "Game #11", status: false, },
                { id: 12, text: "Game #12", status: false, },
            ]
        },
    ]);

    const [isOpenFormBoard, setIsOpenFormBoard] = useState(false)
    const [isOpenFormCard, setIsOpenFormCard] = useState(false)
    const [FormBoardStatus, setFormBoardStatus] = useState("");
    const [BoardTitle, setBoardTitle] = useState(null);

    const removeBoard = (id) => {
        setCardList(cardList.filter(item => item.id !== id))
    }

    const removeAll = () => {

        if (confirm("fss")) {
            setCardList([
                {
                    id: 1, title: "Основной", items: []
                }])
        }
    }


    const handleDrop = (itemId, boardID, Board) => {

        // const currentIndex = Board.items.indexOf(itemId)

        // setCardList((prevCardList) => {
        //     return prevCardList.map((board) => {
        //         if (board.id === Board.id) {
        //             const updatedItems = board.items.map((item) => {
        //                 if (item.id === itemId.id) {
        //                     return { ...item, order: newOrder };
        //                 }
        //                 return item;
        //             });
        //             return { ...board, items: updatedItems };
        //         }
        //         return board;
        //     });
        // });

        setCardList((prevCardList) => {
            let item;
            const newCardList = prevCardList.map((board) => {
                if (board.id === boardID) {
                    const newItems = board.items.filter((i) => {
                        if (i.id === itemId.id) {
                            item = i;
                            return false;
                        }
                        return true;
                    });
                    return { ...board, items: newItems };
                }
                return board;
            });

            const fs = prevCardList.map((board) => {
                if (board.id === Board.id) {
                    board.items.map((c) => {
                        if (c.id === itemId.id) {
                            return { ...c, order: itemId.order };
                        }
                        if (c.id === itemId.id) {
                            return { ...c, order: card.order };
                        }
                        return c;
                    })
                    return board
                }
            })
            console.log(fs);


            const data = newCardList.map((board) => {
                if (board.id === Board.id && item) {
                    return { ...board, items: [...board.items, item] };
                }
                return board;
            });
            sessionStorage.setItem("data", JSON.stringify(data))
            return data;
        });
    };

    const removeCard = (CardID) => {
        setCardList(cardList.map((board) => {
            const newItems = board.items.filter((i) => i.id !== CardID);
            return { ...board, items: newItems };
        }))
    }

    const checedCard = (CardId, CardStatus) => {
        setCardList(cardList.map((board) => ({
            ...board,
            items: board.items.map(item =>
                item.id === CardId ? { ...item, status: CardStatus } : item
            )
        })
        ))
    }

    const readBoard = (BoardId, NewTitle) => {
        setCardList(cardList.map((board) => ({
            ...board,
            title: board.id === BoardId ? NewTitle : board.title
        })
        ))
    }

    const addCard = (BoardID, Card) => {

        setCardList((prevCardList) => {
            const data = prevCardList.map((board) => {
                if (board.id === BoardID) {
                    return { ...board, items: [...board.items, Card] };
                }
                return board;
            });
            return data
        })

    }

    return (
        <>
            <header className="header_nav">
                <img onClick={removeAll} className="btn_remove_all" src="./Remove.png" alt="Remove All" />
                <div style={{ width: "100%", position: "relative" }}>
                    <input
                        type="text"
                        className="input_search"
                        placeholder="Поиск"
                        onChange={(e) => setSearchValue(e.target.value)}
                        value={searchValue}
                    />
                    <img className="btn_clear" onClick={() => setSearchValue('')} src="./Clear.png" alt="Clear" />
                </div>

            </header>

            <main className="main_container">

                <nav style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
                    <button className="btn_add" onClick={() => { setIsOpenFormBoard(true); setFormBoardStatus("create") }}>
                        <img src="./Add.png" alt="Add" />
                    </button>
                </nav>
                {
                    cardList.map((board) => (
                        <Board setCardList={setCardList} readBoard={readBoard} addCard={addCard} setBoardTitle={setBoardTitle} setFormBoardStatus={setFormBoardStatus} setIsOpenFormBoard={setIsOpenFormBoard} serch={searchValue} key={board.id} board={board} onDrop={handleDrop} removeBoard={removeBoard} removeCard={removeCard} checedCard={checedCard} />
                    ))
                }
            </main>

            <footer className="footerContainer"></footer>

            <ModalBoard readBoard={readBoard} status={FormBoardStatus} board={BoardTitle} isOpen={isOpenFormBoard} setIsOpen={setIsOpenFormBoard} cardList={cardList} setCardList={setCardList} />
            <FormCard isOpen={isOpenFormCard} setIsOpen={setIsOpenFormCard} />
            {/* <ModalForm openForm={openForm} setOpenForm={setOpenForm} cardList={cardList} setCardList={setCardList} /> */}


        </>
    );
};

const Board = ({ board, setCardList, addCard, onDrop, removeBoard, removeCard, checedCard, serch, readBoard, setBoardTitle, setIsOpenFormBoard, setFormBoardStatus }) => {
    const [, dropBoardRef] = useDrop({
        accept: "Card",
        drop(item) {
            onDrop(item.data, item.boardID, board);
        },
    });

    const AddCardFormRef = useRef(null)
    const addNewCard = (e) => {
        e.preventDefault()
        const data = new FormData(AddCardFormRef.current)
        addCard(board.id, { id: uuidv4(), text: data.get("title"), status: false, })
        AddCardFormRef.current.reset()
    }

    return (
        <div style={{ boxShadow: "0 0 6px 0 hsla(0,0%,0%,.3)", padding: "5px 10px", borderRadius: "15px" }
        } ref={dropBoardRef}>

            <div className="Board_Title" >

                <h2>{board.title} </h2>
                {/* {
                            board.title !== "Основной" ? <><input type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
                            <button onClick={() => readBoard(board.id, title)}>d</button></> : null
                            } */}

                {
                    board.title !== "Основной" ?
                        <div className="Board_nav">
                            <img src="./Add.png" />
                            <img onClick={() => { setIsOpenFormBoard(true); setBoardTitle(board); setFormBoardStatus("rename") }} src="./Edit.png" />
                            <img onClick={() => removeBoard(board.id)} src="./Cancel.png" />
                        </div>
                        : <div className="Board_nav">
                            <img src="./Add.png" />
                        </div>
                }
            </div>

            <details>
                <summary>
                    Задачи ({board.items.filter(item => {
                        return item.text.toString().includes(serch)
                    }).length})
                </summary>
                <div>
                    <form className="add_form" onSubmit={addNewCard} ref={AddCardFormRef}>
                        <input required type="text" name="title" className="input_add" />
                        <button>Добавить задачу</button>
                    </form>
                </div>
                <div style={{ display: "grid", gridTemplateRows: "55px", gap: "15px", padding: "5px 15px" }}>
                    {board.items.filter(item => {
                        return item.text.toString().includes(serch)
                    }).map((item) => (
                        <CardItem setCardList={setCardList} BoardID={board.id} key={item.id} data={item} dropCard={removeCard} checedCard={checedCard} />
                    ))}
                </div>
            </details>
        </div >


    );
};