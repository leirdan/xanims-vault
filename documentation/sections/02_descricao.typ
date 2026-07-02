= Descrição do sistema

== Objetivo

O sistema tem como objetivo gerenciar a dieta de cada felino cadastrado de forma automatizada e inteligente, atuando no cálculo das porções diárias, na liberação da ração nos horários programados e no mecanismo de defesa contra o consumo por animais não autorizados.

== Usuário

O principal usuário do sistema é o pai/mãe de pet, preocupado com a saúde alimentar do seu gato e com a possibilidade de outros animais da casa interferirem em sua dieta.

== Visão geral da arquitetura

O Xanim's Vault é composto por quatro grandes blocos, que se comunicam conforme ilustrado no diagrama de componentes (ver @sec-componentes):

- *Aplicativo (UI)*: aplicação para cadastro do animal e visualização de estatísticas de consumo, desenvolvida em MIT App Inventor;
- *Backend / CMS (Strapi)*: responsável por armazenar os dados de gatos, dietas, horários e registros, além de calcular o plano alimentar;
- *Banco de dados (SQLite)*: banco de dados leve utilizado pelo Strapi para persistência das informações;
- *Broker MQTT (Mosquitto)*: intermediário de comunicação publish/subscribe entre o backend e o sistema embarcado;
- *Sistema embarcado (ESP32)*: responsável pela leitura de NFC, pesagem da ração, liberação das porções, bloqueio do pote e envio de eventos.

A comunicação entre os módulos ocorre da seguinte forma:

- *Aplicativo ↔ Backend*: protocolo HTTP/REST;
- *Backend ↔ Sistema embarcado*: protocolo MQTT, via broker Mosquitto.

== Entradas, processamento e saídas

*Entradas do sistema:*
+ Cadastro do animal (nome, peso, data de nascimento, status de castração e identificador NFC);
+ Leitura do tempo corrente, via módulo RTC;
+ Detecção da tag NFC e leitura da célula de carga (balança).

*Processamento:*
+ Criação do plano alimentar pelo backend (CMS), a partir dos dados cadastrais do gato;
+ Processos do sistema embarcado: alerta sonoro (buzzer), liberação da ração e monitoramento de consumo.

*Saídas do sistema:*
+ Abertura/fechamento do pote de ração;
+ Envio de estatísticas e eventos ao servidor.

== Cálculo do plano alimentar

O cálculo da quantidade diária de ração segue as diretrizes nutricionais da AAHA (2021 AAHA Nutrition and Weight Management Guidelines for Dogs and Cats), utilizando as fórmulas de necessidade energética em repouso (RER) e necessidade energética de manutenção (MER):

$ "RER" = "peso"_"kg"^(0.75) times 70 $
$ "MER" = "RER" times "fator do estágio de vida" $

O fator do estágio de vida varia conforme a condição do animal (por exemplo, entre 1,2 e 1,4 para adultos castrados, e entre 1,4 e 1,6 para adultos intactos). A partir do valor de MER (em kcal/dia), o sistema converte a energia necessária em gramas de ração, considerando a concentração calórica da ração de referência (Quatree Gourmet):

- Filhote: 3820 kcal/kg (3,82 kcal/g);
- Adulto: 3800 kcal/kg (3,80 kcal/g);
- Adulto castrado: 3705 kcal/kg (3,70 kcal/g).

A quantidade diária calculada é então dividida entre os horários de alimentação configurados (3, 4 ou 6 horários, sendo 4 o padrão). Durante a liberação, a ração é dispensada aos poucos, permitindo que o ESP32 monitore o peso na balança em tempo real e interrompa a liberação assim que a porção programada for atingida, com margem de erro de ± 5 g.

== Escopo do protótipo

Para a entrega ao final do semestre, foi definido que a simulação seria feita de forma física, mas não necessariamente com todos os componentes em condição de produção:

- O servidor web (CMS) roda localmente, utilizando Strapi;
- A "coleira" do gato é representada apenas pelo chip NFC;
- Elementos de papelão são utilizados para representar potes e travas.

== Fora do escopo

Os seguintes itens foram explicitamente definidos como fora do escopo do projeto:

- Reconhecimento facial de animais e uso de câmeras;
- Integração com serviços externos;
- Controle simultâneo de múltiplos gatos ou múltiplos potes;
- Uso de inteligência artificial;
- Controle de estoque de ração;
- Aplicativo comercial / sistema em produção;
- Atualização de firmware remota.
