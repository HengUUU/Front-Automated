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

    
    def _remove_outliers_iqr(self, df: pd.DataFrame, columns=None) -> pd.DataFrame:
            """
            Removes outliers from the dataframe using the IQR method.
            """
            if df.empty:
                return df

            if columns is None:
                columns = df.select_dtypes(include="number").columns.tolist()

            df_clean = df.copy()
            for col in columns:
                Q1 = df_clean[col].quantile(0.25)
                Q3 = df_clean[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                df_clean = df_clean[(df_clean[col] >= lower_bound) & (df_clean[col] <= upper_bound)]
            
            return df_clean.reset_index(drop=True)


    def _read_and_process_data(self,deviceId:str) -> pd.DataFrame:

        empty_df = pd.DataFrame(columns=["monitorDate", "ph", "cod", "ss", "temp", "waterFlow"])
        
        try:

            now = datetime.now(timezone.utc)

            # Calculate yesterday's start and end (UTC)
            yesterday = now - timedelta(days=1)
            yesterday_date = yesterday.date()  # just the date part
            # Start of yesterday
            from_date = yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
            # End of yesterday
            to_date = yesterday.replace(hour=23, minute=59, second=59, microsecond=0)

            # Convert to ISO 8601 with milliseconds as .000Z
            from_date_str = from_date.strftime("%Y-%m-%dT%H:%M:%S.000Z")
            to_date_str = to_date.strftime("%Y-%m-%dT%H:%M:%S.000Z")

            resolver = dns.resolver.Resolver()
            resolver.nameservers = ["8.8.8.8"] 

            answer = resolver.resolve("wpms.moe.gov.kh", "A")
            ip = answer[0].to_text()

            factorier_url = f"https://{ip}/api/wqs?offset=0&max=3000&order=desc&fromDate={from_date_str}&toDate={to_date_str}&code={deviceId}"


            headers = {
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "Authorization": f"Bearer {self.token}",
            "X-Api-Key": "1ccbc4c913bc4ce785a0a2de444aa0d6",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
            "Host": "wpms.moe.gov.kh"  # Important!
            }

            response = requests.get(factorier_url, headers=headers, verify=False) 


            if response.status_code != 200:
                print(f"Error: got status {response.status_code}")
                return empty_df

            data = response.json()
            # print(data)
            
            if "data" in data and isinstance(data["data"], list):
                df = pd.DataFrame(data["data"])
                df['monitorDate'] = pd.to_datetime(df['monitorDate'])

                df = df[df['monitorDate'].dt.date == yesterday_date]
                
                df = self._remove_outliers_iqr(df, columns=["ph", "cod", "ss"])

                return df
            else:
                return empty_df
        except Exception as e:
            print(f"Error loading sensor data: {e}")
            return empty_df
        


        
    # def filter_by_date(self, date: str) -> pd.DataFrame:
    #     if date:
    #         final_filtered_df = self.df[self.df['monitorDate'].dt.date.astype(str) == date]
    #     else:
    #         final_filtered_df = self.df
    #     return final_filtered_df

