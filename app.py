from flask import Flask, request, jsonify, Response
from datetime import datetime
import pandas as pd
import json

app = Flask(__name__)

@app.route('/api/myfunction', methods=['GET'])
def my_function():
    # 分別取得「行政區」「天氣」「時間」
    # 
    get_district = request.args.get('district')
    get_weather = request.args.get('weather')
    current_time = datetime.now()
    hour = current_time.hour
    #hour = 17

    # 取得符合條件的 df 單一 row
    df_risk = pd.read_csv('csv_file/for_web.csv')
    district_mask = df_risk['district'] == get_district
    weather_mask = df_risk['weather'] == get_weather
    time_mask = df_risk['time_slot'] == hour
    df_result = df_risk[district_mask & weather_mask & time_mask]

    # 將 grid_id 字串轉為 list
    str_high_risk = df_result['risk_high'].values
    str_mediumj_risk = df_result['risk_medium'].values
    str_low_risk = df_result['risk_low'].values
    list_high_risk = json.loads(str_high_risk[0])
    list_medium_risk = json.loads(str_mediumj_risk[0])
    list_low_risk = json.loads(str_low_risk[0])

    # 取得地址
    # 對照 grid_id 與 address
    df_address = pd.read_csv('csv_file/net_address.csv')
    list_all_risk = list_high_risk + list_medium_risk + list_low_risk
    risk_list = []
    for id in list_all_risk:
        id_mask = df_address['grid_id'] == id
        df_address_id = df_address[id_mask]
        df_address_result = df_address_id['address']
        address_result = df_address_result.values[0]
        # 從前面的風險 list 裡面判斷風險等級
        if id in list_high_risk :
            risk = 3
        elif id in list_medium_risk:
            risk = 2
        else:
            risk = 1
        # 依照 react 需要的格式設計 
        each_address_risk = {
            'location': address_result,
            'risk': risk
        }
        risk_list.append(each_address_risk)
    
    #json_risk = jsonify(risk_list)
    json_data = json.dumps(risk_list, ensure_ascii=False)
    #json_risk = jsonify(json_data)
    response = Response(json_data, content_type='application/json; charset=utf-8')
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == '__main__':
   app.run(host='0.0.0.0',port=8000,debug=True)
