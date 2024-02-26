from pinecone import Pinecone
import os

class PineconeClient:
    def __init__(self):
        self.client = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))