import React, {useState} from 'react';

import LeaderBoard from '../leader-board';
import PlayingField from '../playing-field';
import ControlPanel from '../control-panel';

import './app.css';

function App() {
    const [isGameActive, setIsGameActive] = useState(false);
    const [isWinnerPosted, setIsWinnerPosted] = useState(false);
    const [userName, setUserName] = useState('');
    const [gameConfig, setGameConfig] = useState({});
    const [winnerData, setWinnerData] = useState(null);


    return (
    <div className="app">
        <ControlPanel setIsGameActive={setIsGameActive} setUserName={setUserName} setGameConfig={setGameConfig}/>
        <PlayingField isGameActive={isGameActive} setIsGameActive={setIsGameActive} userName={userName} gameConfig={gameConfig} setIsWinnerPosted={setIsWinnerPosted} setWinnerData={setWinnerData}/>
        <LeaderBoard isWinnerPosted={isWinnerPosted} winnerData={winnerData} setIsWinnerPosted={setIsWinnerPosted}/>
    </div>
  );
}

export default App;
