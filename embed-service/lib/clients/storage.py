import os
from firebase_admin import credentials
from firebase_admin import storage
import firebase_admin
import tempfile
from lib.constants import TrainingAssetDefinitions

class Storage:
    def __init__(self) -> None:
        firebase_credentials = credentials.Certificate('firebase_service_account_config.json')
        firebase_admin.initialize_app(firebase_credentials)
        self.root_bucket = storage.bucket(name=os.getenv("FIREBASE_STORAGE_BUCKET"))

    def createTrainingAssetDirectory(self, data_id:str):
        temp_directory = tempfile.mkdtemp(data_id)
        return temp_directory

    def downloadTrainingAsset(self, data_id:str, training_directory:str, file_name: str):
        blob = self.root_bucket.blob('training/{data_id}/{file_name}'.format(data_id=data_id, file_name=file_name))
        # download asset 
        contents = blob.download_as_bytes()

        # create temporary directory
        
        asset_path = os.path.join(training_directory,file_name)

        with open(asset_path,"wb") as zipfile:
            zipfile.write(contents)        
        return asset_path