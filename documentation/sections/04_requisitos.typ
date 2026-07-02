= Requisitos funcionais e não funcionais

Nesta seção são apresentados os requisitos finais do sistema, já refinados a partir da proposta inicial.

== Requisitos funcionais

*RF01 Cadastro do animal.* O aplicativo deve permitir o cadastro de um gato contendo nome, peso, idade, status de castração e identificador NFC.

*RF02 Geração do plano alimentar.* O CMS deve calcular automaticamente a quantidade diária de ração com base nas características cadastradas do gato, utilizando por padrão 4 horários.

*RF03 Configuração de horários.* O aplicativo deve permitir configurar 3, 4 ou 6 horários de alimentação diária.

*RF04 Distribuição das porções.* O CMS deve dividir automaticamente a quantidade diária de ração entre os horários configurados.

*RF05 Sincronização com o sistema embarcado.* O CMS deve enviar ao sistema embarcado, via MQTT, os horários de alimentação, a quantidade de ração por porção e o identificador NFC autorizado.

*RF06 Persistência local.* O sistema embarcado deve armazenar em memória flash o identificador NFC, os horários de alimentação e a quantidade por porção.

*RF07 Atualização de dados.* O sistema embarcado deve atualizar os dados armazenados localmente sempre que novas configurações forem recebidas do CMS.

*RF08 Liberação automática da ração.* O sistema embarcado deve liberar automaticamente a porção programada nos horários definidos, junto de um alerta sonoro via buzzer.

*RF09 Controle da quantidade liberada.* O sistema embarcado deve utilizar uma balança para medir a quantidade de ração liberada, interrompendo a liberação quando a quantidade programada for atingida.

*RF10 Identificação NFC.* O sistema embarcado deve detectar tags NFC posicionadas a até 4 cm do leitor.

*RF11 Validação de acesso.* O sistema embarcado deve comparar a tag NFC detectada com a tag cadastrada. Caso válida, o acesso ao pote deve ser permitido; caso contrário, o pote deve ser bloqueado e um alerta enviado ao CMS.

*RF12 Monitoramento do consumo.* O sistema embarcado deve monitorar o peso restante da ração liberada utilizando a célula de carga, registrando o peso da porção logo após a liberação e realizando leituras periódicas e estabilizadas do peso restante. O consumo é classificado como:
- Consumo total: peso restante inferior a 10% da porção liberada;
- Consumo parcial: peso restante entre 11% e 90% da porção liberada;
- Consumo não realizado: peso restante superior a 90% da porção liberada.

*RF13 Registro de eventos.* O sistema embarcado deve enviar ao CMS o horário da alimentação, a quantidade liberada, o status do consumo, a identificação NFC detectada e eventuais alertas de acesso inválido.

*RF14 Operação offline.* O sistema embarcado deve continuar operando com base nos dados salvos na memória flash quando estiver sem conexão com a internet ou com o broker MQTT.

*RF15 Visualização de estatísticas.* O aplicativo deve permitir visualizar os horários em que o gato se alimentou, o consumo parcial ou completo, as tentativas de acesso por outros gatos e os alertas gerados pelo sistema.

== Requisitos não funcionais

*RNF01 Precisão da liberação.* O sistema embarcado deve possuir margem de erro máxima de ± 5 g na liberação da ração.

*RNF02 Tempo de resposta do bloqueio.* O mecanismo de fechamento do pote deve responder em até 1 segundo após a identificação de uma tag NFC inválida.

*RNF03 Persistência de dados.* As informações armazenadas em memória flash devem permanecer disponíveis mesmo após reinicialização inesperada ou queda de energia do sistema embarcado.

*RNF04 Tempo de detecção NFC.* A tag NFC deve ser detectada em no máximo 1 segundo após a aproximação ao leitor.

*RNF05 Comunicação.* A comunicação entre o servidor (CMS) e o sistema embarcado deve utilizar o protocolo MQTT, via broker Mosquitto, enquanto a comunicação entre o aplicativo e o CMS deve utilizar o protocolo HTTP.

*RNF06 Funcionamento offline.* O sistema embarcado deve manter o funcionamento básico mesmo sem conexão com a internet.

*RNF07 Sincronização de configurações.* Novas configurações recebidas via MQTT devem sobrescrever os dados armazenados anteriormente na memória flash.

== Regras de sistema

- *RN01*: A soma das porções distribuídas ao longo do dia deve ser igual à quantidade diária calculada pelo CMS.
- *RN02*: Somente a tag NFC cadastrada para o gato pode acessar o seu pote de ração.
- *RN03*: A liberação da ração deve ocorrer apenas nos horários programados.
- *RN04*: Cada evento de alimentação deve gerar um registro armazenado no CMS.
