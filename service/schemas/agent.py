from pydantic import BaseModel

from typing import Any

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    success: bool
    data: Any
    message: str