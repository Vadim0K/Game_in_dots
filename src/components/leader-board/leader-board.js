import React, {useState, useEffect} from 'react';

import './leader-board.css';

const LeaderBoard = ({isWinnerPosted, winnerData, setIsWinnerPosted}) => {
    const [winners, setWinners] = useState([]);

    useEffect(()=>{
        getWinners();
    }, []);

    useEffect(()=>{
        if(isWinnerPosted && winnerData){
            postWinner(winnerData);
            setIsWinnerPosted(false);
        }
    },[isWinnerPosted]);


    const postWinner = async (myData) =>{

        let response = await fetch('https://starnavi-frontend-test-task.herokuapp.com/winners', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(myData)
        });

        setWinners(await response.json());
    };

    const getWinners = async () =>{
        const res = await fetch('https://starnavi-frontend-test-task.herokuapp.com/winners');

        if (!res.ok){
            throw new Error(`Could not fetch /winners, received ${res.status}`);
        }
        console.log("i am here");
        return (
            setWinners(await res.json())
        )
    };

    return (
        <div>

            <div className="leader-board">
                <h1 className="leader-board-title">Leader board</h1>
                <ul className="leader-board-list">
                    {
                        winners.map((item) =>
                            <li key={item.id} className="leader-board-winner">
                                <span>{item.winner}</span>
                                <span>{item.date}</span>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    )
};

export default LeaderBoard;