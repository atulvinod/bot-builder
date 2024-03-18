from lib.clients.db import DB
import json
from typing import List, Dict
from lib.constants import TrainingAssetTypes, BotStatus, TrainingAssetDefinitions
from lib.clients.storage import Storage
import logging
import zipfile
import os
from pinecone import ServerlessSpec, PineconeApiException
from lib.clients.pinecone_client import PineconeClient
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, StorageContext
from llama_index.vector_stores.pinecone import PineconeVectorStore
from lib.clients.email_client import sendSuccessMessage
import shutil

class BotTrainer:
    def __init__(self):
        self.db = DB.getInstance()
        self.storage = Storage()
        self.pinecone = PineconeClient().client

    def updateBotStatus(self, bot_id: int, bot_status: BotStatus):
        self.db.getDbClient().run("UPDATE bot_details SET status = %(status)s WHERE id = %(bot_id)s", {"status" : bot_status.value, "bot_id" :bot_id})

    def __getPineconeIndex(self, bot_id:int, files_id):
        index_key = f"files-{str(bot_id)}-{files_id.lower()}";
        logging.info(f"Creating Pinecone index - {index_key}")
        try:
            self.pinecone.create_index(
                name= index_key,
                dimension=1536,
                metric='euclidean',
                spec=ServerlessSpec(
                cloud='aws',
                region='us-west-2'
                ))
        except PineconeApiException as apiEx:
            if apiEx.reason != "Conflict":
                raise apiEx 
        index = self.pinecone.Index(index_key)
        return index

    def __createTrainingFilesDirectory(self, training_asset_directory):
        tf_path = os.path.join(training_asset_directory, 'training_files')
        os.mkdir(tf_path)
        return tf_path

    def __extractAssetsZipToTrainingDir(self, training_directory:str, zip_path:str):
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(training_directory)   

    def __buildVectorsUsingFiles(self,training_config: List[Dict] ,training_asset_directory:str, bot_id:int ,bot_data_id:str):
        training_files_directory = self.__createTrainingFilesDirectory(training_asset_directory)

        for config in training_config:
            files_id = config['files_id']
            downloaded_asset_path = self.storage.downloadTrainingAsset(bot_data_id, training_asset_directory, f"{files_id}.zip")
            self.__extractAssetsZipToTrainingDir(training_files_directory, downloaded_asset_path)
            pinecone_index = self.__getPineconeIndex(bot_id, files_id)
            logging.info("Reading training files")
            training_files = SimpleDirectoryReader(
                input_dir=training_files_directory, recursive=True
            ).load_data()
            pinecone_vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
            pinecone_storage_context = StorageContext.from_defaults(vector_store=pinecone_vector_store)
            logging.info("Building vector index from training files")
            VectorStoreIndex.from_documents(documents=training_files,storage_context=pinecone_storage_context)   

    def __processTrainingData(self, bot_id:int ,assets_id: str ,training_spec: List[Dict]):
        training_asset_directory = self.storage.createTrainingAssetDirectory(assets_id)
        isCompleted = True
        try:
            for ts in training_spec:
                if ts["type"] == TrainingAssetTypes.Files.value:
                    logging.info("Building vectors using training files")
                    self.__buildVectorsUsingFiles(
                        ts["config"], training_asset_directory, bot_id, assets_id
                    )
                    logging.info("Vectors built using training files")
        except Exception as ex:
            logging.error("Failed training ", str(ex))
            isCompleted = False

        shutil.rmtree(training_asset_directory)
        if isCompleted:
            sendSuccessMessage(bot_id)

    def process(self, bot_id: int):
        try:
            bot_details = self.db.getBotDetailsById(bot_id)
            if bot_details is None:
                logging.error(f"No bot found with the id {bot_id}")
                return
            self.updateBotStatus(bot_id, BotStatus.InProgress)
            bot_spec = bot_details.spec
            training_spec = bot_spec['training_spec']
            assets_id = bot_details.assets_id
            self.__processTrainingData(bot_id, assets_id ,training_spec)
            self.updateBotStatus(bot_id, BotStatus.Created)
            logging.info("Created bot "+str(bot_id))
        except Exception as e:
            self.updateBotStatus(bot_id, BotStatus.Failed)
            logging.error('An error occurred when creating bot :'+str(e))
