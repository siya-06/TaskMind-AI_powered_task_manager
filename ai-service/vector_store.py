import numpy as np
import pickle
import os

dimension = 384
INDEX_DIR = os.getenv("FAISS_INDEX_DIR", "faiss_index")

if not os.path.exists(INDEX_DIR):
    os.makedirs(INDEX_DIR)

def get_paths(userId):
    return f"{INDEX_DIR}/vectors_{userId}.pkl", f"{INDEX_DIR}/metadata_{userId}.pkl"

def get_or_create_store(userId):
    vec_path, meta_path = get_paths(userId)
    if os.path.exists(vec_path) and os.path.exists(meta_path):
        try:
            with open(vec_path, "rb") as f:
                vectors = pickle.load(f)
            with open(meta_path, "rb") as f:
                metadata = pickle.load(f)
            return vectors, metadata
        except Exception:
            pass
    return [], []

def save_store(userId, vectors, metadata):
    vec_path, meta_path = get_paths(userId)
    with open(vec_path, "wb") as f:
        pickle.dump(vectors, f)
    with open(meta_path, "wb") as f:
        pickle.dump(metadata, f)

def add_vector(vector, data, userId):
    vectors, metadata = get_or_create_store(userId)
    vectors.append(vector)
    metadata.append(data)
    save_store(userId, vectors, metadata)

def search(vector, userId, k=5):
    vectors, metadata = get_or_create_store(userId)
    if not vectors:
        return []
    
    vec_arr = np.array(vectors)  # shape: (N, 384)
    query_arr = np.array(vector)  # shape: (384,)
    
    # Calculate Euclidean (L2) distance squared
    distances = np.sum((vec_arr - query_arr) ** 2, axis=1)
    indices = np.argsort(distances)
    
    k = min(k, len(vectors))
    return [metadata[i] for i in indices[:k]]

def delete_vector(userId, text):
    vectors, metadata = get_or_create_store(userId)
    if not vectors:
        return

    indices_to_remove = [i for i, meta in enumerate(metadata) if meta.get("text") == text]
    if not indices_to_remove:
        return
        
    new_vectors = [v for i, v in enumerate(vectors) if i not in indices_to_remove]
    new_metadata = [m for i, m in enumerate(metadata) if i not in indices_to_remove]
    
    save_store(userId, new_vectors, new_metadata)