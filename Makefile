BOX=app

start:
	docker-compose up -d --build

stop:
	docker-compose stop ${BOX}

destroy:
	@make stop
	docker-compose rm

bash:
	docker-compose exec ${BOX} bash

dev:
	docker-compose exec ${BOX} bash

login:
	docker-compose exec ${BOX} bash