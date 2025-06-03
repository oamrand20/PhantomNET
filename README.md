
# 🚩 Welcome to PhantomNet

**PhantomNet** is a Adaptive C&C Server for Advanced Cyber Operations redefining the landscape of Red and Blue Team operations. Built with a modern tech stack and designed for flexibility, PhantomNet integrates machine learning and offers a sleek user interface for effortless control and real-time engagement.

---

## ✨ Features

- 🖥️ **Modern Web Interface** – Built with Next.js for speed, accessibility, and usability.
- 🧩 **Modular & Flexible Code** – Easy to extend and customize.
- 🚀 **Up-to-Date Commands** – Supports common and advanced operations.
- 🎯 **Dual Use Framework** – Suitable for both Red and Blue Team operations.

---

## 🛠️ Built By

**Developers:**
- Omar Atieh  
- Eman Al-Qadi
- Abdullah Assoli 
- Shahed Sharatqa  

---

## ⚙️ How It Works

1. **Payload Delivery**  
   Use the web interface to send phishing emails or manually deliver the payload (e.g., via Phishing email).

2. **Victim Connection**  
   Once the payload runs on the target machine, it reports the IP back to the control server.
   `Persistent Reverse HTTPS Backdoor` 

3. **Command Access**  
   Paste the victim’s IP into the CLI page:  
   `yourDomain/admin/cli`  
   You now have reverse shell access.
   Shell Type:
   ` Python Reverse Shell subprocess` 

4. **Available Actions**
   - Scan Netowrk
   - Ransomware (Encrypt/Decrypt files)
   - Capture Screenshots
   - Activate Webcam
   - Start/Stop Keylogger & Upload Logs
   - Upload/Download Files
   - Execute Custom Commands
   - System Reconnaissance
   - Clear Traces
   - Sysinfo and VulnScan
   - Add/Extend Functionalities



---

## 🧩 Architecture Overview

PhantomNet consists of **4 components**:

### 1️⃣ Client Server (Front-End)

- **Tech Stack**: Next.js, Redux
- **Role**: Web-based control panel
- **Features**:
  - Authentication (Login/Register)
  - Admin Dashboard
  - CLI for reverse shell commands
  - File Management
  - Global i18n Support (Arabic/English)

**Directory Structure**:
```
root/client
├── src/
│   ├── pages/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── _app.tsx
│   │   ├── index.tsx
│   │   └── _document.js
│   ├── slice/
│   ├── styles/
│   ├── types/
│   ├── store.ts
│   └── transition.ts
├── .env
```

**How to Run**:
```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Access via browser
http://localhost:3000
```

---

### 2️⃣ Database & Storage Server (Back-End)

- **Tech Stack**: Laravel (PHP)
- **Role**: Manages data, users, and files
- **Features**:
  - User Auth
  - Server & File Management
  - Full Database CRUD Operations

**Directory Structure**:
```
root/server
├── app/
│   └── Http/
│       └── Controllers/
├── .env
└── [Laravel Default Files]
```

**How to Run**:
```bash
# Install dependencies
composer install

# Create a new database (e.g., PhantomNet)

# Update .env with DB credentials

# Run migrations and seed database
php artisan migrate:fresh --seed

# Start server
php artisan serve

# Access via browser
http://localhost:8000
```

---

### 3️⃣ Control Server (C2 Backend)


Tech Stack: Python 3.10+, FastAPI, Nmap, Gunicorn
Role: Central brain of PhantomNet – handles bot registration, command distribution, file transfers, and vulnerability scans.

- **Features**:
  - RESTful API endpoints to register bots and send commands
  - Network scanning using Nmap
  - CVE lookup integration via circl.lu API
  - Encrypted key exchange (ECDH + AES)
  - File upload/download with automatic re-routing to central DB
  - Integration-ready with browser-based CLI panel

Directory Structure:
```
root/control-server
├── Server_C2.py
├── uploads/
```
---
How to Run:

```
# open port 5000
sudo ufw allow 5000

#install python library
pip install fastapi uvicorn python-multipart
pip install beautifulsoup4 lxml

#run server
python Server_C2.py

```

### 4️⃣ Victim Bot Payload


Tech Stack: Python 3.10+, PyInstaller (for EXE conversion)
Role: Connects to the C2 backend and executes commands sent by the operator.

- **Features**:
  - Persistent Reverse Shell (HTTPS)
  - Keylogger (Windows/Linux supported)
  - Screenshot and Webcam capture
  - System information exfiltration
  - Upload/Download functionality
  - Trace clearing
  - Cross-platform auto-install of requirements

Directory Structure:
```
root/bot
├── SecurityInfo.py
└── resources/
```
How to Run (Dev Mode):

# On Windows (after setting SERVER_URL):
```
python SecurityInfo.py
```
How to Compile to non console (Windows):
```
just rename the file to `SecurityInfo.pyw`
and run it by click or open Run (Win+R)
pythonw "C:\Users\omar\Desktop\SecurityInfo.pyw"
```
Note: Make sure SERVER_URL in the bot script points to your C2 server (e.g., https://192.168.0.22:5000).



---

## 📡 Server Communication

All three main components (Client, Backend, Control) communicate through **RESTful APIs**. The fourth component (Victim Bot) connects to the Control Server upon execution.

---

## ✅ Prerequisites

### Front-End
- Node.js
- npm

### Back-End
- PHP
- Composer
- MySQL or compatible DB

---

## 📍 Final Notes

- All credentials and sensitive variables should be set in `.env` files.
- Be cautious when editing `_document.js` – it controls the PWA behavior.
- Extend commands and modules easily via the CLI admin page.

---

## 📬 Contact

Feel free to reach out to the developers or contribute to PhantomNet. We welcome collaboration and innovation.

---

> ⚠️ **Disclaimer**: PhantomNet is developed for ethical hacking, red team operations, and cybersecurity research. Any unauthorized or malicious use is strictly prohibited.
