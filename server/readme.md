# Dataviz Server

## REST endpoints
- **/network** POST in json format
    - *params*
        - time_start
        - time_end
        - keywords
    - *returns*
        - Nodes (array)
            - id (int) # node id
            - name (string) # node name
        - Edges (array)
            - node1 (int) # node 1 id
            - node2 (int) # node 2 id
            - weight (int) # computed edge weight

## Setup
Install necessary python packages (use according pip and python executables):
```
> pip install django
```

Run server:
```
> python manage.py runserver
```

You should be able to access all corresponding API endpoints on [http://127.0.0.1:8000/]()