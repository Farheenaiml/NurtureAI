from sentence_transformers import SentenceTransformer

# Initialize SentenceTransformer embedding model
# This automatically downloads all-MiniLM-L6-v2 on first execution and caches it locally
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text: str) -> list:
    return model.encode(text).tolist()

def get_embeddings(texts: list) -> list:
    return model.encode(texts).tolist()
