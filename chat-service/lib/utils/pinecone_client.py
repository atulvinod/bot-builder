from pinecone import Pinecone
import os

class PineconeClient:
    def __init__(self) -> None:
        self.__pineconeClient = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
    
    def getClient(self):
        return self.__pineconeClient