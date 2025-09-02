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
from token_store import token_memory, get_token, set_token

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
    if result["status"] == "success":
        # Only store if valid
        set_token(token)
        print("Token stored in memory:", get_token())
    else:
        print("Invalid token attempt:", token)

    return result   

@router.get("/token-test")
async def token_request(token: str):
    result = check_login(token)
    return result   


@router.get("/report")
async def get_reports():

    token = get_token()

    # Calculate yesterday's start and end (UTC)
    yesterday_str = (datetime.now(timezone.utc) - timedelta(days=1)).date().isoformat()
    # print(yesterday_str)
    


    result = check_valid_token(token)
    if result["status"] != "success":
        # print("Station data length:")
        return result

    all_reports: List[Dict[str, Any]] = []


    # read station data
    station_data = nested_data_factory(result["data"])
    
    # print(station_data)




    # read sensor data
    sensor_data = RequestSensor(token)
    num = 0


    for ind in station_data:
        for i in ind['factory']:
            num += 1

            fc_dt = sensor_data._read_and_process_data(i['deviceId'])
            # print(fc_dt)

            if fc_dt.empty:
                avg_param = {
                "ph": None,
                "cod": None,
                "ss": None,
                "waterFlow": None,
                "temperature": None
                }
            else:

                # find average parameters
                avg_param = calculate_average_metrics(fc_dt)

            # get station information
            station_ = (get_factory_infor(i['deviceId'],station_data))
            # print(len(station_))

            single_factory_rp = {

                    "avg_parame": avg_param,
                    "date": yesterday_str,
                    "device_ids": i['deviceId'],
                    "station_info": station_,
                
            }
            all_reports.append(single_factory_rp)
            print(num)
            # print(len(all_reports))
        
    # Return the entire list of reports
    return {"data": all_reports,
            "total_factories": len(all_reports),}




@router.get("/report-test")
async def get_reports():

    token = get_token()

    # Calculate yesterday's start and end (UTC)
    yesterday_str = (datetime.now(timezone.utc) - timedelta(days=1)).date().isoformat()
    # print(yesterday_str)
    


    result = check_valid_token(token)
    if result["status"] != "success":
        print("Station data length:")
        return result

    all_reports: List[Dict[str, Any]] = []


    # read station data
    station_data = nested_data_factory(result["data"])
    
    # print(station_data)




    # read sensor data
    sensor_data = RequestSensor(token)
    fc_dt = sensor_data._read_and_process_data("E4:65:B8:2B:0B:8C")




