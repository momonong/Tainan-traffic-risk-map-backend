from flask import Flask, request
from datetime import datetime
import pandas as pd
import json

app = Flask(__name__)

@app.route('/api/myfunction', methods=['GET'])
def my_function():
    # 分別取得「行政區」「天氣」「時間」
    # http://yourdomain.com/api/myfunction?district=value1&weather=value2
    # get_district = request.args.get('district')
    # get_weather = request.args.get('weather')
    get_district = '永康區'
    get_weather = '晴'
    current_time = datetime.now()
    hour = current_time.hour

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
    return str(list_low_risk[0])

if __name__ == '__main__':
   app.run(host='0.0.0.0',port=8000,debug=True)
