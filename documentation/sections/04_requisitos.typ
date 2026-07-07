= Requisitos funcionais e não funcionais

Nesta seção são apresentados os requisitos finais do sistema, já refinados a partir da proposta inicial.

== Requisitos funcionais

=== RF01 - Cadastro do animal
O sistema deve permitir o cadastro de um gato contendo as informações de nome, peso, data de nascimento, status de castração e identificador NFC;

=== RF02 - Geração do plano alimentar
O sistema calcula automaticamente a quantidade diária de ração com base nas características cadastradas do gato, considerando a quantidade de refeições configurada pelo usuário (3, 4 ou 6 por dia).

=== RF03 - Configuração e distribuição das refeições
O sistema permite configurar 3, 4 ou 6 refeições por dia, com definição manual dos horários de alimentação, e distribui automaticamente a quantidade diária de ração entre os horários configurados.

=== RF04 - Operação offline
O sistema deve continuar operando utilizando dados salvos na memória quando estiver sem conexão com Internet.

=== RF05 - Atualização de dados
O embarcado deve atualizar os dados armazenados localmente sempre que novas configurações forem recebidas da API.

=== RF06 - Liberação e controle da ração
O sistema deve liberar automaticamente a porção programada nos horários definidos, junto de um alarme sonoro.

=== RF07 - Identificação NFC
O sistema deve detectar tags NFC posicionadas a até 4 cm do leitor e comparar a tag detectada com a cadastrada se houver. Caso seja válida, o acesso ao pote deve ser permitido; caso contrário, o pote deve ser bloqueado e um alerta enviado à API.

=== RF08 - Monitoramento do consumo
O sistema deve monitorar o consumo do gato a partir do peso da balança e enviar registros de consumo (ou ausência dele) 60 segundos antes do próximo horário de liberação. O consumo deve ser classificado como:
- Consumo total => até 10%
- Consumo parcial => 11% até 90%
- Não consumiu => acima de 90%
O consumo será registrado dessa forma para evitar variações na balança ao longo do tempo.

=== RF09 - Visualização de estatísticas
O sistema deve permitir visualizar: horários em que o gato se alimentou; consumo parcial ou completo; tentativas de acesso por outros gatos; alertas gerados pelo sistema.

=== RF10 - Registro de Eventos
O embarcado deve enviar à API: horário da alimentação; quantidade liberada; status do consumo;identificação NFC detectada; alertas de acesso inválido.

== Requisitos não funcionais

=== RNF01 - Persistência local
Os dados devem persistir mesmo quando o sistema esteja offline.

=== RNF02 - Confiabilidade após queda de energia
Os dados armazenados na memória flash não devem ser perdidos em caso de queda de energia ou reinicialização inesperada.

=== RNF03 - Precisão na liberação
A liberação deve ser interrompida quando a quantidade programada for atingida com margem de erro de ± 5g.

=== RNF04 - Tempo de resposta do bloqueio
Ao detectar aproximação indevida, o sistema irá fechar o pote em até 1 segundo e enviar um alertar à API.

=== RNF05 - Comunicação
A comunicação entre o servidor e o sistema embarcado deve utilizar o protocolo MQTT via broker Mosquitto e HTTP do servidor para o app WEB.

=== RNF06 - Tempo de detecção NFC
A tag NFC deve ser detectada em no máximo 1 segundo após a aproximação ao leitor.

== Regras de sistema

- *RN01*: A soma das porções distribuídas ao longo do dia deve ser igual à quantidade diária calculada pelo CMS.
- *RN02*: Somente a tag NFC cadastrada para o gato pode acessar o seu pote de ração.
- *RN03*: A liberação da ração deve ocorrer apenas nos horários programados.
- *RN04*: Cada evento de alimentação deve gerar um registro armazenado no CMS.
