import faiss
import numpy as np
import pickle
import os

dimension = 384
INDEX_DIR = "faiss_index"

if not os.path.exists(INDEX_DIR):
    os.makedirs(INDEX_DIR)

def get_paths(userId):
    return f"{INDEX_DIR}/index_{userId}.bin", f"{INDEX_DIR}/metadata_{userId}.pkl"

def get_or_create_index(userId):
    index_path, meta_path = get_paths(userId)
    if os.path.exists(index_path):
        index = faiss.read_index(index_path)
        metadata = pickle.load(open(meta_path, "rb"))
    else:
        index = faiss.IndexFlatL2(dimension)
        metadata = []
    return index, metadata

def save_index(userId, index, metadata):
    index_path, meta_path = get_paths(userId)
    faiss.write_index(index, index_path)
    pickle.dump(metadata, open(meta_path, "wb"))

def add_vector(vector, data, userId):
    index, metadata = get_or_create_index(userId)
    index.add(np.array([vector]).astype("float32"))
    metadata.append(data)
    save_index(userId, index, metadata)

def search(vector, userId, k=5):
    index, metadata = get_or_create_index(userId)
    if index.ntotal == 0:
        return []
    
    k = min(k, index.ntotal)
    D, I = index.search(np.array([vector]).astype("float32"), k)
    return [metadata[i] for i in I[0] if i < len(metadata) and i >= 0]

def delete_vector(userId, text):
    index, metadata = get_or_create_index(userId)
    if index.ntotal == 0:
        return

    indices_to_remove = [i for i, meta in enumerate(metadata) if meta.get("text") == text]
    if not indices_to_remove:
        return
        
    new_index = faiss.IndexFlatL2(dimension)
    new_metadata = []
    
    for i in range(index.ntotal):
        if i not in indices_to_remove:
            vec = index.reconstruct(i)
            new_index.add(np.array([vec]).astype("float32"))
            new_metadata.append(metadata[i])
            
    save_index(userId, new_index, new_metadata)