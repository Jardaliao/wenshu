Package = jarda-wenshu
Version = 0.0.1
ServerDesc = Jarda Wenshu Backend Service
ServerDir = /usr/lib/jarda/wenshu
ServerLogDir = /data/logs/jarda/wenshu
ServerConfigDir = /opt/app-config/data/wenshu

Host=aliyun
WorkDir=$(Host):/home/admin/
DebName=$(Package)_$(Version)_all.deb


all: package

clean:
	@echo Cleaning...
	@rm -rf build

build: clean
	@echo Building...
	@cd src&& \
	export GOOS=linux&& \
	export GOARCH=amd64&& \
	go build -o wenshu.bin&& \
	mkdir -p ../build && \
	mv wenshu.bin ../build/wenshu.bin

prepackage: build
	@echo Prepare package...
	@# 递归遍历创建目录
	@find deb/* -type d -print | while read file; do \
		mkdir -p "build/$$file"; \
	done
	@# 递归遍历替换文件
	@find deb/* -type f -print | while read file; do \
		$(call replace,"$$file","build/$$file"); \
	done
	@# 替换nfpm配置文件准备打包
	@$(call replace, "nfpm.yaml", "build/nfpm.yaml")
	@# 拷贝配置文件
	@mkdir -p build/config && cp config* build/config/

package: prepackage
	@echo Packaging...
	@cd build&& \
	nfpm pkg --packager deb


deploy: package
	@echo Deploying...
	@scp -o StrictHostKeyChecking=no build/$(DebName) $(WorkDir)

install: deploy
	@echo Installing...
	@ssh -o StrictHostKeyChecking=no $(Host) 'sudo dpkg -i $(DebName)'
	@echo Restarting $(Package).service...
	@ssh -o StrictHostKeyChecking=no $(Host) 'sudo systemctl restart $(Package).service'


# 默认的替换格式是sed 's/pattern/replacement/g' file1 > file2
# 由于替换的内容包含/导致替换失败，因此需要自定义分隔符sed 's#pattern#replacement#g' file1 > file2

define replace
	sed 's#__VERSION__#$(Version)#g; \
	s#__PACKAGE__#$(Package)#g; \
	s#__SERVER_DESC__#$(ServerDesc)#g; \
	s#__SERVER_DIR__#$(ServerDir)#g; \
	s#__SERVER_LOG_DIR__#$(ServerLogDir)#g; \
	s#__CONFIG_DIR__#$(ServerConfigDir)#g;' \
	$(1) > $(2)
endef