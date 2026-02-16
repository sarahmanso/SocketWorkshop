# Socket Workshop Project

פרויקט זה נבנה במסגרת סדנה שאני ומישמיש מעבירות למחזור הצעיר מאיתנו בנושא עבודה עם Sockets ו-Real-Time Communication.
<33
במהלך הסדנה נלמד:
- מה זה Socket
- איך מתבצעת תקשורת בזמן אמת
- איך מחברים Backend ו-Frontend בצורה חיה

האתר שבנינו בפרויקט זה הוא גרסה בסיסית **ללא שימוש ב-Sockets**, והוא ישמש כבסיס שעליו הצוות יבנו, ילמדו ויוסיפו תמיכה ב-Sockets במהלך הסדנה.

המטרה היא להבין קודם ארכיטקטורה רגילה, ורק לאחר מכן לשדרג אותה לתקשורת בזמן אמת.

---
**These are the commands required to set up the development environment and run
the project locally (Backend with FastAPI and Frontend with React/Vite)**

open terminal
cd Backend
python -m venv env
env/Scripts/activate
pip install -r requirements.txt
then run:
uvicorn main.app - - reload

open another terminal
cd Frontend
npm install
npm run dev


**.env file in Backend Folder:**

DATABASE_URL=postgresql://postgres:Your Password@localhost:5432/socket
JWT_SECRET=hello
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 60
SECRET_KEY=socket123



**.gitignore file :**
# Environment variables
.env
.env.local
.env.*.local
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
# IDEs
.vscode/
.idea/
*.swp
*.swo
# Database
*.db
*.sqlite3



**db query:**
In pgAdmin, open a new database on your server by clicking right click on the server
Name the database **socket**, then create it
Right-click on the database you just created and click the query tool
Paste the following query and run it:


- USERS TABLE
CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(100) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'user'))
);

-- ORDERS TABLE
CREATE TABLE orders (
id SERIAL PRIMARY KEY,
name VARCHAR(150) NOT NULL,
description TEXT,
user_id INTEGER NOT NULL,
is_approved BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_orders_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE
);

-- ORDER ACTIVITY TABLE
CREATE TABLE order_activity (
id SERIAL PRIMARY KEY,
order_id INTEGER NOT NULL,
user_id INTEGER NOT NULL,
activity_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_activity_order
FOREIGN KEY (order_id)
REFERENCES orders(id)
ON DELETE CASCADE,

CONSTRAINT fk_activity_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE
);.
