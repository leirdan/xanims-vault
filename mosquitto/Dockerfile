FROM eclipse-mosquitto:latest
RUN mkdir -p /mosquitto/config /mosquitto/data /mosquitto/log
COPY ./config/mosquitto.conf /mosquitto/config/mosquitto.conf
RUN touch /mosquitto/config/pwfile
USER root
RUN chown -R mosquitto:mosquitto /mosquitto && chmod 600 /mosquitto/config/pwfile
USER mosquitto
EXPOSE 1883 9001