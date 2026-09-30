import json
import os

file_path = 'c:/Users/Balu/Desktop/dknott/package.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Revert scripts
if 'scripts' in data:
    data['scripts']['dev'] = 'vite'
    data['scripts'].pop('dev:frontend', None)
    data['scripts'].pop('dev:backend', None)

# Clean up dependencies
deps_to_remove = ['cors', 'dotenv', 'express', 'nodemailer']
for dep in deps_to_remove:
    data.get('dependencies', {}).pop(dep, None)

dev_deps_to_remove = ['concurrently', 'nodemon']
for dep in dev_deps_to_remove:
    data.get('devDependencies', {}).pop(dep, None)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("package.json cleaned up!")
