import requests

try:
    res = requests.post("http://localhost:5001/predict_emotion", json={"text": "I am so angry right now!"})
    print(res.json())
except Exception as e:
    print(e)
