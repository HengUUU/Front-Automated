import pandas as pd
import json
import dns.resolver
import requests
from datetime import datetime, timedelta, timezone

class SensorDataPreprocess:
    def __init__(self, file_path: str):
        """
        Initializes the class by reading and processing the sensor data.
        """
        self.df = self._read_and_process_data(file_path)

    def _read_and_process_data(self, file_path: str) -> pd.DataFrame:
        """
        Reads data from the JSON file and preprocesses it.
        """
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            if "data" in data and isinstance(data["data"], list):
                df = pd.DataFrame(data["data"])
                df['monitorDate'] = pd.to_datetime(df['monitorDate'])
                return df
            else:
                return pd.DataFrame()
        except Exception as e:
            print(f"Error loading sensor data: {e}")
            return pd.DataFrame()
        
    def filter_by_date(self, date: str) -> pd.DataFrame:
        if date:
            final_filtered_df = self.df[self.df['monitorDate'].dt.date.astype(str) == date]
        else:
            final_filtered_df = self.df
        return final_filtered_df
    

class RequestSensor:
    def __init__(self, token: str):
    
        self.token = token
        self.df = self._read_and_process_data()

    def _read_and_process_data(self,deviceId:str) -> pd.DataFrame:
        
        try:

            now = datetime.now(timezone.utc)

            # Calculate yesterday's start and end (UTC)
            yesterday = now - timedelta(days=1)
            from_date = yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
            to_date = yesterday.replace(hour=23, minute=59, second=59, microsecond=999000)

            # Format to ISO 8601 with Zulu time
            from_date_str = from_date.isoformat().replace("+00:00", "Z")
            to_date_str = to_date.isoformat().replace("+00:00", "Z")

            resolver = dns.resolver.Resolver()
            resolver.nameservers = ["8.8.8.8"] 

            answer = resolver.resolve("wpms.moe.gov.kh", "A")
            ip = answer[0].to_text()

            factorier_url = f"https://{ip}/api/wqs?offset=0&max=10000&order=desc&fromDate={from_date_str}&toDate={to_date_str}&code={deviceId}"


            headers = {
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "Authorization": "Bearer p7tenqeqj3d6r39heu9eptees0p9pdvd",
            "X-Api-Key": "1ccbc4c913bc4ce785a0a2de444aa0d6",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
            "Host": "wpms.moe.gov.kh"  # Important!
            }

            response = requests.get(factorier_url, headers=headers, verify=False) 


            if response.status_code != 200:
                print(f"Error: got status {response.status_code}")
                return pd.DataFrame()

            data = response.json()
            
            if "data" in data and isinstance(data["data"], list):
                df = pd.DataFrame(data["data"])
                df['monitorDate'] = pd.to_datetime(df['monitorDate'])
                return df
            else:
                return pd.DataFrame()
        except Exception as e:
            print(f"Error loading sensor data: {e}")
            return pd.DataFrame()
        
    # def filter_by_date(self, date: str) -> pd.DataFrame:
    #     if date:
    #         final_filtered_df = self.df[self.df['monitorDate'].dt.date.astype(str) == date]
    #     else:
    #         final_filtered_df = self.df
    #     return final_filtered_df

