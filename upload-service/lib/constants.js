const IS_PRIVATE = "IS_PRIVATE";
const TRAINING_DATA_FILE = "TRAINING_DATA_FILE";
const TRAINING_DATA_TYPES = "TRAINING_DATA_TYPES";
const BOT_NAME = "BOT_NAME";
const BOT_DESCRIPTION = "BOT_DESCRIPTION";
const MIN_BOT_NAME_LENGTH = 10;
const MAX_BOT_NAME_LENGTH = 50;
const BOT_AVATAR = "BOT_AVATAR";
const TRAINING_SPEC = "TRAINING_SPEC";

const inputTypeToFormKeyMap = {
    Files: TRAINING_DATA_FILE,
};

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/pixel-art/svg";
const TrainingAssetTypes = {
    "Files": "Files"
}

module.exports = {
    TRAINING_DATA_FILE,
    TRAINING_DATA_TYPES,
    BOT_NAME,
    BOT_DESCRIPTION,
    MIN_BOT_NAME_LENGTH,
    MAX_BOT_NAME_LENGTH,
    BOT_AVATAR,
    TRAINING_SPEC,
    inputTypeToFormKeyMap,
    DEFAULT_AVATAR,
    TrainingAssetTypes,
    IS_PRIVATE
};
