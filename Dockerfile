FROM jongleberry/images

ADD . /simgr/
WORKDIR /simgr/

RUN npm install
