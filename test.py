from datetime import datetime
import pandas as pd
import json

df = pd.read_csv('csv_file/net_address.csv')
id = 350626
id_mask = df['grid_id'] == id
df_id = df[id_mask]
df_result = df_id['address']
print(df_result.values[0])