import { TrainingAssetTypes } from "../../../lib/constants";

export interface TrainingDataInputsSchema<DataContainerType> {
    value: DataContainerType;
    type: TrainingAssetTypes;
    errors: string[];
    isValid: () => boolean;
    setValue: (o: DataContainerType) => void;
}

export interface TrainingFilesConfig {
    context: string;
    files_id: string;
    files?: { name: string; size: string }[];
}

export interface TrainingData {
    type: TrainingAssetTypes;
    config: Object | TrainingFilesConfig[];
}