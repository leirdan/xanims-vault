= Modelagem <sec-modelagem>

Esta seção apresenta os diagramas elaborados durante a fase de projeto, com a respectiva explicação de cada um.

== Diagrama de componentes <sec-componentes>

#figure(
  image("../diagrams/componentes.png", width: 100%),
  caption: [Diagrama de componentes do Xanim's Vault, no estilo C4, mostrando a interação entre o usuário (pai/mãe do pet), a aplicação (UI), o CMS (Strapi), o banco de dados (SQLite), o broker MQTT (Mosquitto) e o sistema embarcado (ESP32).]
)

O diagrama de componentes descreve a arquitetura de alto nível do sistema. O usuário interage com a UI, que se comunica com o backend CMS via HTTP/REST para recuperar e atualizar os dados da dieta do animal. O CMS armazena as informações no banco SQLite e publica os dados de configuração para o sistema embarcado através do broker MQTT (Mosquitto). O sistema embarcado, por sua vez, envia ao broker os eventos de alimentação, consumo e alertas de intrusão, que são consumidos pelo CMS.

== Diagrama de blocos do hardware

#figure(
  image("../diagrams/blocos_hardware.png", width: 100%),
  caption: [Diagrama de blocos do hardware, dividido em entradas, processamento e saídas.]
)

O diagrama de blocos organiza o hardware em três grupos:

- *Entradas*: leitor NFC (RFID-RC522), duas células de carga (HX711), módulo RTC (DS1307/DS3231) e módulo Wi-Fi;
- *Processamento*: microcontrolador ESP32 DevKit C v4, com memória flash interna;
- *Saídas*: servo de liberação (válvula borboleta), servo com balança (válvula borboleta), servo com tampa (fechamento do pote) e buzzer (indicador sonoro do horário de alimentação).

== Diagrama de fiação

#figure(
  image("../diagrams/fiacao.png", width: 100%),
  caption: [Diagrama de fiação da montagem em protoboard, mostrando a conexão do ESP32 aos servomotores, ao módulo RFID-RC522, às células de carga (via módulos HX711) e ao buzzer.]
)

Este diagrama detalha as conexões físicas entre o ESP32 e os demais componentes: os servomotores responsáveis pela liberação da ração e pelo fechamento do pote, o módulo RFID-RC522 para leitura das tags NFC, os módulos HX711 conectados às células de carga, e o buzzer utilizado como indicador sonoro.

== Máquina de estados

O comportamento do sistema embarcado foi modelado como uma máquina de estados dividida em quatro partes.

=== Parte 1: Cadastro e identificação inicial

#figure(
  image("../diagrams/estados_parte1.png", width: 100%),
  caption: [Etapa inicial: registro do gato, leitura de NFC e envio de dados ao embarcado.]
)

Nesta primeira etapa, os dados do gato são inseridos via API. Caso não haja erro na inserção, o CMS gera automaticamente o plano alimentar. Em seguida, o ESP32 aguarda a detecção de um NFC por até 60 segundos; ao detectar, envia os dados à API, que retorna as informações da dieta para o embarcado.

=== Parte 2: Detecção de NFC e tratamento de intrusos

#figure(
  image("../diagrams/estados_parte2.png", width: 100%),
  caption: [Etapa de detecção de NFC: verificação da tag detectada e envio de alerta de intruso, caso necessário.]
)

Ao detectar uma tag NFC, o sistema compara-a com a tag armazenada. Se a tag corresponder, o estado do pote (aberto/fechado) é verificado e, se necessário, o pote é aberto. Caso a tag não corresponda, o sistema trata o evento como uma intrusão: verifica o estado do pote, fecha-o caso esteja aberto e envia os dados da invasão à API.

=== Parte 3: Liberação e monitoramento de consumo

#figure(
  image("../diagrams/estados_parte3.png", width: 100%),
  caption: [Etapa de liberação de ração: registro do consumo e liberação de nova porção, se necessário.]
)

Sessenta segundos antes do próximo horário de liberação, o sistema calcula o peso do recipiente em relação à porção liberada anteriormente e classifica o consumo (total, parcial ou não realizado), registrando o resultado na API. Em seguida, é verificado se a balança contém a porção correta; caso não, uma nova porção é liberada até o recipiente atingir a quantidade programada. Por fim, o pote é fechado e o buzzer soa uma melodia indicando a conclusão do ciclo.

=== Parte 4: Atualização de configurações

#figure(
  image("../diagrams/estados_parte4.png", width: 100%),
  caption: [Etapa de atualização do embarcado: recepção de novos dados e persistência na flash, com envio de alertas em caso de falha.]
)

Sempre que o CMS publica uma atualização, o ESP32 recebe os novos dados e os armazena em memória flash. Caso não haja espaço suficiente, o buzzer emite um alerta sonoro e o ESP32 envia um alerta à API, que o exibe ao usuário; caso a gravação seja bem-sucedida, o sistema retorna ao estado de espera (idle).

== Modelo de dados

#figure(
  image("../diagrams/modelo_dados.png", width: 100%),
  caption: [Modelo físico das entidades do banco de dados (SQLite).]
)

O modelo de dados é composto pelas seguintes entidades principais:

- *User*: usuário responsável pelo cadastro (nome, login, senha);
- *Cat*: dados do gato (nome, data de nascimento, peso, status de castração, identificador NFC), relacionado ao usuário e ao fator de estágio de vida;
- *LifeStageFactor*: fator multiplicador utilizado no cálculo do MER, de acordo com a condição do animal;
- *Ration*: dados da ração cadastrada (descrição, marca, kcal por grama, categoria);
- *Diet*: dieta de um gato, associando o animal a uma ração e à porção calculada;
- *DietSchedule*: horários de alimentação associados a uma dieta;
- *Consumption*: registros de consumo do animal, associados ao tipo de consumo (total, parcial, não realizado) e ao horário de alimentação;
- *ConsumptionTypeId*: tipos de consumo possíveis;
- *IntrusionAlert*: registros de tentativas de acesso por NFC não autorizado.
