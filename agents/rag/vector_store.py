import chromadb
import os

# Persistent storage folder for ChromaDB inside the rag folder
DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vector_db")

client = chromadb.PersistentClient(path=DB_DIR)

COLLECTIONS = [
    "nutrition_docs",
    "pregnancy_docs",
    "symptom_docs",
    "mental_health_docs",
    "emergency_docs"
]

def get_collection(name: str):
    if name not in COLLECTIONS:
        raise ValueError(f"Collection '{name}' is not registered.")
    return client.get_or_create_collection(name=name)
