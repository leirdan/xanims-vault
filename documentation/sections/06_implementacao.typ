
= Implementação

== Tecnologias utilizadas

=== Hardware:
- Microcontrolador ESP8266 (NodeMCU v2) (substituição do ESP32)
- Módulo NFC PN532 V3 / leitor RFID-RC522
// - Células de carga de 50 kg (2x ou 4x) com módulo HX711
- Módulo RTC DS1307 / DS3231 (Real Time Clock, I2C)
- Micro servo motor Tower Pro MG90S (180°) - liberação da ração
// - Micro servo motores SG90 (9g) - válvula da balança e tampa do pote
- Buzzer passivo 5V
- Elementos de papelão e plástico para representação física do pote e das travas

=== Software:
- Linguagem C/C++ utilizando Arduino Framework (PlatformIO) para desenvolvimento do sistema embarcado (ESP8266)
- Protocolo MQTT com broker Mosquitto para comunicação entre backend e embarcado
- Protocolo HTTP/REST para comunicação entre aplicativo e backend
- CMS Strapi com banco de dados SQLite
- Aplicação web implementada com Next.js e Material UI

== Tópicos MQTT
=== CAT/NFC
- Publisher: embarcado
- Subscriber: API
- Objetivo: o embarcado comunicar à API o NFC que foi lido para o novo gato
- Payload:
```json
{
    "nfc": "string"
}
```

=== CAT/SYNC
- Publisher: API
- Subscriber: embarcado
- Objetivo: a API conseguir sempre atualizar os dados armazenados no embarcado: NFC, porção em gramas e horários de liberação
- Payload:
```json
{
    "nfc": "string",
    "portion": 0,
    "hours": [
       "00:00",
       "00:01",
       // ...
    ]
}
```

=== CAT/INTRUDER
- Publisher: embarcado
- Subscriber: API
- Objetivo: o embarcado comunicar à API todas as tags NFCs detectadas que não sejam as do gato atrelado ao dispositivo, configurando uma invasão
- Payload:
```json
{
    "nfc": "string",
    "intruder": "string",
    "date": "iso_date"
}
```

=== FEED/REGISTER

- Publisher: embarcado
- Subscriber: API
- Objetivo: o embarcado comunicar à API todos os registros de consumo para que esta classifique e registre posteriormente no banco
- Payload:
```json
{
    "nfc": "string",
    "amount": number,
    "date": "iso_date"
}
```

== Requisitos implementados

=== RF01 - Cadastro do animal
O sistema realiza o cadastro de um gato em 2 partes: primeiro, o usuário insere a partir da interface dados gerais do gato: nome, data de nascimento, peso, status de castração e quantidade de refeições. Após isso, o ESP8266 realiza a leitura de uma tag NFC e publica no tópico MQTT `cat/nfc`, onde a API lê tal informação e vincula ao gato recém-criado;

=== RF02 - Geração do plano alimentar
O sistema calcula automaticamente a quantidade diária de ração com base nas características cadastradas do gato, considerando a quantidade de refeições configurada (3, 4 ou 6 por dia), o peso inserido e status de castração.

=== RF03 - Configuração e distribuição das refeições
O sistema permite configurar 3, 4 ou 6 refeições por dia, com definição manual dos horários de alimentação, e distribui automaticamente a quantidade diária de ração entre os horários configurados.

=== RF05 - Atualização de dados
O embarcado recebe as novas informações do gato através de uma publicação da API no tópico MQTT `cat/sync`, armazenando as informações atualizadas em variáveis globais e na flash.

=== RF07 - Identificação NFC
O embarcado, enquanto ligado, realiza a detecção de quaisquer NFCs aproximados, liberando ou bloqueando o pote caso a tag detectada seja inválida.

=== RF08 - Monitoramento do consumo (Parcial)
O embarcado, antes de fazer a liberação do pote para o gato nos horários das refeições, registra o consumo feito pelo animal e publica no tópico MQTT `feed/register`. Tal consumo foi implementado de forma _mockada_, onde é sempre registrado um consumo completo para fins de exibição na interface. Não foi possível implementar de forma automatizada por problemas de usabilidade e conexão com os sensores de carga HX711.

=== RF09 - Visualização de estatísticas
O sistema permite a visualização de todos os animais registrados para o usuário, bem como estatísticas para cada um deles que são geradas pelo embarcado ao qual cada gato está vinculado: alertas de intrusão e registros de consumo.

=== RF10 - Registro de Eventos
O embarcado publica constantemente para a API diversas informações através dos tópicos MQTT, que são interpretadas corretamente pela API e inseridas no banco. As informações consistem nos alertas de intrusão e o registro de consumo.

=== RNF01 - Persistência local
Os dados persistem na memória flash em caso da rede WiFi estar indisponível.

=== RNF02 - Confiabilidade após queda de energia
Os dados persistem na memória flash em caso de queda de energia e são todos carregados em formato de variáveis globais.

=== RNF04 - Tempo de resposta do bloqueio
Ao detectar aproximação indevida, o embarcado fecha o pote em até 1 segundo e imediatamente envia um alerta à API através do tópico MQTT `cat/intruder`.

=== RNF05 - Comunicação
A comunicação entre App Web e API foi implementada através do protocolo HTTP, enquanto entre API e embarcado foi implementada através do protocolo MQTT, cujos tópicos foram criados através de um broker MQTT Mosquitto local.

=== RNF06 - Tempo de detecção NFC
A detecção de tags NFC é extremamente ágil e cumpre com o requisito de menos de 1 segundo, desde que o sistema não esteja travado por problemas de conexão como abordado abaixo.

== Limitações

=== RF04 - Operação offline
O embarcado foi configurado de forma a depender completamente da conexão com o MQTT, que, por sua vez, depende da disponibilidade da rede WiFi. Em caso de problemas com qualquer um dos dois componentes o embarcado pode travar e aguardar pela conexão por tempo indefinido.

=== RF06 - Liberação e controle da ração (parcial)
A liberação da ração não foi implementada por conflitos de agenda e dificuldades encontradas com a modelagem física da estrutura. Dessa forma, no horário de liberação a única ação executada é a abertura de pote.

=== RNF03 - Precisão na liberação
Como a liberação não foi implementada, não há critérios aplicáveis de precisão.

== Dificuldades encontradas

=== Reativação do WiFi/MQTT e risco de travamento
Após reativar WiFi_init, MQTT_init e MQTT_connect no loop principal, foi identificado um problema crítico: em caso de falha na conexão com o broker, a função MQTT_connect() pode entrar em um laço infinito (while(1);), travando completamente o firmware.

Enquanto o MQTT estava desativado, esse comportamento não era observado. Com a reativação, passou a representar um risco direto à operação contínua do sistema, contrariando o requisito de operação offline (RF04). A correção (remoção do bloqueio e adoção de operação degradada com dados locais) ainda não foi implementada.

=== Integração da célula de carga (HX711)
A integração da célula de carga com o firmware permaneceu pendente. Embora toda a lógica de agendamento, controle de servos e armazenamento local esteja implementada, não foi possível validar a liberação real da ração nem implementar o monitoramento de consumo, pois essas funções dependem da leitura do HX711.

=== Configuração dinâmica dos horários
Inicialmente o sistema utilizava horários fixos. Para atender ao requisito de flexibilidade, foi implementada uma estrutura dinâmica permitindo 3, 4 ou 6 refeições diárias.

Foi necessário modificar frontend, backend e embarcado. No backend, foi adicionado o atributo `feeding_hours` ao modelo do gato, além da adaptação da geração do plano alimentar e sincronização via MQTT.

=== Centralização MQTT no backend
A conexão MQTT foi reorganizada em um módulo compartilhado, permitindo reutilização em diferentes serviços e evitando múltiplas conexões simultâneas.

=== Configuração do Mosquitto em Docker
Foi necessário ajustar autenticação, permissões e inicialização automática do broker, incluindo criação do arquivo de senhas e configuração de usuários para backend e embarcado.

=== Orquestração de containers
A comunicação entre serviços exigiu configuração de rede Docker compartilhada, utilizando nomes de serviço como hostname e isolamento de volumes para evitar conflitos de dependências.

== Uso de Inteligência Artificial Generativa
Para o desenvolvimento deste projeto foi utilizada a ajuda da IA generativa nos seguintes pontos:
- _Detecção e correção de bugs_: dada à natureza do projeto e a pouca familiaridade dos integrantes com programação de embarcados, houveram erros capazes de serem detectados somente com a ajuda destas ferramentas;
- _Geração do design dos componentes de UI_: como a interface não é um fim por si só mas parte de um sistema maior cujo principal componente é o embarcado, optamos por construir o esqueleto dos componentes por conta própria e utilizar o auxílio da IA na estilização destes;
