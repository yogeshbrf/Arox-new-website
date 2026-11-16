import json

transcript_path = r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.system_generated\logs\transcript.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        content = str(data.get('content', ''))
        thinking = str(data.get('thinking', ''))
        
        for text in [content, thinking]:
            if 'transition' in text and ('card' in text or 'slit' in text or 'speed' in text):
                # find matches
                for m in ['transition: flex', 'animation speed', 'revealing', 'cubic-bezier', '0.65s', '0.5s', '0.8s']:
                    if m in text:
                        idx = text.find(m)
                        print(f"Match [{m}] at step {data.get('step_index')}:")
                        print(text[max(0, idx-100):min(len(text), idx+200)])
                        print('='*30)
                        break

