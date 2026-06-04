import torch
from sentence_transformers import SentenceTransformer

# Limit PyTorch to 1 CPU thread to save memory on Render Free Tier
torch.set_num_threads(1)

# load model once (global = good for performance)
model = SentenceTransformer('all-MiniLM-L6-v2')
model.max_seq_length = 128

def get_embedding(text: str):
    if not text:
        return []
    with torch.no_grad():
        return model.encode(text).tolist()