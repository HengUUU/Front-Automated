from pydantic import BaseModel
from typing import Any, Optional

class EntryResponseData(BaseModel):
    status: Optional[str] = None
    data: Optional[dict] = None

class EntryRequestData(BaseModel):
    api_base_url: str
    bearer_token: Optional[str] = ""
    api_key: Optional[str] = ""
