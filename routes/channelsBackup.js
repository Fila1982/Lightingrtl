const ChannelsBackupController = require("../controllers/channelsBackup");
const express = require("express");
const router = express.Router();
const authCheck = require("./authCheck");

router.get("/:channelPoint", authCheck, ChannelsBackupController.getBackup);
router.post("/verify/:channelPoint", authCheck, ChannelsBackupController.postBackupVerify);
router.post("/upload/:channelPoint", authCheck, ChannelsBackupController.uploadBackup);

module.exports = router;
