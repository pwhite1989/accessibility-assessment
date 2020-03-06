FROM selenium/node-chrome:3.141.59-titanium

ENV CAPTURE_ALL_PAGES false
ENV APP_PORT 6010
ENV JENKINS_USERNAME jenkins.user
ENV JENKINS_API_KEY 1234abcd
ENV LOG_EXPORT_WAIT 30
ENV NODE_VERSION 10.12.0
ENV NPM_AXE_VERSION 3.1.0
ENV NPM_VNU_VERSION 19.6.7
ENV NPM_CHROME_DRIVER_VERSION 76.0.0
ENV SCALA_VERSION 2.11.8
ENV NVM_DIR $HOME/.nvm
ENV PATH="${NVM_DIR}/versions/node/v${NODE_VERSION}/bin:${PATH}"

USER root

WORKDIR ${HOME}

COPY --chown=seluser:seluser files/start.sh ${HOME}/start.sh
COPY --chown=seluser:seluser files/generate_report.sh ${HOME}/generate_report.sh
COPY --chown=seluser:seluser files/run_assessment.sh ${HOME}/run_assessment.sh
COPY --chown=seluser:seluser files/page-accessibility-check.jar ${HOME}/page-accessibility-check.jar
COPY --chown=seluser:seluser files/app ${HOME}/app
COPY --chown=seluser:seluser files/report ${HOME}/report

RUN sudo chmod 777 ${HOME}/run_assessment.sh \
      && sudo chmod 777 ${HOME}/generate_report.sh \
      && sudo chmod 755 ${HOME}/start.sh \
      && sudo chmod 755 ${HOME}/app/app.js \
      && sudo chmod 755 ${HOME}/report/prepare-report.js \
      && sudo mkdir ${HOME}/output \
      && sudo chmod 755 ${HOME}/output \
      && sudo chown -R seluser:seluser ${HOME}/output \
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
      && npm install vnu-jar@${NPM_VNU_VERSION} -g \
      && cd ${HOME}/app \
      && npm install \
      && cd ${HOME}/report \
      && npm install

EXPOSE 6010

CMD ["/bin/bash", "/home/seluser/start.sh"]
