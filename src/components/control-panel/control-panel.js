import React, {useState, useEffect} from 'react';

import './control-panel.css';

const ControlPanel = ({setIsGameActive, setUserName, setGameConfig}) => {
    const [dropdownStatus, setDropdownStatus] = useState(false);
    const [dropdownValue, setDropdownValue] = useState("Pick game mode");
    const [nameInputValue, setNameInputValue] = useState('');
    const [playButtonName, setPlayButtonName] = useState('PLAY');
    const [gameSettings, setGameSettings] = useState([]);

    useEffect(()=>{
        getGameSettings();

    }, []);

    useEffect(()=>{
        if(gameSettings){
            setGameConfig(gameSettings['normalMode']);
        }
    },[gameSettings]);

    const getGameSettings = async () =>{
        const res = await fetch('https://starnavi-frontend-test-task.herokuapp.com/game-settings');

        if (!res.ok){
            throw new Error(`Could not fetch /winners, received ${res.status}`);
        }

        return (
            setGameSettings(await res.json())
        )
    };

    let classNameOfDropdownContent = "control-panel-dropdown-content";
    if(dropdownStatus) {
        classNameOfDropdownContent += ' show';
    }

    const changeDropdownValue = (event) =>{
        setDropdownValue(event.target.innerHTML);
        setGameConfig(gameSettings[event.target.id]);
        setDropdownStatus(!dropdownStatus);
    };

    const onPlayButton = (event) =>{
        event.preventDefault();
        setIsGameActive(true);
        setUserName(nameInputValue);
        setPlayButtonName("PLAY AGAIN");
        console.log(gameSettings);
    };

    const onNameInputChange = (event) =>{
        setNameInputValue(event.target.value);
    };


    return (
        <div>
            <form className="control-panel" onSubmit={onPlayButton}>
                <div className="control-panel-dropdown">
                    <div onClick={() => setDropdownStatus(!dropdownStatus)} className="control-panel-dropdown-button">{dropdownValue}
                        <i className="fa fa-caret-down" />
                    </div>
                    <div id="myDropdown" className={classNameOfDropdownContent}>
                        <p id="easyMode" onClick={changeDropdownValue} >Easy mode</p>
                        <p id="normalMode" onClick={changeDropdownValue} >Normal mode</p>
                        <p id="hardMode" onClick={changeDropdownValue} >Hard mode</p>
                    </div>
                </div>
                <input value={nameInputValue} onChange={onNameInputChange} className="control-panel-name-input" placeholder="Enter your name" required/>
                <button className="control-panel-button" type="submit" >{playButtonName}</button>
            </form>
        </div>
    )
};

export default ControlPanel;
