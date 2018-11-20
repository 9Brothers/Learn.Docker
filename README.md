
# Aprendendo a trabalhar com docker
```powershell
<#
  Cria uma imagem chamada ex-build-arg
  O parâmetro -t indica o nome (tag) da imagem
#>
docker image build -t ex-build-arg .

# Executa a imagem criada, acessa o bash (terminal) e imprime a variável S3_BUCKET
docker container run ex-build-arg bash -c 'echo $S3_BUCKET'

# Cria uma imagem utilizando argumentos
docker image build --build-arg S3_BUCKET=myapp -t ex-build-arg .

# Inspeciona uma propriedade específica do container
docker image inspect --format="{{ index.Config.Labels.maintainer }}" ex-build-arg

<#
  Executa o container
  -it = junção dos comandos -i -t
  -i = modo interativo, ou seja, exibe os logs
  -t = acesso ao terminal
  -p = redirecionamento de portas externo:interno
  --name = nome do container
#>
docker container run -it -v ${pwd}/build-dev:/app -p 8080:8000 --name python-server ex-build-dev

<#
  Executa o container
  utiliza os volumes (discos) do container python-server
#>
docker container run -it --volumes-from=python-server debian cat /log/http-server.log

# Lista os tipos de rede disponíveis
docker network ls

<#
  Executa o container em modo deamon
  -d = modo deamon
  --net = tipo de rede
  none = desabilita a interface de rede
#>
docker container run -d --net none debian

<#
  --rm = remove o container ao final da execução
  -c = executa um comando, ex: -c "ifconfig"
#>
docker container run --rm alpine ash -c "ifconfig"

docker container run -d --name container1 alpine sleep 1000
docker container run -d --name container2 alpine sleep 1000

# Os dois containers abaixo conseguem conversar entre si
docker container exec -it container1 ping 172.17.0.3
docker container exec -it container2 ping 172.17.0.2

# E tbm conseguem pingar endereços externos
docker container exec -it container1 ping www.google.com.br

# Cria uma nova rede
docker network create --driver bridge rede_nova

# Cria um container utilizando a rede_nova
docker container run -d --name container3 --net rede_nova alpine sleep 1000

<#
  Faz com que o container3 consiga se conectar a rede bridge
  Ele faz isso criando uma nova interface de rede
#>
docker network connect bridge container3

# Desconecta da rede bridge e remove a interface
docker network disconnect bridge container3

<#
  Cria um novo container com o nome container4
  O executa em modo daemon
  Configura a rede para o modo host
  Alpine é a imagem usada
#>
docker container run -d --name container4 --net host alpine sleep 1000

<#
  Executa o docker compose com base no arquivo docker-compose.yml
  -d = modo deamon 
#>
docker-compose up -d

# Lista os processos ativos
docker-compose ps

<#
  Executa um comando
  -U = usuario
  -c = comando
#>
docker-compose exec db psql -U postgres -c "\l"

# Termina os serviços
docker-compose down

# -f = File = Arquivo
docker-compose exec db psql -U postgres -f /scripts/check.sql

# Exibe os logs 
docker-compose logs -f -t

<#
  -d = database
  -c = comando
#>
docker-compose exec db psql -U postgres -d email_sender -c "select * from emails"

# --scale = escala a quantidade de serviços
docker-compose up --scale worker=3
```