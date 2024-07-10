import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const ToDODataContext = createContext()

export const DataToDoList = ({ children }) => {

    const [UserData, setUserData] = useState(JSON.parse(sessionStorage.getItem("UserData")) || {})
    const [searchValue, setSearchValue] = useState('');
    const [cardList, setCardList] = useState(JSON.parse(sessionStorage.getItem("data")) || [
        // {
        //     id: 1, title: "Основной", items: [
        //         { id: 1, text: "Name #1", status: true, order: 1 },
        //         { id: 2, text: "Game #2", status: false, order: 2 },
        //         { id: 3, text: "Game #3", status: false, order: 3 },
        //         { id: 4, text: "Name #4", status: false, order: 4 },
        //         { id: 5, text: "Name #5", status: true, order: 5 },
        //         { id: 6, text: "Name #6", status: false, order: 6 },
        //         { id: 7, text: "Name #7", status: false, order: 7 },
        //         { id: 8, text: "Name #8", status: false, order: 8 },
        //         { id: 9, text: "Name #9", status: true, order: 9 },
        //     ]
        // },
        // {
        //     id: 2, title: "Игры", items: [
        //         { id: 10, text: "Game #10", status: false, order: 1 },
        //         { id: 11, text: "Game #11", status: false, order: 2 },
        //         { id: 12, text: "Game #12", status: false, order: 3 },
        //     ]
        // },
    ]);

    const [isSave, setIsSave] = useState(false)

    useEffect(() => {
        sessionStorage.setItem("data", JSON.stringify(cardList))
        const ID = UserData.Id
        setIsSave(false)
        const { data } = axios({
            method: "put",
            url: "https://todolistserver-9yzt.onrender.com/api/TaskList",
            params: {
                User_Id: ID,
                datas: JSON.stringify(cardList)
            },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        if (data) {
            setIsSave(data.status)
        }


    }, [cardList])

    const DnDBetweenBoard = (itemId, Board) => {
        setCardList((prevCardList) => {
            let item;
            const newCardList = prevCardList.map((board) => {
                if (board.id !== Board.id) {
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
            const data = newCardList.map((board) => {
                if (board.id === Board.id && item) {
                    return { ...board, items: [...board.items, item] };
                }
                return board;
            });
            return data;
        });
    };


    return <ToDODataContext.Provider
        value={{
            setCardList,
            cardList,
            setSearchValue,
            searchValue,
            DnDBetweenBoard,
            setUserData,
            UserData,
            isSave
        }}>
        {children}
    </ToDODataContext.Provider>

}
