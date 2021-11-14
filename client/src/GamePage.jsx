import GameArea from "./GameArea";
import ShowPlayers from "./ShowPlayers";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
const GamePage = ({ socket, username }) => {
    const [buttonsState, setButtonsState] = useState([]);
    const [isMyTurnState, setIsMyTurnState] = useState(false);
    const [myCharState, setMyCharState] = useState("X");

    //* --------------------------------------------- functions ---------------------------------------------
    const clearGame = async () => {
        let copyOfButtons = [...buttonsState];
        copyOfButtons = copyOfButtons.map((btn) => {
            btn.player = "-";
            return btn;
        });
        setButtonsState(copyOfButtons);
        socket.emit("set_a_button", { updatedButtons: buttonsState });
    };

    const makeButtons = () => {
        for (let i = 1; i <= 3; i++) {
            for (let j = 1; j <= 3; j++) {
                setButtonsState((otherButtons) => [...otherButtons, { x: i, y: j, player: "-" }]);
            }
        }
    };

    const checkForEqual = () => {
        let isEqual = true;
        
        for(let btn of buttonsState){
            if (btn.player === "-") {
                        isEqual = false;
                        break;
                    }
        }
        return isEqual;
    };

    const checkForVictory = () => {
        let isWin = false;
        if (buttonsState.length === 0) {
            return;
        } else {
            for (let i = 0; i <= 6; i += 3) {
                if (
                    buttonsState[i].player === myCharState &&
                    buttonsState[i + 1].player === myCharState &&
                    buttonsState[i + 2].player === myCharState
                ) {
                    return true;
                }
            }
            for (let i = 0; i <= 2; i++) {
                if (
                    buttonsState[i].player === myCharState &&
                    buttonsState[i + 3].player === myCharState &&
                    buttonsState[i + 6].player === myCharState
                ) {
                    return true;
                }
            }
            if (
                buttonsState[0].player === myCharState &&
                buttonsState[4].player === myCharState &&
                buttonsState[8].player === myCharState
            ) {
                return true;
            }
            if (
                buttonsState[2].player === myCharState &&
                buttonsState[4].player === myCharState &&
                buttonsState[6].player === myCharState
            ) {
                return true;
            }
        }

        return isWin;
    };
    //* --------------------------------------------- functions ---------------------------------------------

    //* this is for maked buttons for start
    useEffect(() => {
        makeButtons();
    }, []);

    //* this is for checking for socket
    useEffect(() => {
        socket.on("is_my_turn", (data) => {
            setIsMyTurnState(data.isMyTurn);
            //* set client char
            setMyCharState(data.isMyTurn ? "X" : "O");
        });
        socket.on("get_a_button", (data) => {
            setButtonsState([...data.updatedButtons]);
            setIsMyTurnState(true);
        });

        socket.on("get_victory", (data) => {
            toast.success(`${data.username} برنده شد!`, { position: "bottom-center" });
        });

    }, [socket]);

    //* checking for end of game
    useEffect(() => {
        if (buttonsState.length === 0) {
            return;
        }
        let isWin = checkForVictory();
        if (isWin) {
            toast.success(`${username} برنده شد!`, { position: "bottom-center" });
            socket.emit("set_victory", { username });
            clearGame();
        } else {
            let isEqual = checkForEqual();
            if (isEqual) {
                toast.success(`بازی مساوی شد!`, { position: "bottom-center" });
                socket.emit("set_equal");
                clearGame();
            }
        }
    }, [buttonsState]);

    return (
        <>
            <div className="w-100">
                <div className="card card-cascade wider">
                    <div className="view view-cascade gradient-card-header peach-gradient">
                        <h2 className="card-header-title mb-3">بازی دوز</h2>
                    </div>

                    <div className="card-body card-body-cascade text-center z-depth-2">
                        <ShowPlayers socket={socket} username={username} isMyTurn={isMyTurnState} />
                        <GameArea
                            buttonsState={buttonsState}
                            setButtonsState={setButtonsState}
                            isMyTurn={isMyTurnState}
                            setIsMyTurnState={setIsMyTurnState}
                            myChar={myCharState}
                            socket={socket}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default GamePage;
