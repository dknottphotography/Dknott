import re

path = 'c:/Users/Balu/Desktop/Dknott/src/data/images.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

descriptions = {
    "pooja-sai-charan": "A timeless celebration of heritage and love. We captured every vibrant ritual and quiet moment between Pooja and Sai Charan against a backdrop of rich traditions.",
    "anuhya-abhinav": "From the joyous pre-wedding festivities to the grand traditional ceremony, Anuhya and Abhinav's journey was a beautiful testament to family bonds and enduring love.",
    "ellen-yashwanth": "A deeply personal and heartfelt union. Ellen and Yashwanth's intimate celebration allowed us to focus on the raw, unspoken emotions shared with their closest loved ones.",
    "kavya-goutham": "Elegance met tradition in this breathtaking wedding. We loved documenting the authentic smiles and vibrant colors that defined Kavya and Goutham's special day.",
    "mahesh-mounika": "A grand tapestry of culture and joy. Mahesh and Mounika's traditional wedding was filled with energetic celebrations, sacred vows, and unforgettable moments.",
    "manasa-gokul": "Warm, soulful, and intimately beautiful. Manasa and Gokul chose to celebrate their love surrounded by a tight-knit circle, creating incredibly touching and candid memories.",
    "poojitha-pranay": "A perfect harmony of deep-rooted customs and modern romance. We captured the profound connections and jubilant festivities of Poojitha and Pranay's traditional celebration.",
    "reshma-prakash": "Vibrant hues and sacred traditions marked the beginning of Reshma and Prakash's forever. It was an honor to frame the authentic joy radiating from their families.",
    "sindhuja-akhil": "An epic romance set against a stunning destination backdrop. Sindhuja and Akhil's wedding was a cinematic adventure filled with breathtaking vistas and profound love."
}

def replacer(match):
    gid = match.group(1)
    desc = descriptions.get(gid, "A beautiful wedding story captured by Dknott.")
    return f'id: "{gid}",\n    title: "{match.group(2)}",\n    location: "{match.group(3)}",\n    tags: "{match.group(4)}",\n    description: "{desc}",'

# Match the block up to description
pattern = re.compile(r'id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*location:\s*"([^"]+)",\s*tags:\s*"([^"]+)",\s*description:\s*"A beautiful wedding story captured by Dknott.",')

new_content = pattern.sub(replacer, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
