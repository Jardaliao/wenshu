ServerDesc = Jarda Wenshu Web Service
ServerDir = /usr/lib/jarda/wenshu-web
ServerLogDir = /data/logs/jarda/wenshu-web

Host=aliyun
Dir=/home/admin/wenshu-web
WorkDir=$(Host):$(Dir)


all: package

clean:
	@echo Cleaning...
	@rm -rf dist

build: clean
	@echo Building...
	@npm run build

deploy: build
	@echo Deploying...
	@ssh -o StrictHostKeyChecking=no $(Host) 'mkdir -p $(Dir)'
	@scp -r -o StrictHostKeyChecking=no dist/* $(WorkDir)/html
	@scp -r -o StrictHostKeyChecking=no cert/* $(WorkDir)/cert
	@scp -r -o StrictHostKeyChecking=no wenshu-web-443.conf $(WorkDir)/

install: deploy
	@echo Installing...
	@ssh -o StrictHostKeyChecking=no $(Host) 'mkdir -p $(ServerDir)'
	@ssh -o StrictHostKeyChecking=no $(Host) 'sudo mv $(Dir)/wenshu-web-443.conf /etc/nginx/sites-available/'
	@ssh -o StrictHostKeyChecking=no $(Host) 'sudo cp -r $(Dir)/* $(ServerDir)/ && sudo rm -r $(Dir)'
