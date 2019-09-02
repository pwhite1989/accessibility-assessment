FROM selenium/node-chrome:3.141.59-titanium

ENV ELS_HOST http://host.docker.internal:9200
ENV ELS_INDEX accessibility
ENV ELS_BULK_UPLOAD_API ${ELS_HOST}/${ELS_INDEX}/violations/_bulk?pretty
ENV TEST_SUITE_NAME ""
ENV JENKINS_BASE_URI https://build.tax.service.gov.uk
ENV JENKINS_TEST_FOLDER job/PlatOps/job/Testing/job
ENV JENKINS_USERNAME jenkins.user
ENV JENKINS_API_KEY 1234abcd
ENV NODE_VERSION 10.12.0
ENV NPM_AXE_VERSION 3.1.0
ENV NPM_PA11Y_VERSION 5.2.0
ENV NPM_VNU_VERSION 19.6.7
ENV NPM_CHROME_DRIVER_VERSION 76.0.0
ENV SCALA_VERSION 2.11.8
ENV NVM_DIR $HOME/.nvm
ENV PATH="${NVM_DIR}/versions/node/v${NODE_VERSION}/bin:${PATH}"

USER root

WORKDIR ${HOME}

COPY --chown=seluser:seluser files/entry_point.sh /opt/scripts/entry_point.sh
COPY --chown=seluser:seluser files/pa11y-config.json ${HOME}/pa11y-config.json
COPY --chown=seluser:seluser files/assessAllPages.sh ${HOME}/test-suites/assessAllPages.sh
COPY --chown=seluser:seluser files/accessibility-assessment-report-parser.jar ${HOME}/accessibility-assessment-report-parser.jar 
COPY --chown=seluser:seluser files/load-alert-data.sh ${HOME}/load-alert-data.sh

RUN sudo chmod 755 /opt/scripts/entry_point.sh \
      && sudo chmod 755 ${HOME}/test-suites/assessAllPages.sh \
      && sudo chmod 755 ${HOME}/load-alert-data.sh \
      && sudo chmod 755 ${HOME}/pa11y-config.json \
      && sudo mkdir $NVM_DIR \
      && sudo chown seluser:seluser $NVM_DIR \
      && sudo echo -e '#!/bin/bash\njava -jar ${HOME}/.nvm/versions/node/v${NODE_VERSION}/lib/node_modules/vnu-jar/build/dist/vnu.jar "$@"' > /usr/bin/vnu \
      && chmod +x /usr/bin/vnu

USER seluser

RUN   cd ${HOME} \
      && echo "${NODE_VERSION}" > .nvmrc \
      && mv .nvmrc .nvmrc.bk \
      && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash \
      && . "${NVM_DIR}/nvm.sh" \
      && mv .nvmrc.bk .nvmrc \
      && nvm install \
      && npm upgrade \
      && npm install axe-cli@${NPM_AXE_VERSION} -g \
      && cd ${NVM_DIR}/versions/node/v${NODE_VERSION}/lib/node_modules/axe-cli/ \
      && npm install chromedriver@${NPM_CHROME_DRIVER_VERSION} --save-dev \
      && cd ${HOME} \
      && npm install pa11y@${NPM_PA11Y_VERSION} -g \
      && npm install vnu-jar@${NPM_VNU_VERSION} -g

CMD ["/bin/bash", "/opt/scripts/entry_point.sh"]
