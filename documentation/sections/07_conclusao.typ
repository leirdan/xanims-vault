= Conclusão

O desenvolvimento do Xanim's Vault permitiu explorar, de forma prática, os desafios de integração entre um sistema embarcado (ESP8266, em substituição ao ESP32 originalmente planejado), um backend CMS (Strapi) e um broker de mensagens MQTT (Mosquitto), aplicados a um problema real: a alimentação individualizada e segura de felinos em residências com múltiplos animais.

== Resultados alcançados

O protótipo desenvolvido conseguiu validar o núcleo do fluxo proposto e evoluiu em relação à primeira versão, principalmente na flexibilidade da configuração alimentar. O cadastro de um gato no aplicativo (RF01) dispara o cálculo automático do plano alimentar no backend (RF02), agora considerando a quantidade de refeições escolhida pelo usuário entre 3, 4 ou 6 por dia com definição manual dos horários (RF03), o que exigiu mudanças coordenadas no frontend, no backend (novo atributo `feeding_hours` no modelo do gato) e no firmware. Esses dados são sincronizados com o sistema embarcado via MQTT e atualizados localmente sempre que uma nova configuração é recebida (RF05). Toda a estrutura de software para a liberação automática da ração (agendamento e controle dos servos) está implementada (RF06), assim como a identificação por NFC, a validação da tag cadastrada, o bloqueio do pote e o envio de alertas em caso de acesso inválido (RF07). O aplicativo permite visualizar o histórico de alimentação, consumo e tentativas de acesso indevido (RF09), e a estrutura para o registro desses eventos na API também foi implementada (RF10). Os requisitos não funcionais de persistência local (RNF01), integridade dos dados após queda de energia (RNF02), tempo de resposta do bloqueio (RNF04), comunicação via MQTT/HTTP (RNF05) e tempo de detecção do NFC (RNF06) foram atendidos. Toda a stack desde o aplicativo, backend, broker MQTT e embarcado segue orquestrada via Docker, o que manteve o ambiente de desenvolvimento reprodutível entre os integrantes da equipe.

Esses resultados reforçam que a arquitetura proposta é viável e que a divisão de responsabilidades entre os módulos tais como configuração e cálculo da dieta no backend, execução e controle físico no embarcad funciona como esperado nas partes já implementadas, incluindo o ajuste dinâmico de horários que era uma lacuna da versão anterior do projeto.

== Limitações

A limitação mais significativa do protótipo continua sendo a ausência da célula de carga (HX711): embora toda a lógica de agendamento e acionamento dos servos esteja pronta (RF06), não foi possível validar fisicamente a liberação da porção nem implementar o monitoramento de consumo (RF08), que classificaria a refeição como consumo total, parcial ou não realizado a partir do peso restante no prato. Pela mesma razão, a margem de erro de ± 5 g prevista para a liberação (RNF03) não pôde ser garantida. A operação offline também segue como ponto de atenção: o sistema depende do MQTT para atualizar seus dados e a função de reconexão ao broker pode travar indefinidamente o firmware quando a conexão falha, contrariando o requisito de continuar operando com os dados salvos localmente (RF04). Por fim, foi identificado um novo problema durante os testes de NFC: após a primeira leitura de uma tag, o sistema mantém esse estado como "lido" e não reseta a detecção, impedindo que novas aproximações sejam reconhecidas, o que viola o requisito de detecção contínua em até 1 segundo (RNF06).

== Melhorias futuras

A partir do que foi identificado ao longo do desenvolvimento, os próximos passos naturais do projeto seriam:

- Integrar de fato a célula de carga com o HX711, calibrando o fator de conversão para gramas, e assim viabilizar a liberação controlada por peso (RF06), o monitoramento de consumo (RF08) e a margem de ± 5 g da RNF03;
- Corrigir a função de reconexão ao broker MQTT para que, em caso de falha persistente, o firmware continue operando de forma autônoma com os dados salvos na memória flash, em vez de travar indefinidamente (RF04);
- Corrigir o reset do estado de leitura do módulo NFC após cada detecção, permitindo que novas aproximações sejam reconhecidas de forma contínua, conforme previsto na RNF06;
- Validar formalmente o tempo de resposta do bloqueio do pote (RNF04) com testes repetidos e medições, em vez de observação manual via `Serial`;
- Migrar o protótipo para o hardware de referência original (ESP32), avaliando se os conflitos de biblioteca que motivaram o uso do ESP8266 (NodeMCU) se repetem nessa plataforma;
- Substituir os elementos de papelão do protótipo por peças impressas em 3D ou usinadas, aproximando a montagem física do produto final e permitindo testar a vedação do pote e o encaixe dos servomotores em condições mais realistas.

De forma geral, o projeto avançou em relação à sua primeira versão ao resolver a flexibilidade dos horários de alimentação, mas segue dependente da integração do sensor de peso e da robustez da conectividade do firmware para funcionar de ponta a ponta conforme especificado nos requisitos. Uma vez resolvidos esses dois pontos, o Xanim's Vault estaria apto a operar de forma completa e autônoma.
