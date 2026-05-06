import faiss
import numpy as np
import pickle
import os

INDEX_PATH = "faiss_index/index.bin"
META_PATH = "faiss_index/metadata.pkl"

dimension = 384

if os.path.exists(INDEX_PATH):
    index = faiss.read_index(INDEX_PATH)
    metadata = pickle.load(open(META_PATH, "rb"))
else:
    index = faiss.IndexFlatL2(dimension)
    metadata = []

def add_vector(vector, data):
    global metadata
    index.add(np.array([vector]).astype("float32"))
    metadata.append(data)

    faiss.write_index(index, INDEX_PATH)
    pickle.dump(metadata, open(META_PATH, "wb"))

def search(vector, k=5):
    D, I = index.search(np.array([vector]).astype("float32"), k)
    return [metadata[i] for i in I[0] if i < len(metadata)]