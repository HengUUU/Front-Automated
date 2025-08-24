import pandas as pd
import json

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

