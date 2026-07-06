#!/usr/bin/env python3
"""Parse tn.md/tn2.md format into data.json chunks (40 questions each)."""
import json, re, os

def parse_mc(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = []
    blocks = re.split(r'\n\s*\n', content)
    
    for block in blocks:
        lines = [l.strip() for l in block.strip().split('\n') if l.strip()]
        if not lines:
            continue
        
        q_line = None
        opts = []
        for line in lines:
            m = re.match(r'^Câu\s+\d+[\.\:]\s*(.*)', line)
            if m:
                q_line = m.group(1).strip()
                continue
            m2 = re.match(r'^([A-D])[\.\)]\s*(.*)', line)
            if m2:
                opts.append((m2.group(1), m2.group(2).strip()))
        
        if q_line and len(opts) >= 2:
            opts.sort(key=lambda x: x[0])
            selections = [opt[1] for opt in opts]
            questions.append({
                "question": q_line,
                "selection": selections,
                "answer": None
            })
    
    return questions

def chunk_and_save(questions, output_dir, start_index=1):
    chunk_size = 40
    total = len(questions)
    num_chunks = (total + chunk_size - 1) // chunk_size
    
    files_created = []
    for i in range(num_chunks):
        start = i * chunk_size
        end = min(start + chunk_size, total)
        chunk = questions[start:end]
        
        idx = start_index + i
        filename = "data.json" if idx == 1 else f"data{idx}.json"
        
        filepath = os.path.join(output_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(chunk, f, ensure_ascii=False, indent=4)
        files_created.append((filename, len(chunk)))
    
    return files_created, start_index + num_chunks

if __name__ == '__main__':
    ref_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ref', 'raw')
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src', 'asset')
    os.makedirs(output_dir, exist_ok=True)
    
    next_idx = 1
    all_files = []
    
    for fname in ['tn.md', 'tn2.md']:
        filepath = os.path.join(ref_dir, fname)
        if not os.path.exists(filepath):
            continue
        questions = parse_mc(filepath)
        files, next_idx = chunk_and_save(questions, output_dir, next_idx)
        all_files.extend(files)
        print(f"{fname}: {len(questions)} questions -> {files}")
    
    print(f"\nTotal:")
    for name, count in all_files:
        print(f"  {name}: {count} questions")
