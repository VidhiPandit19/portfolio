const express = require("express");
const router = express.Router();
const Message = require("../models/message");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = await Message.create({
      name,
      email,
      message,
    });

    res.status(200).json({
      msg: "Message saved successfully",
      data: newMessage,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;