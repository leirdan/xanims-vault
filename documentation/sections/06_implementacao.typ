
= Implementação

== Tecnologias utilizadas

=== Hardware:
- Microcontrolador ESP8266 (NodeMCU v2) (substituição do ESP32)
- Módulo NFC PN532 V3 / leitor RFID-RC522
- Células de carga de 50 kg (2x ou 4x) com módulo HX711
- Módulo RTC DS1307 / DS3231 (Real Time Clock, I2C)
- Micro servo motor Tower Pro MG90S (180°) - liberação da ração
- Micro servo motores SG90 (9g) - válvula da balança e tampa do pote
- Buzzer ativo 5V
- Elementos de papelão para representação física do pote e das travas

=== Software:
- Linguagem C/C++ utilizando Arduino Framework (PlatformIO) para desenvolvimento do firmware embarcado (ESP32/ESP8266)
- Protocolo MQTT com broker Mosquitto para comunicação entre backend e embarcado
- Protocolo HTTP/REST para comunicação entre aplicativo e backend
- CMS Strapi com banco de dados SQLite
- Aplicativo mobile desenvolvido em MIT App Inventor

== Partes implementadas

=== RF01 - Cadastro do animal
O sistema deve permitir o cadastro de um gato contendo as informações de nome, peso, data de nascimento, status de castração e identificador NFC;

=== RF02 - Geração do plano alimentar
O sistema calcula automaticamente a quantidade diária de ração com base nas características cadastradas do gato, considerando a quantidade de refeições configurada pelo usuário (3, 4 ou 6 por dia).

=== RF03 - Configuração e distribuição das refeições
O sistema permite configurar 3, 4 ou 6 refeições por dia, com definição manual dos horários de alimentação, e distribui automaticamente a quantidade diária de ração entre os horários configurados.

=== RF05 - Atualização de dados
O embarcado deve atualizar os dados armazenados localmente sempre que novas configurações forem recebidas da API.

=== RF06 - Liberação e controle da ração (parcial)
Toda a estrutura de software para liberação automática está implementada, incluindo agendamento e controle de servos. A validação física não foi realizada devido à ausência do HX711.

=== RF07 - Identificação NFC
O sistema deve detectar tags NFC posicionadas a até 4 cm do leitor e comparar a tag detectada com a cadastrada se houver. Caso seja válida, o acesso ao pote deve ser permitido; caso contrário, o pote deve ser bloqueado e um alerta enviado à API.

=== RF09 - Visualização de estatísticas
O sistema deve permitir visualizar: horários em que o gato se alimentou; consumo parcial ou completo; tentativas de acesso por outros gatos; alertas gerados pelo sistema.

=== RF10 - Registro de Eventos
O embarcado deve enviar à API: horário da alimentação; quantidade liberada; status do consumo;identificação NFC detectada; alertas de acesso inválido.

== Requisitos não funcionais

=== RNF01 - Persistência local
Os dados devem persistir mesmo quando o sistema esteja offline.

=== RNF02 - Confiabilidade após queda de energia
Os dados armazenados na memória flash não devem ser perdidos em caso de queda de energia ou reinicialização inesperada.

=== RNF04 - Tempo de resposta do bloqueio
Ao detectar aproximação indevida, o sistema irá fechar o pote em até 1 segundo e enviar um alertar à API.

=== RNF05 - Comunicação
A comunicação entre o servidor e o sistema embarcado deve utilizar o protocolo MQTT via broker Mosquitto e HTTP do servidor para o app WEB.

== Limitações

=== RF04 - Operação offline
O sistema deve continuar operando utilizando dados salvos na memória quando estiver sem conexão com Internet. Ele depende de MQTT e pode travar em caso de indisponibilidade do broker.

=== RF08 - Monitoramento do consumo
O sistema deve monitorar o consumo do gato a partir do peso da balança e enviar registros de consumo (ou ausência dele) 60 segundos antes do próximo horário de liberação. O consumo deve ser classificado como:
- Consumo total => até 10%
- Consumo parcial => 11% até 90%
- Não consumiu => acima de 90%
O consumo será registrado dessa forma para evitar variações na balança ao longo do tempo.
Não implementado por ausência do HX711.

=== RNF03 - Precisão na liberação
A liberação deve ser interrompida quando a quantidade programada for atingida com margem de erro de ± 5g.

=== RNF06 - Tempo de detecção NFC
A tag NFC deve ser detectada em no máximo 1 segundo após a aproximação ao leitor. Após a primeira leitura da tag NFC, o sistema não reconhece novas aproximações porque mantém o estado da tag como "lida", sem resetar a detecção. Isso impede novas leituras e viola o RNF06 de detecção contínua em até 1 segundo.

== Dificuldades encontradas

=== Reativação do WiFi/MQTT e risco de travamento
Após reativar WiFi_init, MQTT_init e MQTT_connect no loop principal, foi identificado um problema crítico: em caso de falha na conexão com o broker, a função MQTT_connect() pode entrar em um laço infinito (while(1);), travando completamente o firmware.

Enquanto o MQTT estava desativado, esse comportamento não era observado. Com a reativação, passou a representar um risco direto à operação contínua do sistema, contrariando o requisito de operação offline (RF04). A correção (remoção do bloqueio e adoção de operação degradada com dados locais) ainda não foi implementada.

=== Integração da célula de carga (HX711)
A integração da célula de carga com o firmware permaneceu pendente. Embora toda a lógica de agendamento, controle de servos e armazenamento local esteja implementada, não foi possível validar a liberação real da ração nem implementar o monitoramento de consumo, pois essas funções dependem da leitura do HX711.

=== Configuração dinâmica dos horários
Inicialmente o sistema utilizava horários fixos. Para atender ao requisito de flexibilidade, foi implementada uma estrutura dinâmica permitindo 3, 4 ou 6 refeições diárias.

Foi necessário modificar frontend, backend e firmware. No backend, foi adicionado o atributo feeding_hours ao modelo do gato, além da adaptação da geração do plano alimentar e sincronização via MQTT.

=== Centralização MQTT no backend
A conexão MQTT foi reorganizada em um módulo compartilhado, permitindo reutilização em diferentes serviços e evitando múltiplas conexões simultâneas.

=== Configuração do Mosquitto em Docker
Foi necessário ajustar autenticação, permissões e inicialização automática do broker, incluindo criação do arquivo de senhas e configuração de usuários para backend e firmware.

=== Orquestração de containers
A comunicação entre serviços exigiu configuração de rede Docker compartilhada, utilizando nomes de serviço como hostname e isolamento de volumes para evitar conflitos de dependências.