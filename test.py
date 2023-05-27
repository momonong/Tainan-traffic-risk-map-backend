from flask import jsonify
from datetime import datetime
import pandas as pd
import json

df = pd.read_csv('csv_file/net_address.csv')
list_high_risk = []
list_medium_risk = [148484]
list_low_risk = [160832, 163394, 170595, 146360]
list_all_risk = list_high_risk + list_medium_risk + list_low_risk
#id = 350626
# risk == 3 -> high risk
risk_list = []
for id in list_all_risk:
    id_mask = df['grid_id'] == id
    df_id = df[id_mask]
    df_result = df_id['address']
    address_result = df_result.values[0]
    if id in list_high_risk :
        risk = 3
    elif id in list_medium_risk:
        risk = 2
    else:
        risk = 1
    each_address_risk = {
        'location': address_result,
        'risk': risk
    }
    risk_list.append(each_address_risk)

#json_risk = json.dumps(risk_list, ensure_ascii=False)
json_risk = jsonify(risk_list)
print(json_risk)
