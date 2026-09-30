with open(r'c:\Users\Balu\Desktop\Dknott\src\pages\Home.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# find testimonials array and handleTestiChange
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if line.strip() == "const testimonials = [":
        start_idx = i
    if line.strip() == "};" and "setTestiFading(false);" in "".join(lines[i-5:i]):
        end_idx = i

if start_idx != -1 and end_idx != -1:
    extracted = lines[start_idx:end_idx+1]
    
    # delete them from original location
    del lines[start_idx:end_idx+1]
    
    # find where to insert them
    insert_idx = -1
    for i, line in enumerate(lines):
        if "const [testiFading, setTestiFading] = useState(false);" in line:
            insert_idx = i + 1
            break
            
    if insert_idx != -1:
        lines = lines[:insert_idx] + ["\n"] + extracted + ["\n"] + lines[insert_idx:]
        with open(r'c:\Users\Balu\Desktop\Dknott\src\pages\Home.jsx', 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("Successfully moved testimonials block!")
    else:
        print("Could not find insertion point.")
else:
    print("Could not find start or end index.")
