import os, glob

pages_dir = r'c:\Users\Balu\Desktop\Dknott\src\pages'
for filepath in glob.glob(os.path.join(pages_dir, '*.jsx')):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # fix the padding
    new_content = content.replace('.nav-row { padding: 1.5rem 0; }', '.nav-row { padding: 0.5rem 0; }')
    
    # remove the marginTop: -4px from logo
    new_content = new_content.replace('"marginTop":"-4px"', '')
    # clean up empty style object if it just had marginTop or trailing commas
    new_content = new_content.replace(',"marginTop":"-4px"', '')
    new_content = new_content.replace('style={{"display":"flex","alignItems":"center",}}', 'style={{"display":"flex","alignItems":"center"}}')
    new_content = new_content.replace('style={{"display":"flex","alignItems":"center", }}', 'style={{"display":"flex","alignItems":"center"}}')
    new_content = new_content.replace('style={{"display":"flex","alignItems":"center","marginTop":"-4px"}}', 'style={{"display":"flex","alignItems":"center"}}')

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {filepath}')
