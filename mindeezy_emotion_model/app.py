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
    text = data.get('text', '').strip()
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Production Safety Layer: Detect Crisis Keywords
    crisis_keywords = ['suicide', 'kill myself', 'self-harm', 'end my life', 'harm myself', 'want to die', 'cutting']
    is_crisis = any(kw in text.lower() for kw in crisis_keywords)

    if is_crisis:
        return jsonify({
            'emotion': 'crisis',
            'score': 1.0,
            'response': "I'm concerned about what you're sharing. Please know that you're not alone and there is help available right now. 💙\n\n**Please reach out to a crisis line immediately:**\n📞 **1926** (National Mental Health Helpline)\n📞 **1333** (CCC Line)\n\nYou are valuable, and things can get better. Please talk to someone.",
            'safety_alert': True
        })

    try:
        # Run emotion prediction
        res = classifier(text)
        prediction = res[0]
        label = prediction['label']
        emotion = label_map.get(label, "unknown")
        
        # Expert AI Response Logic
        # In a real production environment, this would hit an LLM like Gemini or GPT-4.
        # Here we use a high-quality expert system matched to the detected emotion.
        
        response_map = {
            "anger": "I can feel the intensity of your words. It's completely valid to feel angry when things feel unfair or overwhelming. 💙\n\nRight now, try to find a safe way to let that energy out—maybe through physical movement or writing it all down without holding back. Remember, your anger is a signal that something matters to you. What do you feel is the root cause of this frustration?",
            "fear": "It sounds like anxiety is taking up a lot of space for you right now. That 'tight' feeling in the chest or racing thoughts can be so draining. 🌿\n\nLet's try one thing: name three things in the room that are the color blue. This helps pull your mind back from 'future-worrying' to the present safety. You've handled hard things before, and you can handle this moment too. What feels most uncertain right now?",
            "joy": "This is wonderful to hear! 🌟 It's so important to pause and really acknowledge these moments of light. \n\nHow can you nourish this feeling? Perhaps share it with someone you care about or do something creative while you have this positive energy. What's the best part of what you're experiencing today?",
            "love": "Warmth and connection are so vital for our well-being. 💝 It sounds like you're in a very heart-centered place. \n\nWhether it's love for a person, a pet, or even just a sense of peace with yourself, cherish it. These connections are what build our resilience. Is there someone you're feeling especially grateful for today?",
            "sadness": "I hear the heaviness in your message, and I want you to know it's okay to not be okay right now. 💙 \n\nSadness isn't something to 'fix' immediately—sometimes it just needs to be felt. Be extra gentle with yourself today. Maybe a warm drink, a soft blanket, or just allowing yourself to rest. If you felt comfortable, could you share a bit more about what's weighing on your mind?",
            "surprise": "Life certainly knows how to be unexpected! 🌀 When things change suddenly, it's natural to feel a bit disoriented or shocked.\n\nTake a slow breath. You don't have to have all the answers right this second. Focus on the very next small thing you can control. How has this surprise changed your perspective on things?"
        }
        
        # For production-ready feel, we return 'response' (chat) and 'guide' (summary)
        # We use the same content for both here, as they are both expert AI advice.
        ai_output = response_map.get(emotion, "Thank you for sharing that with me. I'm listening. Could you tell me more about how that makes you feel?")
        
        return jsonify({
            'emotion': emotion,
            'score': float(prediction['score']),
            'response': ai_output,
            'guide': ai_output,
            'safety_alert': False
        })
        
    except Exception as e:
        return jsonify({
            'emotion': 'unknown',
            'response': "I'm here to listen, but I had a small technical hiccup. Could you tell me more about what's on your mind?",
            'error': str(e)
        })

if __name__ == '__main__':
    # Use threaded=True for better concurrent handling in dev/prod
    app.run(host='0.0.0.0', port=5001, threaded=True)

