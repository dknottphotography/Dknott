import os
import glob

pages_dir = 'c:/Users/Balu/Desktop/dknott/src/pages'
files = glob.glob(os.path.join(pages_dir, '*.jsx'))

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Update Footer Location
    content = content.replace('<li>India</li>', '<li>Hyderabad, India</li>')
    content = content.replace('<li>Bangalore, India</li>', '<li>Hyderabad, India</li>')
    
    # 2. Update Email
    content = content.replace('hello@dknottphotography.com', 'dknottphotography3@gmail.com')
    
    # 3. Update Phone in text
    content = content.replace('+91 00000 00000', '+91 91107 08256')
    content = content.replace('+910000000000', '+919110708256')
    
    if content != original_content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {os.path.basename(file)}")
