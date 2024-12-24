# Docker commands

## Mount the app

```
docker-compose up --build -d
```

## setup the dbs

```
docker-compose exec app rails db:create
```

## run the migrations

```
docker-compose exec app rails db:migrate
```

## run the server

```
docker-compose exec app ./bin/dev -b 0.0.0.0
```

## connect to the shell

```
docker-compose exec app /bin/bash
```
