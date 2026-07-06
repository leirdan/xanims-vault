= Conclusão

O desenvolvimento do Xanim's Vault permitiu explorar, de forma prática, os desafios de integração entre um sistema embarcado (ESP32/ESP8266), um backend CMS (Strapi) e um broker de mensagens MQTT (Mosquitto), aplicados a um problema real: a alimentação individualizada e segura de felinos em residências com múltiplos animais.

== Resultados alcançados

O protótipo desenvolvido conseguiu validar o núcleo do fluxo proposto: o cadastro de um gato no aplicativo dispara, automaticamente, o cálculo do plano alimentar no backend (RF01, RF02, RF04), a partir das fórmulas de RER/MER definidas nas diretrizes da AAHA. Esses dados são persistidos localmente no sistema embarcado (RF06) e atualizados sempre que uma nova sincronização é recebida via MQTT (RF05, RF07). A identificação do animal por NFC funciona de ponta a ponta (RF10, RF11): o firmware compara a tag lida com a tag cadastrada e aciona diretamente o servomotor responsável por liberar ou bloquear o acesso ao pote, com resposta praticamente imediata. Tentativas de acesso por animais não cadastrados são tratadas como intrusão, sinalizadas por um som distinto do buzzer e comunicadas ao backend via MQTT (RF13, parcialmente). Do lado do aplicativo, o usuário consegue visualizar o histórico de consumo e os alertas de intrusão do seu gato (RF15). Toda a stack  aplicativo (Next.js), backend (Strapi), broker MQTT e firmware do ESP8266 foi orquestrada via Docker, o que facilitou a reprodução do ambiente de desenvolvimento entre os integrantes da equipe.

Esses resultados mostram que a arquitetura proposta (aplicativo ↔ HTTP ↔ CMS ↔ MQTT ↔ embarcado) é viável e que a divisão de responsabilidades entre os módulos cálculo da dieta no backend e controle físico no embarcado funcionou como esperado para as partes que foram implementadas.

== Limitações

O maior gap do protótipo em relação à proposta inicial está na malha de controle por peso: a integração da célula de carga com o módulo HX711 não foi concluída dentro do prazo do semestre, o que impede a liberação automática da porção programada (RF08), o controle da quantidade liberada (RF09) e o monitoramento do consumo (RF12). Como consequência, o registro de eventos de alimentação no CMS (RF13) também ficou incompleto; apenas os alertas de intrusão chegam ao backend, não o histórico real de quanto e quando o gato comeu. A configuração do número de horários de alimentação (3, 4 ou 6 por dia, RF03) também não foi exposta na interface, ficando fixa em 6 horários no backend. Por fim, a reativação do WiFi/MQTT no firmware expôs um problema de robustez já existente no código: a função de reconexão ao broker trava o ESP indefinidamente caso todas as tentativas falhem, o que compromete o funcionamento offline previsto nos requisitos não funcionais (RF14, RNF06) e ainda precisa ser corrigido.

== Melhorias futuras

A partir do que foi identificado ao longo do desenvolvimento, os próximos passos naturais do projeto seriam:

- Integrar de fato a célula de carga com o HX711, incluindo a calibração do fator de conversão para gramas, viabilizando RF08, RF09, RF12 e a margem de ± 5 g prevista na RNF01;
- Corrigir a função de reconexão ao broker MQTT para que, em caso de falha persistente, o firmware continue operando de forma autônoma com os dados salvos na memória flash, em vez de travar indefinidamente;
- Expor na interface do aplicativo a configuração do número de horários de alimentação (3, 4 ou 6 por dia), hoje fixa no backend;
- Completar o envio de eventos de alimentação ao CMS (horário, quantidade liberada e status do consumo), fechando o ciclo de RF13 e permitindo estatísticas mais completas na tela de acompanhamento do gato;
- Validar formalmente os requisitos não funcionais de tempo de resposta (RNF02) e de detecção NFC (RNF04) com testes repetidos e medições, em vez de observação manual via `Serial`;
- Migrar o protótipo para o hardware de referência original (ESP32), avaliando se os conflitos de biblioteca que motivaram o uso do ESP8266 (NodeMCU) se repetem nessa plataforma;
- Substituir os elementos de papelão do protótipo por peças impressas em 3D ou usinadas, aproximando a montagem física do produto final e permitindo testar a vedação do pote e o encaixe dos servomotores em condições mais realistas.

De forma geral, o projeto cumpriu seu papel de validar a arquitetura de comunicação entre aplicativo, backend e sistema embarcado, deixando claro que o principal esforço restante está concentrado na camada de sensoriamento de peso e na robustez da conectividade do firmware sendo pontos que, uma vez resolvidos, tornariam o Xanim's Vault funcional de ponta a ponta conforme especificado nos requisitos.
