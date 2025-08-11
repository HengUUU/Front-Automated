from fastapi import APIRouter
from app.models.data_schema import EntryResponseData, EntryRequestData
from app.services.entry_service import fetch_api_data


router = APIRouter()

@router.post("/fetch", response_model=EntryResponseData)
def fetch(entry: EntryRequestData):
    api_data = fetch_api_data(entry.api_base_url, entry.bearer_token, entry.api_key)
    return EntryResponseData(**api_data)