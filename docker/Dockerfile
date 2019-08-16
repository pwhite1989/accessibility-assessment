FROM selenium/standalone-chrome-debug:3.141.59-titanium

ENV USER_HOME /home/seluser
ENV ELS_BULK_UPLOAD_API http://host.docker.internal:9200/accessibility/violations/_bulk?pretty
ENV TEST_SUITE_NAME test-suite
ENV JENKINS_BASE_URI https://build.tax.service.gov.uk
ENV JENKINS_TEST_FOLDER job/PlatOps/job/Testing/job
ENV JENKINS_USERNAME jenkins.user
ENV JENKINS_API_KEY 1234abcd
ENV NVM_DIR="$HOME/.nvm"
ENV PATH="/home/seluser/.nvm/versions/node/v10.12.0/bin:${PATH}"
ENV AXE_VERSION 1
ENV PA11Y_VERSION 1
ENV VNU_VERSION 1
ENV CHROME_DRIVER_VERSION 1

USER root

WORKDIR ${USER_HOME}

COPY --chown=seluser:seluser files/entry_point.sh /opt/scripts/entry_point.sh
COPY --chown=seluser:seluser files/pa11y-config.json /home/seluser/pa11y-config.json
COPY --chown=seluser:seluser files/assessAllPages.sh /home/seluser/test-suites/assessAllPages.sh
COPY --chown=seluser:seluser files/a11y-report-parser/ /home/seluser/a11y-report-parser
COPY --chown=seluser:seluser files/load-alert-data.sh /home/seluser/load-alert-data.sh

RUN sudo chmod 755 /opt/scripts/entry_point.sh \
      && sudo chmod 755 /home/seluser/test-suites/assessAllPages.sh \
      && sudo chmod 755 /home/seluser/load-alert-data.sh \
      && sudo chmod 755 /home/seluser/pa11y-config.json \
      && sudo chmod -R 755 /home/seluser/a11y-report-parser \
      && sudo mkdir $NVM_DIR \
      && sudo chown seluser:seluser $NVM_DIR \
      && sudo echo -e '#!/bin/bash\njava -jar /home/seluser/.nvm/versions/node/v10.12.0/lib/node_modules/vnu-jar/build/dist/vnu.jar "$@"' > /usr/bin/vnu \
      && chmod +x /usr/bin/vnu

RUN wget -q www.scala-lang.org/files/archive/scala-2.11.8.deb \
      && sudo dpkg -i scala-2.11.8.deb \
      && echo "deb https://dl.bintray.com/sbt/debian /" | sudo tee -a /etc/apt/sources.list.d/sbt.list \
      && sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2EE0EA64E40A89B84B2DF73499E82A75642AC823 \
      && sudo apt-get update \
      && sudo apt-get -y install sbt

USER seluser

RUN cd ~/a11y-report-parser \
      && sbt compile \
      && cd $USER_HOME \
      && echo "10.12.0" > .nvmrc \
      && mv .nvmrc .nvmrc.bk \
      && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash \
      && . "$HOME/.nvm/nvm.sh" \
      && mv .nvmrc.bk .nvmrc \
      && nvm install \
      && npm upgrade \
      && npm install axe-cli -g \
      && cd .nvm/versions/node/v10.12.0/lib/node_modules/axe-cli/ \
      && npm install chromedriver@76.0.0 --save-dev \
      && cd $USER_HOME \
      && npm install pa11y -g \
      && npm install vnu-jar -g

CMD ["/bin/bash", "/opt/scripts/entry_point.sh"]
