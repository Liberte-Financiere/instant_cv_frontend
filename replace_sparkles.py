import os
import re

dirs = ['app', 'components']

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'Sparkles' not in content:
        return
        
    # Replace the JSX tags and object references
    new_content = re.sub(r'<Sparkles\b', '<Wand2', content)
    new_content = re.sub(r'\bicon=\{Sparkles\}', 'icon={Wand2}', new_content)
    new_content = re.sub(r'\bicon:\s*Sparkles\b', 'icon: Wand2', new_content)
    
    # Handle the import
    import_match = re.search(r"import\s+\{([^}]+)\}\s+from\s+['\"]lucide-react['\"]", new_content)
    if import_match:
        imports_str = import_match.group(1)
        imports = [i.strip() for i in imports_str.split(',')]
        
        if 'Sparkles' in imports:
            imports.remove('Sparkles')
            if 'Wand2' not in imports:
                imports.append('Wand2')
                
            new_imports_str = ', '.join(imports)
            # Replace the whole import block content
            new_content = new_content[:import_match.start(1)] + new_imports_str + new_content[import_match.end(1):]
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {filepath}")

for d in dirs:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file(os.path.join(root, file))

