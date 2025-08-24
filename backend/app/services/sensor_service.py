from typing import Dict, Any


def calculate_average_metrics(df) -> Dict[str, Any]:
        """
        Calculates the average of COD, pH, TSS, and Tem from the DataFrame.
        
        Returns:
            A dictionary with the average value for each parameter.
        """
        # Ensure the DataFrame is not empty before calculating
        if df.empty:
            return {}
        
        # Select the columns and compute the mean
        avg_metrics = df[['ph', 'ss', 'cod', 'waterFlow','temperature']].mean()
        
        # Convert the resulting pandas Series to a dictionary
        return avg_metrics.to_dict()