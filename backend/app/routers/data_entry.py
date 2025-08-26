from fastapi import APIRouter, Query
from app.models.data_schema import EntryResponseData
from app.services.read_data_sensor import SensorDataPreprocess, RequestSensor
from app.services.entry_service import fetch_api_data
from dotenv import load_dotenv
import os
from typing import Optional
from app.services.sensor_service import calculate_average_metrics
from app.services.read_data_factory import read_nested_data_fac, nested_data_factory ,get_factory_infor
from typing import List, Dict, Any
from app.services.token_service import check_valid_token, check_login
from datetime import timedelta, datetime, timezone

# Load environment variables from .env file
load_dotenv()

router = APIRouter()

@router.get("/fetch", response_model=EntryResponseData)
async def fetch(
    api_base_url: str = Query(..., description="Base URL of the API"),
    bearer_token: str = Query(None, description="Bearer token for authentication"),
    api_key: str = Query(None, description="API key for authentication"),
    cookies: str = Query(None, description="Cookies as a string, e.g. 'sessionid=123; user=john'")
):
    """
    Fetch data from an external API using GET request.
    """
    # Call the service function to make the actual GET request
    return fetch_api_data(api_base_url, bearer_token, api_key, cookies)




@router.get("/preprocess")
async def get_report_by_device_and_date(date: Optional[str] = None):
    

    all_reports: List[Dict[str, Any]] = []


    # read sensor data
    sensor_path = os.getenv("SENSOR_DATA_PATH")
    sensor_data = SensorDataPreprocess(file_path=sensor_path)
    # filter data by date
    filtered_df = sensor_data.filter_by_date(date=date)

    # read station data
    station_path =  os.getenv("FACTORY_DATA_PATH")
    station_data = read_nested_data_fac(file_path=station_path)

    # find average parameters
    avg_param = calculate_average_metrics(filtered_df)

    # get device_id
    deviceId = filtered_df['deviceId'].iloc[0]
    # get station information
    station_ = (get_factory_infor(deviceId,station_data))

    single_factory_rp = {

            "avg_parame": avg_param,
            "date": date,
            "device_ids": deviceId,
            "station_info": station_,
            
           }
    all_reports.append(single_factory_rp)
        
    # Return the entire list of reports
    return {"data": all_reports,
            "total_factories": len(all_reports),}


@router.get("/token-request")
async def token_request(token: str):
    result = check_valid_token(token=token)
    return result    

@router.get("/token-test")
async def token_request(token: str):
    result = check_login(token)
    return result   


@router.get("/report")
async def get_reports(token:str):

    # Calculate yesterday's start and end (UTC)
    yesterday_str = (datetime.now(timezone.utc) - timedelta(days=1)).date().isoformat()
    


    result = check_valid_token(token)
    if result["status"] != "success":
        return result

    all_reports: List[Dict[str, Any]] = []


    # read station data
    station_data = nested_data_factory(result["data"])


    # read sensor data
    sensor_data = RequestSensor(token)

    for ind in station_data:
        for i in ind['factory']:
            fc_dt = sensor_data._read_and_process_data(i['deviceId'])

            if fc_dt.empty:
                continue



            # find average parameters
            avg_param = calculate_average_metrics(fc_dt)

            # get station information
            station_ = (get_factory_infor(i['deviceId'],station_data))

            single_factory_rp = {

                    "avg_parame": avg_param,
                    "date": yesterday_str,
                    "device_ids": i['deviceId'],
                    "station_info": station_,
                
            }
            all_reports.append(single_factory_rp)
        
    # Return the entire list of reports
    return {"data": all_reports,
            "total_factories": len(all_reports),}






# import os
# import requests
# import pandas as pd
# from fastapi import APIRouter
# from typing import List, Dict, Any
# from your_module.data_reader import read_nested_data_fac
# from your_module.id_extractor import extract_station_ids
# from your_module.sensor_data_class import SensorDataPreprocess # Your processing class

# router = APIRouter()

# # Assumed URL for your sensor data API
# SENSOR_DATA_API_URL = "https://{your-api-ip}/api/wqs"

# @router.get("/all-factories-report")
# async def get_all_factories_report():
#     # 1. Read the factory data ONCE to get all station IDs
#     station_path = os.getenv("FACTORY_DATA_PATH")
#     station_data_df = read_nested_data_fac(file_path=station_path)
    
#     # Check if a DataFrame was returned and get the station IDs
#     if station_data_df.empty:
#         return {"error": "Failed to retrieve station data."}
    
#     all_station_ids = extract_station_ids(station_data_df.to_dict('records')[0]) # Use the corrected extractor
    
#     final_reports: List[Dict[str, Any]] = []

#     # 2. Loop through each station ID to get its data from the API
#     for station_id in all_station_ids:
#         try:
#             # Build the URL with the station ID and other parameters
#             params = {
#                 "offset": 0,
#                 "max": 100000, # A high value for a single day's data
#                 "fromDate": "2025-08-22T00:00:00.000Z", # Example date
#                 "toDate": "2025-08-23T00:00:00.000Z",
#                 "code": station_id
#             }
            
#             # Make the API request for this specific station's data
#             response = requests.get(SENSOR_DATA_API_URL, params=params)
#             response.raise_for_status() # Raise an error for bad status codes

#             # 3. Process the data for the single station
#             data_from_api = response.json()
            
#             # The API returns nested JSON, so we use your class to handle it
#             processor = SensorDataPreprocess(data_from_api) 
            
#             if not processor.df.empty:
#                 # Calculate the average metrics for this single station
#                 # This will be the only station in this filtered DataFrame
#                 avg_metrics = processor.df.mean(numeric_only=True).to_dict()

#                 # Find the station's name from your local station data
#                 station_name = station_data_df[station_data_df['code'] == station_id]['name'].iloc[0]

#                 final_reports.append({
#                     "station_id": station_id,
#                     "station_name": station_name,
#                     "records_found": len(processor.df),
#                     "average_metrics": avg_metrics
#                 })

#         except requests.exceptions.RequestException as e:
#             print(f"Failed to get data for station {station_id}: {e}")
#             continue # Continue to the next station even if this one fails
    
#     # 4. Return the combined report for all stations
#     return {
#         "message": "Average metrics for all factories generated successfully.",
#         "total_stations_processed": len(final_reports),
#         "data": final_reports
#     }
