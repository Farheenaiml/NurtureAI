import os
import pypdf
from agents.rag.utils import split_text
from agents.rag.embeddings import get_embedding
from agents.rag.vector_store import get_collection

DOCS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "documents")

def determine_collection(filename: str) -> str:
    lower_name = filename.lower()
    if "nutrition" in lower_name or "food" in lower_name or "supplement" in lower_name:
        return "nutrition_docs"
    elif "symptom" in lower_name or "pain" in lower_name or "swoll" in lower_name:
        return "symptom_docs"
    elif "mental" in lower_name or "postnatal" in lower_name or "anxiety" in lower_name:
        return "mental_health_docs"
    elif "emergency" in lower_name or "bleed" in lower_name or "warning" in lower_name:
        return "emergency_docs"
    else:
        # Default collection is pregnancy milestones and development
        return "pregnancy_docs"

def ingest_pdfs():
    if not os.path.exists(DOCS_DIR):
        os.makedirs(DOCS_DIR)
        print(f"Created documents directory at: {DOCS_DIR}")
        print("Please place maternal medical guidelines PDFs here and re-run ingestion.")
        return

    files = [f for f in os.listdir(DOCS_DIR) if f.endswith(".pdf")]
    if not files:
        print(f"No PDFs found inside {DOCS_DIR}. Please place medical guideline PDFs there.")
        return

    print(f"Found {len(files)} PDF files to ingest.")

    for filename in files:
        file_path = os.path.join(DOCS_DIR, filename)
        collection_name = determine_collection(filename)
        collection = get_collection(collection_name)
        
        print(f"\nProcessing '{filename}' -> Collection: '{collection_name}'...")
        
        try:
            # 1. Extract text using pypdf
            reader = pypdf.PdfReader(file_path)
            full_text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    full_text += page_text + "\n"
            
            if not full_text.strip():
                print(f"Warning: Extracted text from {filename} is empty.")
                continue

            # 2. Split text
            chunks = split_text(full_text)
            print(f"Extracted text split into {len(chunks)} chunks.")

            # 3. Embed and store chunks in ChromaDB
            ids = []
            embeddings = []
            metadatas = []
            documents = []

            for idx, chunk in enumerate(chunks):
                chunk_id = f"{filename}_{idx}"
                embedding = get_embedding(chunk)
                
                ids.append(chunk_id)
                embeddings.append(embedding)
                metadatas.append({"source": filename, "chunk_index": idx})
                documents.append(chunk)

            # Store in batch
            collection.add(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=documents
            )
            print(f"Stored {len(chunks)} chunks in collection '{collection_name}' successfully!")
            
        except Exception as e:
            print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    ingest_pdfs()
