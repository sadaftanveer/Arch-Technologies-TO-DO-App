 TaskFlow — To-Do List Web Application

A full-stack To-Do List web application developed as part of the **Arch Technologies Full Stack Development Internship**.

TaskFlow allows users to create, manage, organize, search, filter, sort, edit, complete, and delete tasks through a clean and responsive interface.


 Features

* Add new tasks
* Edit existing tasks
* Delete tasks with confirmation
* Mark tasks as completed or active
* Task descriptions
* Due dates
* Priority levels

  * Low
  * Medium
  * High
* Task categories

  * Work
  * Study
  * Personal
  * Other
* Search tasks
* Sort tasks by:

  * Newest
  * Oldest
  * Due date
  * Priority
* Filter tasks by:

  * All
  * Active
  * Completed
  * Overdue
* Clear all completed tasks
* Automatic overdue detection
* Task progress tracking
* Total, active, completed, and overdue task statistics
* Backend validation
* Django Admin interface
* REST API powered by Django REST Framework
* Pakistan Standard Time ("Asia/Karachi") for task timestamps
* Responsive design for different screen sizes



 Technologies Used

 Frontend

* HTML5
* CSS3
* JavaScript
* VS Code Live Server

 Backend

* Python
* Django
* Django REST Framework
* django-cors-headers


 Database

* SQLite


 Project Structure


Task 2-ToDoList/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
├── .gitignore
└── README.md

 backend/
    │
    ├── manage.py
    ├── requirements.txt
    │
    ├── tasks/
    │   ├── models.py
    │   ├── serializers.py
    │   ├── views.py
    │   ├── urls.py
    │   ├── admin.py
    │   └── migrations/
    │
    ├── config/
    │   ├── settings.py
    │   ├── urls.py
    │   ├── asgi.py
    │   └── wsgi.py
    │
    └── .venv/




 '.venv/', 'db.sqlite3', cache files, and other local development files are excluded from GitHub using '.gitignore'.



  Installation & Setup

 1. Clone the Repository

After cloning the project:

powershell
cd "Task 2-ToDoList"




 2. Open the Backend

powershell
cd backend




 3. Create a Virtual Environment

If the virtual environment is not already present:

powershell
python -m venv .venv




4. Activate the Virtual Environment

 Windows PowerShell

powershell
.\.venv\Scripts\Activate.ps1


You should see:
(.venv)


before your PowerShell prompt.



5. Install Backend Dependencies

powershell
pip install -r requirements.txt




 6. Run Database Migrations

powershell
python manage.py migrate




 7. Start the Django Backend

powershell
python manage.py runserver


The backend API will be available at:


http://127.0.0.1:8000/


The main task API endpoint is:


http://127.0.0.1:8000/api/tasks/




  Running the Frontend

The frontend is located directly in the project root.

Do **not** run the frontend using Django.

Instead, open the project in **Visual Studio Code**.

Locate:


index.html


Right-click the file and select:

**Open with Live Server**

The frontend will normally open at an address similar to:


http://127.0.0.1:5500/

The exact port may vary depending on your Live Server configuration.

---

 How the Application Works

The application uses two local servers:


                  Browser
                     │
                     │
          VS Code Live Server
                     │
                     ▼
              index.html
              CSS + JavaScript
                     │
                     │ HTTP API Requests
                     ▼
          Django REST Framework
                     │
                     ▼
                Django App
                     │
                     ▼
                 SQLite DB


The frontend sends requests to the Django API for:


GET     /api/tasks/
POST    /api/tasks/
PUT     /api/tasks/<id>/
DELETE  /api/tasks/<id>/






The application uses **SQLite** during development.

The Django "Task" model stores:

* Title
* Description
* Completion status
* Priority
* Category
* Due date
* Created date
* Updated date

The database file is intentionally excluded from GitHub because it is a local development database.



 Backend Validation

The Django REST Framework serializer validates:

* Empty task titles
* Maximum title length
* Maximum description length
* Valid priority values
* Valid category values

This prevents invalid data from being stored through the API.



Timezone

The Django project is configured to use:

Asia/Karachi

This ensures task creation and update timestamps correspond to **Pakistan Standard Time (PKT)** while maintaining Django's timezone-aware datetime handling.



 Django Admin

The project includes a customized Django Admin interface for managing tasks.

To create an admin account:

powershell
python manage.py createsuperuser


Then start the server:

powershell
python manage.py runserver


Open:

http://127.0.0.1:8000/admin/




 Testing Checklist


* [ ] Add task
* [ ] Add task description
* [ ] Set due date
* [ ] Set priority
* [ ] Set category
* [ ] Edit task
* [ ] Complete/uncomplete task
* [ ] Delete task
* [ ] Cancel delete confirmation
* [ ] Search tasks
* [ ] Sort tasks
* [ ] Filter active tasks
* [ ] Filter completed tasks
* [ ] Filter overdue tasks
* [ ] Clear completed tasks
* [ ] Progress percentage updates
* [ ] Summary statistics update
* [ ] Backend validation works
* [ ] Django Admin works
* [ ] Responsive layout works
* [ ] Frontend connects successfully to Django API


 Internship Task

This project was developed as part of the:

**Arch Tecnologies Full Stack Development Internship**

The project demonstrates practical experience with:

* Frontend development
* JavaScript
* REST API integration
* Django backend development
* Django REST Framework
* Database operations
* CRUD functionality
* Form validation
* Responsive web design


  Future Improvements

Possible future enhancements include:

* User authentication
* Individual task ownership
* Multiple user accounts
* Persistent user preferences
* Notifications and reminders
* Drag-and-drop task organization
* Deployment to a production server



 Author

Sadaf Tanveer

BS Software Engineering
PMAS Arid Agriculture University Rawalpindi



  Project

**TaskFlow — To-Do List Web Application**

Built with HTML, CSS, JavaScript, Django, Django REST Framework, and SQLite.
