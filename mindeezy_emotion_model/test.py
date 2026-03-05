from transformers import pipeline, RobertaForSequenceClassification, RobertaTokenizerFast
import sys

model_path = "./"
try:
    model = RobertaForSequenceClassification.from_pretrained(model_path)
    tokenizer = RobertaTokenizerFast.from_pretrained(model_path, local_files_only=True)
    classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)
    res = classifier("I am feeling really happy today!")
    print(res)
    res2 = classifier("I am very sad and depressed.")
    print(res2)
    res3 = classifier("I am so angry at this situation!")
    print(res3)
except Exception as e:
    print(f"Error: {e}")
