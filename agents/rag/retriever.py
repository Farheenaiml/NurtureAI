from agents.rag.embeddings import get_embedding
from agents.rag.vector_store import get_collection

def retrieve_context(collection_name: str, query: str, top_k: int = 5) -> list:
    """
    Search ChromaDB for the Top K relevant context chunks.
    Returns a list of dicts: {"text": str, "score": float, "source": str}
    """
    try:
        collection = get_collection(collection_name)
        
        # Verify collection contains items before searching
        count = collection.count()
        if count == 0:
            print(f"[Retriever] Warning: Collection '{collection_name}' is empty.")
            return []

        # Generate query vector
        query_vector = get_embedding(query)
        
        # Query ChromaDB
        results = collection.query(
            query_embeddings=[query_vector],
            n_results=min(top_k, count),
            include=["documents", "metadatas", "distances"]
        )
        
        retrieved_items = []
        
        # Verify result contains matches
        if not results or not results["documents"] or len(results["documents"][0]) == 0:
            return []
            
        documents = results["documents"][0]
        metadatas = results["metadatas"][0]
        distances = results["distances"][0]
        
        for idx in range(len(documents)):
            # Convert distance to similarity score
            # Cosine distance ranges from 0 (identical) to 2 (opposite).
            # Cosine similarity = 1.0 - distance
            distance = distances[idx]
            similarity = max(0.0, min(1.0, 1.0 - distance))
            
            source = metadatas[idx].get("source", "Unknown Guidelines")
            
            retrieved_items.append({
                "text": documents[idx],
                "score": round(similarity, 4),
                "source": source
            })
            
        return retrieved_items
    except Exception as e:
        print(f"[Retriever] Error querying collection '{collection_name}': {e}")
        return []
