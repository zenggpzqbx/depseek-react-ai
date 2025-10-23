import axios from "axios";
import KeyManager from "@/utils/KeyManager.js";
function getWeatherInfo(city) {
  return axios.get(`https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=${KeyManager.WeatherKey}`)
}
function getWeatherTool(){
  return {
    "type": "function",
    "function": {
      "name": "getWeatherInfo",
      "strict": true,
      "description": "查询某个地方的天气信息，需要用户提供地名",
      "parameters": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string",
            "description": "地名",
          }
        },
        "required": ["city"],
        "additionalProperties": false
      }
    }
  }
}

export default {getWeatherInfo, getWeatherTool};
