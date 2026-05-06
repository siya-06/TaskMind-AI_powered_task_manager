from fastapi import FastAPI
from pydantic import BaseModel
from embedding import get_embedding
from vector_store import add_vector, search

app = FastAPI()

class Task(BaseModel):
    text: str
    userId: int

class Query(BaseModel):
    query: str
    userId: int

@app.post("/add")
def add_task(task: Task):
    vector = get_embedding(task.text)
    add_vector(vector, {"text": task.text, "userId": task.userId})
    return {"status": "added"}

@app.post("/query")
def query_task(q: Query):
    vector = get_embedding(q.query)
    results = search(vector)
    
    # filter by user
    filtered = [r for r in results if r["userId"] == q.userId]

    return {"results": filtered}