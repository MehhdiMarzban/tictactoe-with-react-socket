import { useEffect, useState } from "react";
import Player from "./Player";

const ShowPlayers = ({ socket, username, isMyTurn }) => {
    const [meOnlineState, setMeOnlineState] = useState(true);
    const [otherOnlineState, setOtherOnlineState] = useState(false);
    const [otherUsernameState, setOtherUsernameState] = useState("");
    // const [isYourTurnState, setIsYourTurnState] = useState(false);
    useEffect(() => {
        socket.on("set_online", (data) => {
            if (data.username !== username) {
                setOtherOnlineState(true);
                setOtherUsernameState(data.username);
                socket.emit("send_to_other_player", { username });
            }
        });
        socket.on("get_to_other_player", (data) => {
            setOtherOnlineState(true);
            setOtherUsernameState(data.username);
        });

        socket.on("set_offline", (data) => {
            setOtherOnlineState(false);
            setOtherUsernameState("بدون بازیکن");
        });

    }, [socket]);
    return (
        <>
            <div className="d-flex justify-content-between w-100">
                <Player isOnline={meOnlineState} username={username} isMyTurn={isMyTurn}/>
                <Player isOnline={otherOnlineState} username={otherUsernameState} isMyTurn={!isMyTurn}/>
            </div>
        </>
    );
};

export default ShowPlayers;
