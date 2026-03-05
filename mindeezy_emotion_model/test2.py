from transformers import pipeline, RobertaForSequenceClassification, RobertaTokenizerFast

model_path = "./"
model = RobertaForSequenceClassification.from_pretrained(model_path)
tokenizer = RobertaTokenizerFast.from_pretrained(model_path, local_files_only=True)
classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)

texts = [
    "I am very sad.", # 0?
    "I feel joyful.", # 1?
    "I am so angry right now.", # 3?
    "I am feeling afraid.", # 4?
    "Wow, this is a surprise!", # 5?
    "I love you so much." # 2?
]

for t in texts:
    print(t, classifier(t))
