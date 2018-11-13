# Dataviz Server

## REST endpoints
- /nodes GET+POST
    - name
- /edges GET+POST
    - node1 Node
    - node2 Node
    - weight int

## Setup
Install necessary python packages (use according pip and python executables):
```
> pip install django djangorestframework
```

Prepare migrations to create database:
```
> python manage.py makemigrations networkapi
```

Create database:
```
> python manage.py migrate
```

Run server:
```
> python manage.py runserver
```

You should be able to access all corresponding API endpoints on [http://127.0.0.1:8000/]()