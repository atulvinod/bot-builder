export const TRAINING_DATA_FILE = "TRAINING_DATA_FILE";
export const TRAINING_DATA_TYPES = "TRAINING_DATA_TYPES";
export const BOT_NAME = "BOT_NAME";
export const BOT_DESCRIPTION = "BOT_DESCRIPTION";
export const MIN_BOT_NAME_LENGTH = 10;
export const MAX_BOT_NAME_LENGTH = 50;

export enum TrainingAssetTypes {
    Files = "Files",
}
export const inputTypeToFormKeyMap = {
    [TrainingAssetTypes.Files]: TRAINING_DATA_FILE,
};