const Player = ({ username = "بدون بازیکن", isOnline = false , isMyTurn = false}) => {    
    return (
        <>
            <div className="">
                <p
                    className="bg-dark text-white text-center p-1 rounded"
                    style={{ width: "100px" }}>
                    {username.length === 0 ? "بدون بازیکن" : username}
                    <small
                        className={isOnline ? "d-block text-success" : "d-block text-danger"}>
                        {isOnline ? "آنلاین" : "آفلاین"}
                    </small>
                    <small
                        className={isMyTurn ? "d-block text-info animated heartBeat infinite" : "d-block text-warning"}>
                        {isMyTurn ? ("نوبت شماست") : ("نوبت حریف")}
                    </small>
                </p>
            </div>
        </>
    );
};

export default Player;
