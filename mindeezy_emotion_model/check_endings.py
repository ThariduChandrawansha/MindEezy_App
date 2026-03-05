filepath = r"c:\Users\Savi Aby\Desktop\Tharindu Final\MindEezy_App\frontend\src\pages\CustomerProfile.jsx"

with open(filepath, "rb") as f:
    raw = f.read()

# Check what line endings exist
crlf_count = raw.count(b'\r\n')
lf_count = raw.count(b'\n') - crlf_count
print(f"CRLF: {crlf_count}, LF-only: {lf_count}")

idx = raw.find(b"Days of Week Header")
print(repr(raw[idx-250:idx+50]))
