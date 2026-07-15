def split_text(text: str, chunk_size: int = 600, overlap: int = 100) -> list:
    """
    Split text into semantic chunks based on word count.
    Default: chunk_size=600 words, overlap=100 words.
    """
    words = text.split()
    chunks = []
    
    if len(words) <= chunk_size:
        return [text]
        
    i = 0
    while i < len(words):
        chunk_words = words[i : i + chunk_size]
        chunks.append(" ".join(chunk_words))
        i += (chunk_size - overlap)
        
    return chunks
