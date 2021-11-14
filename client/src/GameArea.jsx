const GameArea = ({ socket, buttonsState, setButtonsState, isMyTurn, setIsMyTurnState, myChar }) => { 
    const ticTacToeClick = (data, index) => {
        if(data.player !== "-"){
            return;
        }
        if(isMyTurn){
            buttonsState[index].player = myChar;
            const updatedButtons = buttonsState;
            setButtonsState([...updatedButtons]);
            socket.emit("set_a_button", {updatedButtons});
            setIsMyTurnState(false);
        }

    };
    return (
        <>
            <div className="row justify-content-center">
                {buttonsState.map((item, index) => {
                    return (
                        <div className="col col-4 w-100" key={index}>
                            <button className="btn pjs-btn-primary" style={{width: "80px", height: "80px"}} onClick={() => {ticTacToeClick(item, index)}}>
                                {item.player}
                            </button>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default GameArea;
