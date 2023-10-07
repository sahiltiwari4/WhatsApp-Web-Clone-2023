import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { SearchContainer, SearchInput } from "./contactlistcomponent";
import Picker from "emoji-picker-react";
import httpManager from "../managers/httpManager";


const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  height: 100%;
  width: 100%;
  background: #f6f7f8;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: row;
  background: #ededed;
  padding: 10px;
  align-items: center;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: row;
  background: #ededed;
  align-items: center;
  gap: 10px;
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const ContactName = styled.span`
  font-size: 16px;
  color: black;
`;

const ChatBox = styled.div`
  display: flex;
  flex-direction: row;
  background: #f0f0f0;
  padding: 10px;
  align-items: center;
  bottom: 0;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background: #e5ddd6;
`;

const MessageDiv = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isYours ? "flex-end" : "flex-start")};
  margin: 5px 15px;
  ${(props) =>
    props.isYours &&
    css`
      text-align: right; // Additional styling for your own messages if needed
    `}
`;

const Message = styled.div`
  background: ${(props) => (props.isYours ? "#daf8cb" : "white")};
  padding: 8px 10px;
  border-radius: 4px;
  max-width: 50%;
  color: #303030;
  font-size: 14px;
  ${(props) =>
    props.isYours &&
    css`
      background: #daf8cb; // Additional styling for your own messages if needed
    `}
`;

const EmojiImage = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  opacity: 0.4;
  cursor: pointer;
`;

function ConversationComponent(props) {
  const { selectedChat, userInfo, refreshContactList } = props;
  const [text, setText] = useState("");
  const [pickerVisible, togglePicker] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState(""); 

  useEffect(() => {
    setMessageList(selectedChat.channelData.messages || []);
    console.log(selectedChat);
  }, [selectedChat]);

  async function onEnterPress(event) {
    let channelId = selectedChat.channelData._id;
    if (event.key === "Enter") {
      if (!messageList || !messageList.length) {
        const channelUsers = [
          {
            email: userInfo.email,
            name: userInfo.name,
            profilePic: userInfo.imageUrl,
          },
          {
            email: selectedChat.otherUser.email,
            name: selectedChat.otherUser.name,
            profilePic: selectedChat.otherUser.profilePic,
          },
        ];
        const channelResponse = await httpManager.createChannel({
          channelUsers,
        });
        channelId = channelResponse.data.responseData._id;
      }
      refreshContactList();
      const messages = [...messageList];
     
      const msgReqData = {
        text: text + selectedEmoji,
        senderEmail: userInfo.email,
        addedOn: new Date().getTime(),
      };
      const messageResponse = await httpManager.sendMessage({
        channelId,
        messages: msgReqData,
      });
      console.log(messageResponse);
      messages.push(msgReqData);
      setMessageList(messages);
      setText("");
      setSelectedEmoji(null); 
    }
  }

  return (
    <Container>
      <ProfileHeader>
        <ProfileInfo>
          <ProfileImage src={selectedChat.otherUser.profilePic} />
          <ContactName>{selectedChat.otherUser.name}</ContactName>
        </ProfileInfo>
      </ProfileHeader>
      <MessageContainer>
        {messageList.map((messageData, index) => (
          <MessageDiv
            key={index}
            isYours={messageData.senderEmail === userInfo.email}
          >
            <Message
              isYours={messageData.senderEmail === userInfo.email}
            >
              {messageData.text}
            </Message>
          </MessageDiv>
        ))}
      </MessageContainer>
    <ChatBox>
        <SearchContainer>
          {pickerVisible && (
            <Picker
              pickerStyle={{ position: "absolute", bottom: "60px" }}
              onEmojiClick={(emojiObject) => {
                const emoji = emojiObject.emoji; // Access the emoji from emojiObject
                console.log("Emoji selected:", emoji);
                setSelectedEmoji(emoji); // Update the selectedEmoji state
                console.log("Selected Emoji:", selectedEmoji);
                setText(text + emoji); // Append the emoji to the text
                console.log("Text after appending emoji:", text);
                togglePicker(false);
              }}
              
            />


          )}
          <EmojiImage
            src={"/profile/data.svg"}
            onClick={() => togglePicker((pickerVisible) => !pickerVisible)}
          />
          <SearchInput
            placeholder="Type a message"
            value={text}
            onKeyDown={onEnterPress}
            onChange={(e) => setText(e.target.value)}
          />
        </SearchContainer>
      </ChatBox>
    </Container>
  );
}

export default ConversationComponent;
