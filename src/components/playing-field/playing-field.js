import React, {useState, useEffect} from 'react';
import uuid from 'uuid/v4';

import './playing-field.css';

const PlayingField = ({isGameActive, setIsGameActive, userName, gameConfig, setIsWinnerPosted, setWinnerData}) => {
    const [difficulty, setDifficulty] = useState({scale: 5, time: 1000});
    const [changedCells, setChangedCells] = useState([]);/// array that keeps "done" cells; (used for render of table)
    const [tableRenderStatus, setTableRenderStatus] = useState(false);
    const [currentCell, setCurrentCell] = useState(null); // cell that we checking, is it clicked or not after delay
    const [welcomeMessage, setWelcomeMessage] = useState('Welcome');
    const [pointsRequiredToWin, setPointsRequiredToWin] = useState(0);
    const [winner, setWinner] = useState(null);

    const [isCellReadyToCheck, setIsCellReadyToCheck] = useState(false); // bool that we are using to sync randomizing of next cell and checking current cell

    const [arrayOfRandomCells, setArrayOfRandomCells]=useState([]); // array that we are using to take keys for randomizing just left cells;

    const [pointsOfUser, setPointsOfUser] = useState(0);
    const [pointsOfComp, setPointsOfComp] = useState(0);

    const [gameOver, setGameOver] = useState(false);

    const [table, setTable] = useState([]); //table that we rendering // just 2d array that easy to scale by difficulty

    useEffect(()=>{ // initializing pointsRequiredToWin and our table each time when we changing size of field.
        setPointsRequiredToWin(Math.pow(difficulty.scale,2)/2);
        let initialTable = [];

        let counter = 0;

        for (let i = 0; i<difficulty.scale; i++){
            initialTable.push([]);
            for (let j = 0; j<difficulty.scale; j++){
                initialTable[i].push(counter++);
            }
        }

        return setTable(initialTable);
    }, [difficulty.scale]);

    useEffect(()=>{ //changing difficulty only when table is inactive to avoid crash
        if(gameConfig && !tableRenderStatus) {
            setDifficulty({scale: gameConfig.field, time: 200});
        }
    },[gameConfig]);

    useEffect(()=>{ //cleaning all required states to default after end of game
        if(gameOver){
            setIsGameActive(false);
            setTableRenderStatus(false);
            setArrayOfRandomCells([]);
            setPointsOfComp(0);
            setPointsOfUser(0);
            setChangedCells([]);
            setWinner('');
            setGameOver(false);
        }
    },[gameOver]);

    useEffect(()=>{ // posting json to server after gameOver
       if(gameOver && winner) {
           let date = new Date();

           const checkTime =(i)=>
           {
               if (i<10)
               {
                   i="0" + i;
               }
               return i;
           }

           const stringDate = `${checkTime(date.getHours())}:${checkTime(date.getMinutes())}; ${checkTime(date.getDate())} ${checkTime(date.getMonth())} ${checkTime(date.getFullYear())}`;
           setWinnerData({winner: winner, date: stringDate});
           //setIsWinnerPosted(true);
       }
    },[gameOver]);

    useEffect(()=>{ //Starting game, giving time for user to recovery curson after clicking "Play"
        if(isGameActive) {
            setWelcomeMessage(`Welcome ${userName}, prepare for 1 second!`);
            setTimeout(()=>{
                setWelcomeMessage(`Welcome ${userName}`);
                renderChangedCells();
            }, 1000);
        }
    },[isGameActive]);

    useEffect(()=>{ //Deciding what to do with our currentCell, was it clicked in time or not

        if(isCellReadyToCheck){
            console.log(`Current cell: ${currentCell}`);
            console.log(pointsRequiredToWin);

            setTimeout(()=>{
                if(changedCells[currentCell].status===0){ // changedCells is array that have definitions only from 1 and more
                    setChangedCells((prev)=>{             // we changing there our cells to 0: blue -1: red -2: green
                        prev[currentCell].status = -1;    // when we randering our table we can compare: is that default 1+ cell (white)
                        return [...prev];                 // or is it already used cell, that's an idea.
                    });
                    setPointsOfComp((prev)=>prev+1);
                    setIsCellReadyToCheck(false);
                } else if(changedCells[currentCell].status===-2){
                    setPointsOfUser((prev)=>prev+1);
                    setIsCellReadyToCheck(false);
                }
            }, difficulty.time);
        }

    }, [isCellReadyToCheck]);

    useEffect(() => { //randoming new Cell only after our previous cell (currentCell) was checked.
        if (tableRenderStatus && isGameActive && !isCellReadyToCheck) {

            if (pointsOfComp > pointsRequiredToWin ) { //Checking: should we continue game or not
                setGameOver(true);
                setWelcomeMessage('Computer won!');
                setWinner("Computer");
            }else if(pointsOfUser > pointsRequiredToWin){
                setGameOver(true);
                setWelcomeMessage(`${userName} won!`);
                setWinner(userName);
            }else if(pointsOfUser === pointsRequiredToWin && pointsOfComp === pointsRequiredToWin){
                setGameOver(true);
                setWelcomeMessage('Draw');
            }else{
                const rand = Math.floor(Math.random() * arrayOfRandomCells.length);
                const correctRand = arrayOfRandomCells[rand];
                setArrayOfRandomCells(prev => {
                    prev.splice(rand, 1);
                    return prev;
                });
                setCurrentCell(correctRand);

                setChangedCells((prev) => {         // adding our Blue Cell to ChangedCells to render it on this iteration
                    prev[correctRand].status = 0;
                    return [...prev];
                });

                setIsCellReadyToCheck(true); //changing status: that we can check this cell after second (in previous useEffect)
            }
            console.log(`Score: ${pointsOfUser} : ${pointsOfComp}`); //score after each iteration
        }
    }, [tableRenderStatus, isGameActive, isCellReadyToCheck]);

    const renderChangedCells = () =>{ // firing this func on start of Game cuz we need new arrays when we changing size of field
        console.log('func {renderChangedCells} fire');
        let tempArr = [];
        for (let i=0; i<Math.pow(difficulty.scale, 2); i++){
            tempArr.push({
                status: 1
            })
        }

            let tempArr2 = [];
            for(let i=0; i<Math.pow(difficulty.scale,2);i++){
                tempArr2.push(i);
            }

        setChangedCells(tempArr);
        setArrayOfRandomCells(tempArr2);

        setTableRenderStatus(true); // only after this, we can starting our randomizing, cuz all vars are ready
    };

    const onBlueClick = (key) =>{ //onClick method for our BlueCells
        setChangedCells((prev)=>{
            prev[key].status=-2; // -2 means that it is green;
            return [...prev];
        });
    };

    return (
        <div>
            <h4 className="playing-field-title">{welcomeMessage}</h4>
            <div className="playing-field">
                <table className="playing-field-table">
                    <tbody>
                    {
                        (tableRenderStatus)?
                            table.map(item => <tr key={uuid()}>
                                {
                                    item.map(item=>{
                                        if (changedCells[item].status===0){
                                            return (<td onClick={()=>onBlueClick(item)} className="playing-field-td blue" key={item}>

                                            </td>)
                                        } else if (changedCells[item].status===-1){
                                            return (<td className="playing-field-td red" key={item}>

                                            </td>)
                                        } else if (changedCells[item].status===-2){
                                            return (<td className="playing-field-td green" key={item}>

                                            </td>)
                                        } else return (<td className="playing-field-td" key={item}>

                                        </td>)
                                    })
                                }
                            </tr>): null
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default PlayingField;