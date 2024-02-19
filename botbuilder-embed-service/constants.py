from enum import Enum

class TrainingAssetDefinitions(Enum):
    Files = "files.zip"

class TrainingAssetTypes(Enum):
    Files = "Files"


class BotStatus(Enum):
    Queued =  "queued"
    InProgress = "inprogress"
    Created = "created"
    Failed = "failed"