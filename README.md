# FilesPad 📁⚡

> **Secure, Ephemeral & Frictionless File and Text Sharing via Disposable Custom Spaces.**

[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Framework-Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Security](https://img.shields.io/badge/Security-AES--256%20%26%20SHA--256-red?style=for-the-badge&logo=shield)](https://github.com/)

---

## 🌟 Overview

**FilesPad** is a privacy-first web application designed for fast, hassle-free file transfers and scratchpad text sharing across devices without requiring user accounts or sign-ups. 

Whether you need to send a document from your laptop to a mobile phone, temporarily store code snippets, or share confidential files with a team member, FilesPad creates disposable, password-protected **"Spaces"** that automatically self-destruct after a specified duration.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🔑 **Account-Free Spaces** | Create or enter any custom space instantly using a simple name/passcode without registration. |
| 🔐 **Lock Pad Protection** | Add a secondary lock passcode to confidential spaces for an extra layer of access control. |
| ⏳ **Self-Destructing Files** | Set custom retention periods (1 to 7 days). Expired content is automatically purged by a background cleanup worker. |
| 🛡️ **AES-256 Encryption** | Sensitive filenames and TextPad content are encrypted at rest using AES-256-CBC, while space codes are securely hashed via SHA-256 HMAC. |
| 📝 **Built-in TextPad** | Integrated collaborative scratchpad to store, edit, and share notes, links, or snippets within your space. |
| 📱 **Instant QR Code Sharing** | Generate dynamic QR codes for uploaded files to enable effortless mobile scan-and-download. |
| 👁️ **File Previews & Direct Downloads** | Easily view files inline or trigger instant downloads directly from the dashboard. |
| 🗑️ **Permanent Destruction** | Delete individual files immediately or purge the entire space and its contents with one click. |

---

## 🔄 How It Works

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 1. Enter Space  │ ───►  │ 2. Upload/Notes │ ───►  │ 3. Share & Sync │
│ Passcode/Name   │       │ Set Auto-Delete │       │ Link or QR Code │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                                             │
                                                             ▼
                                                    ┌─────────────────┐
                                                    │ 4. Auto-Purge   │
                                                    │  After Expiry   │
                                                    └─────────────────┘
```

1. **Access a Space**: Enter an existing space name or create a brand new one. Optional secondary locking provides enhanced security.
2. **Upload & Manage**: Drag and drop files (up to 100MB) and pick an expiration limit (1 to 7 days).
3. **Use TextPad**: Write or update shared text notes that persist securely within the space.
4. **Share Effortlessly**: Copy the direct file link or display a QR code for mobile devices to scan.
5. **Automatic Cleanup**: Once the expiration timer expires, the background cron engine permanently removes the files.

---

## 🔒 Security & Privacy First

- **Data Encryption at Rest**: File names, original upload metadata, and TextPad notes are encrypted using AES-256-CBC standard before storage.
- **Hashed Identifiers**: Space names and security passcodes are hashed with SHA-256 HMAC, preventing unauthorized indexing or lookup.
- **Zero Logging & Tracking**: No user tracking, no personal identifiable information (PII) collection, and no persistent user profile database.
- **Automated Expire & Purge**: Scheduled tasks run every minute to ensure expired resources are permanently deleted from database memory and storage.

---

## 🛠️ Technology Stack

FilesPad is built with a modern full-stack JavaScript architecture:

* **Frontend**: React 19, Vite, React-Bootstrap, React Icons, Axios, React Router.
* **Backend**: Node.js, Express.js, Multer (Memory Storage), Crypto (AES-256-CBC & SHA-256), Node-Cron.
* **Database**: MongoDB & Mongoose Object Data Modeling.
* **UI Design**: Dark-mode glassmorphism interface with responsive controls.

---

## 🚀 Deployment Status

FilesPad is live and deployed on **Render**, providing fast and reliable hosting for both client interfaces and API services.

---

<p center align="center">
  <i>Designed for quick, secure, and hassle-free file sharing across all your devices.</i>
</p>
