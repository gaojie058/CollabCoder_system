import sys
import json
import torch
from transformers import AutoTokenizer, AutoModel
import torch.nn.functional as F


def cal_sim(text1, text2, model, device):
    # Encode text1 and text2 using the tokenizer
    text1_token_ids = tokenizer.encode(text1, add_special_tokens=True)
    text2_token_ids = tokenizer.encode(text2, add_special_tokens=True)

    # Convert token IDs to PyTorch tensors and move to specified device
    text1_tensor = torch.tensor([text1_token_ids]).to(device)
    text2_tensor = torch.tensor([text2_token_ids]).to(device)

    # Get the Sentence-BERT embeddings for text1 and text2
    with torch.no_grad():
        text1_embeddings = model(text1_tensor)[0][:, 0, :]  # [CLS] token embedding
        text2_embeddings = model(text2_tensor)[0][:, 0, :]  # [CLS] token embedding

    # Calculate cosine similarity between text1 and text2
    cosine_sim = F.cosine_similarity(text1_embeddings, text2_embeddings, dim=-1).cpu().numpy()

    # Return the cosine similarity score
    return cosine_sim


def data_preprocess():
    
    # Read the data from stdin
    data = sys.stdin.read()

    # Parse the data as JSON
    wordsList = json.loads(data)

    wordsDict = {}
    for item in wordsList:
        sentence_id = item["sentence_id"]
        word1 = item["word1"]
        word2 = item["word2"]
        wordsDict[sentence_id] = {"word1": word1, "word2": word2}
    
    # wordsDict = {0: {
    #     'word1': 'Brain appreciates complexity.',
    #     'word2': 'Electrical signals interpreted.'      
    # }}
    
    # wordsDict = {0: {
    #     'word1': 'Good food, nice people.',
    #     'word2': 'Super Smash Brothers, Nintendo 64.'      
    # }}
    
    print(wordsDict)
    return wordsDict


def cal_all_sim_and_save(model, device):
    wordsDict = data_preprocess()

    count = 0
    total = len(wordsDict)

    # Loop through the dictionary 'wordsDict' and calculate the similarity between 'word1' and 'word2'
    for key, value in wordsDict.items():
        word1 = value['word1']
        word2 = value['word2']
        sim = cal_sim(word1, word2, model, device)
        sim = round(float(sim), 4)
        wordsDict[key]['sim_score'] = sim

        count += 1
        progress = int(count / total * 100)
        print(f"Calculate {count} in {total} - Progress: {progress}% - Similarity score for {word1} and {word2}: {sim}")

    return wordsDict


# Specify device
device = torch.device("cuda:1" if torch.cuda.is_available() else "cpu")

# Load pre-trained Sentence-BERT model and tokenizer on specified device
# download from https://github.com/UKPLab/sentence-transformers
model_path = 'sentence-transformers/bert-base-nli-mean-tokens'
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModel.from_pretrained(model_path).to(device)

print("Tokenizer and Sentence-BERT model are loaded...Start Calculating")

# Cal Sim
wordsDict = cal_all_sim_and_save(model, device)

# Output
print(json.dumps(wordsDict))
