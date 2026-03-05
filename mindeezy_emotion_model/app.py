from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, RobertaForSequenceClassification, RobertaTokenizerFast

app = Flask(__name__)
CORS(app) # Allow cross-origin requests

model_path = "./"
model = RobertaForSequenceClassification.from_pretrained(model_path)
tokenizer = RobertaTokenizerFast.from_pretrained(model_path, local_files_only=True)
classifier = pipeline("text-classification", model=model, tokenizer=tokenizer, truncation=True, max_length=512)

label_map = {
    "LABEL_0": "anger",
    "LABEL_1": "fear",
    "LABEL_2": "joy",
    "LABEL_3": "love",
    "LABEL_4": "sadness",
    "LABEL_5": "surprise"
}

@app.route('/predict_emotion', methods=['POST'])
def predict_emotion():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Run prediction
    try:
        # Pipeline handles truncation max length 512
        res = classifier(text)
        prediction = res[0]
        label = prediction['label']
        emotion = label_map.get(label, "unknown")
        
        # Build out a larger summary guide string
        guide_map = {
            "anger": "It seems like you've been experiencing frustration or anger lately. This is a powerful emotion that often signals when our boundaries have been crossed or when things feel unfair. Try redirecting this energy into a productive outlet like exercise or assertive communication. Taking deep breaths and stepping away from stressful situations can also help you regain control.",
            "fear": "You've expressed feelings of anxiety or fear. It's completely normal to feel this way when facing uncertainty. To manage this, focus on grounding exercises like the 5-4-3-2-1 technique. Break complex tasks down into smaller, manageable steps so you don't feel overwhelmed, and try to remind yourself of past challenges you've successfully navigated.",
            "joy": "You're experiencing a period of joy and positivity! This is an excellent time to channel this energy into your creative passions, socialize with loved ones, or tackle new, exciting goals. Capitalize on this productive mood by setting long-term plans and practicing gratitude so you can reflect on this period during tougher times.",
            "love": "You're demonstrating a lot of affection and loving energy. Focusing on positive connections is fantastic for your mental health. Use this period to strengthen your relationships, mentor others, or engage in meaningful self-care. Expanding your compassion to your community or volunteer work can also be particularly fulfilling right now.",
            "sadness": "Your entries reflect a sense of sadness or being down. It's okay to let yourself feel this way, but be gentle with yourself. Prioritize basic self-care like getting enough sleep, eating well, and reaching out to supportive friends or a counselor. Sometimes breaking your routine with a simple walk in nature can slightly lift the fog.",
            "surprise": "You've encountered some unexpected situations leading to feelings of surprise or shock. When life throws curveballs, it's best to take a moment to pause and reorient yourself. Focus on what you can control, adapt your plans gracefully, and remember that unexpected changes can sometimes lead to the most creative and beneficial outcomes."
        }
        
        return jsonify({
            'emotion': emotion,
            'score': float(prediction['score']),
            'guide': guide_map.get(emotion, "Maintain your journaling to help understand your feelings better.")
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
