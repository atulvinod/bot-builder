import { TrainingAssetTypes } from "../../lib/constants";

export interface TrainingDataSchema<DataContainerType> {
    value: DataContainerType;
    type: TrainingAssetTypes;
    errors: string[];
    isValid: () => boolean;
    setValue: (o: DataContainerType) => void;
}
