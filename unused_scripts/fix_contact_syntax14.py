path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('.contact-hero {')
chunk_before = c[idx-30:idx]
# find the backtick in chunk_before
tick_idx = chunk_before.find('')
if tick_idx != -1:
    c = c[:idx-30 + tick_idx] + c[idx-30 + tick_idx + 1:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
