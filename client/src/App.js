import io from "socket.io-client";
import { useState } from "react";
import GamePage from "./GamePage";
import {ToastContainer} from "react-toastify";
const socket = io.connect("localhost:3030");
const App = () => {
    const [showPageGame, setShowPageGame] = useState(false);
    const [usernameState, setUsernameState] = useState("");
    const [roomCodeState, setRoomCodeState] = useState("");
    const validateAndStartGame = () => {
        if(usernameState.length > 0 && roomCodeState.length > 0){
            setShowPageGame(true);
            const data = {
                username: usernameState,
                roomCode: roomCodeState
            }
            socket.emit("join_room", data);
        }
    };
    return (
        <>
            <ToastContainer />
            <div
                style={{ height: "100vh" }}
                className="py-5 px-2 teal accent-4 d-flex justify-content-center align-items-center">
                {!showPageGame ? (
                    <div className="w-100 bg-white p-3 rounded">
                        <h5 className="text-center">اطلاعات خود را وارد کنید</h5>
                        <div className="md-form input-with-post-icon">
                            <input
                                type="text"
                                id="suffixInside"
                                className="form-control text-center"
                                onChange={(e) => {
                                    setUsernameState(e.target.value);
                                }}
                            />
                            <label for="suffixInside">نام کاربری</label>
                        </div>
                        <div className="md-form input-with-post-icon">
                            <input
                                type="text"
                                id="suffixInside"
                                className="form-control text-center"
                                onChange={(e) => {
                                    setRoomCodeState(e.target.value);
                                }}
                            />
                            <label for="suffixInside">شماره اتاق بازی</label>
                        </div>
                        <button
                            className="btn pjs-btn-primary text-center d-block mx-auto w-50"
                            onClick={validateAndStartGame}>
                            ورود
                        </button>
                    </div>
                ) : (
                    <GamePage socket={socket} username={usernameState}/>
                )}
            </div>
        </>
    );
};

export default App;
