FROM jongleberry/images:latest

ADD . /simgr/
WORKDIR /simgr/

RUN npm install
