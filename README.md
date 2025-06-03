# 📝 Real-Time Collaborative Document Editor — Official YapZone
**COMPANY:** CODTECH IT SOLUTIONS  
**NAME:** DISHA J KOTIAN  
**INTERN ID:** CT04DN1299  
**DOMAIN:** FULL STACK WEB DEVELOPMENT  
**DURATION:** 4 WEEEKS  
**MENTOR:** NEELA SANTOSH


> A real-time collaborative document editing web app inspired by Google Docs, built with modern full-stack technologies.


---

### 🚀 Project Overview

The **Real-Time Collaborative Document Editor** (Official YapZone) is an advanced web application designed to allow **multiple users** to create, edit, and manage documents **simultaneously** in real-time. Leveraging powerful technologies like **Y.js**, **TipTap**, and **Socket.IO**, this editor ensures **live synchronization**, **conflict-free collaboration**, and a **responsive, intuitive interface**.

Built under the **Full Stack Web Development** domain at **CODTECH IT SOLUTIONS**.

- **Name:** DISHA J KOTIAN  
- **Intern ID:** CT04DN1299  
- **Duration:** 4 Weeks  
- **Mentor:** NEELA SANTOSH  

---

### ✨ Key Features

#### 🔄 Real-Time Collaboration
- **Live Document Syncing**: Instant updates across all users' screens.
- **Multi-User Editing**: View collaborators' cursors and changes in real time.
- **Awareness API**: See who is online and their current editing position.
- **Conflict-Free Editing**: Ensured by **CRDTs (Conflict-Free Replicated Data Types)** via **Y.js**.

#### 🖋️ Rich Text Editing
- **WYSIWYG Interface**: Seamless What-You-See-Is-What-You-Get editing experience.
- **Formatting Tools**: Bold, italic, underline, headings, bullet lists, links, etc.
- **Undo/Redo Stack**: Full edit history navigation.
- **Auto Save**: Edits are saved frequently to prevent data loss.

#### 📁 Document Management
- **Create/Edit/Delete Documents**
- **Section and Paragraph Handling**
- **Dynamic Structure**: Organized content blocks and lists.

---

### ⚙️ Tech Stack

#### 🧠 Backend
- **Node.js** – Server runtime environment
- **Express.js** – RESTful API routing
- **Socket.IO** – Real-time WebSocket communication

#### 🖥️ Frontend
- **TipTap Editor** – Based on ProseMirror, for rich text editing
- **Y.js** – CRDT framework for shared editing
- **Awareness Protocol** – For user presence and cursor tracking

#### 🎨 Styling
- **Google Fonts**: `Press Start 2P` for retro aesthetics
- **Custom CSS**: Gradients, shadows, and vibrant UI effects

---

### 🛠️ How It Works

1. **Server Initialization**: Hosts frontend and sets up real-time communication via Socket.IO.
2. **Client Connection**: Users connect via browser, triggering a persistent socket.
3. **Real-Time Sync**: Edits are shared instantly across clients via WebSocket messages.
4. **Broadcast Mechanism**: Server receives an update → broadcasts to all clients → updates appear in real time.

---
### 📸 output

![Real-Time Editor Screenshot](https://github.com/DishaKotian/productivity-tracker/blob/main/IMG-20250527-WA0003.jpg?raw=true)
### 🧪 Getting Started

#### 📥 Installation
```bash
git clone https://github.com/yourusername/official-yapzone.git
cd official-yapzone
npm install
npm start
