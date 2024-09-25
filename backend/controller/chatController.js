import expressAsyncHandler from "express-async-handler";
import Chat from "../model/chat.js";

const chatController = {
  getChat: expressAsyncHandler(async (req, res) => {
    const { userId, ownerId } = req.params;
    try {
      const chat = await Chat.findOne({
        participants: { $all: [userId, ownerId] },
      });
      res.status(200).json(chat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  saveChat: expressAsyncHandler(async (req, res) => {
    const { sender, ownerId, message, senderType } = req.body;
    try {
      const newMessage = {
        sender: sender,
        message: message,
        senderType,
        timestamp: new Date(),
      };

      let chat = await Chat.findOne({
        participants: { $all: [sender, ownerId] },
      });

      if (!chat) {
        chat = new Chat({
          participants: [sender, ownerId],
          senderType,
          messages: [newMessage],
        });
      } else {
        chat.messages.push(newMessage);
      }

      await chat.save();

      res.status(200).json(chat);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }),

  chatList: expressAsyncHandler(async (req, res) => {
    const { ownerId } = req.params;

    try {
      const chats = await Chat.find({ participants: ownerId })
        .populate("participants", "name")
        .sort({ "messages.timestamp": -1 });

      const chatList = chats.map((chat) => ({
        chatId: chat._id,
        participants: chat.participants.map((participant) => participant.name),
        lastMessage: chat.messages[chat.messages.length - 1],
      }));

      res.status(200).json(chatList);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  getChatOwner: expressAsyncHandler(async (req, res) => {
    const { chatId } = req.params;

    try {
      const chat = await Chat.findById(chatId).populate(
        "messages.sender",
        "_id name"
      );

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      res.status(200).json(chat);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }),

  saveChatOwner: expressAsyncHandler(async (req, res) => {
    const { chatId, sender, senderType, message } = req.body;
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      const newMessage = {
        sender,
        senderType,
        message,
      };

      chat.messages.push(newMessage);

      await chat.save();

      res.status(200).json(chat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),
};

export default chatController;
