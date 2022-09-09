import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { roomService } from "../../../services/roomService";
import RoomButton from "../../UI/roomButton/RoomButton";
import { RoomDate } from "../roomDate/RoomDate";
import RoomIcon from "../roomIcon/RoomIcon";
import RoomTitle from "../roomTitle/RoomTitle";
import "./room.css";

interface RoomProps {
    roomTitle: string;
    roomTheme: string;
    roomDate: string;
    roomId: string;
    deleteRoom: boolean;
    setDeleteRoom: any;
}

const Room: React.FC<RoomProps> = ({ deleteRoom, setDeleteRoom, roomTitle, roomTheme, roomDate, roomId }) => {
    const navigate = useNavigate()
	const {state} = useContext(AuthContext);
    const deleteUserInRoom = async() => {
        await roomService.deleteUserInRoom(roomId, state.user!._id)
        setDeleteRoom(!deleteRoom)
    }
    const goToRoom = () => {
        navigate(`/viewroom/${roomId}`)
    }
    return (
        <div className="room">
            <div className="room-infos">
                <div className="room-icon">
                    <RoomIcon roomTheme={roomTheme} />
                </div>
                <div>
                    <RoomTitle roomTitle={roomTitle} />
                    <RoomDate roomDate={roomDate} />
                </div>
            </div>
            <div className="room-btns">
                <RoomButton
                    buttonText="Voir"
                    handleClick={goToRoom}
                />
                <RoomButton
                    buttonText="Quitter la salle"
                    handleClick={deleteUserInRoom}
                />
            </div>
        </div>
    );
};

export default Room;
