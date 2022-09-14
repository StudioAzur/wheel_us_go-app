import { useContext, useState, useEffect, useRef } from "react";
import { Layout, RoomsTitle } from "../../components";
import Conversation from "../../components/userMessages/conversation/Conversation";
import Message from "../../components/userMessages/message/Message";
import { AuthContext } from "../../context/AuthContext";
import { conversationService } from "../../services/conversationService";
import { messageService } from "../../services/messageService";
import "./userMessages.css";
import { io } from "socket.io-client";
import {IoChatbubblesOutline} from '../../icons/index';

const socket = io("https://wheelsocket.azurewebsites.net/");

const UserMessages: React.FC<unknown> = () => {
    const [conversations, setConversations] = useState<any>([]);
    const [currentChat, setCurrentChat] = useState<any>();

    const [messages, setMessages] = useState<any>([]);
    const [newMessage, setNewMessage] = useState<any>("");
    const [arrivalMessage, setArrivalMessage] = useState<any>("");

    const { state } = useContext(AuthContext);
    const userId = state.user!._id;

    const scrollRef = useRef<any>();

    useEffect(() => {
        socket.emit("addUser", userId);
        socket.on("getUsers", (users) => {
            console.log(users);
        });
        socket.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
        return () => {
            socket.off("addUser");
            socket.off("getUsers");
            socket.off("getMessage");
        };
    }, [userId]);

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev: any) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        const getConversationsByUserId = async () => {
            const response = await conversationService.getConversationsByUserId(
                userId
            );
            setConversations(response.data);
        };
        getConversationsByUserId();
    }, [userId]);

    useEffect(() => {
        const getMessagesByConversationId = async () => {
            const response = await messageService.getMessagesByConversationId(
                currentChat?._id
            );
            setMessages(response.data);
        };
        getMessagesByConversationId();
    }, [currentChat]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const message = {
            sender: userId,
            text: newMessage,
            conversationId: currentChat._id,
        };
        const receiverId = currentChat.members.find(
            (member: any) => member !== userId
        );
        socket.emit("sendMessage", {
            senderId: userId,
            receiverId,
            text: newMessage,
        });
        const addMessage = async () => {
            await messageService.addMessage(message);
            setMessages((prev: any) => [...prev, message]);
            setNewMessage("");
        };
        addMessage();
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Layout>
            <div className="user-messages__container">
                <div className="user-messages">
                    <div className="user-messages-chat-menu">
                        <div className="chat-menu-input">
                            <input
                                placeholder="Chercher un ami"
                                className="chat-input"
                            />
                        </div>
                        <div className="chat-friends">
                            {conversations.map((conversation: any) => (
                                <div
                                    key={conversation._id}
                                    onClick={() => setCurrentChat(conversation)}
                                >
                                    <Conversation
                                        key={conversation._id}
                                        conversation={conversation}
                                        userId={userId}
                                    />
                                </div>
                            ))}
                            <p>heeeeyy</p>
                            <p>heeeeyy</p>
                            <p>heeeeyy</p>
                            <p>heeeeyy</p>
                            <p>heeeeyy</p>
                            <p>heeeeyy</p>
                        </div>
                    </div>
                    <div className="user-messages-chat-box">
                            {currentChat ? (
                                <>
                                    <div className="chatBoxTop">
                                        {messages.map(
                                            (message: any, i: any) => (
                                                <div ref={scrollRef} key={i}>
                                                    <Message
                                                        message={message}
                                                        own={
                                                            message.sender ===
                                                            userId
                                                        }
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className="chatBoxBottom">
                                        <textarea
                                            className="chatMessageInput"
                                            placeholder="Ecrivez quelque chose ..."
                                            onChange={(e) =>
                                                setNewMessage(e.target.value)
                                            }
                                            value={newMessage}
                                        ></textarea>
                                        <div className="chat-btns">
                                            <button
                                                className="chatSubmitButton"
                                                onClick={handleSubmit}
                                            >
                                                Envoyer le message
                                            </button>
                                            <button
                                                className="chatSubmitButton"
                                                onClick={handleSubmit}
                                            >
                                                Fermer la discussion
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="no-conversation">
                                    <IoChatbubblesOutline className="no-conversation-icon"/>
                                    <span>
                                    Ouvrez une conversation pour commencer à discuter !
                                    </span>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserMessages;
