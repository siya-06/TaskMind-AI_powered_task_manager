from sentence_transformers import SentenceTransformer

# load model once (global = good for performance)
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text: str):
    if not text:
        return []
    return model.encode(text).tolist()