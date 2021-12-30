# first setup
docker swarm leave --force
docker rm -vf $(docker ps -aq) && docker volume prune -f
docker network prune
rm -r -f /home/ubuntu/Demo-135
# docker swarm
cohuong: 35.224.10.90
thayson orderer: dm org 34.67.248.87
docker swarm init --advertise-addr 34.67.248.87
docker swarm join --token SWMTKN-1-4p7y8l7j1kweme2zt7c8iat0st44tiub9rbimvd2ovbg4976q7-73j8aek6p4ckb7f8q2mvp0vdw 35.224.10.90:2377 --advertise-addr 34.67.248.87
docker network create --attachable --driver overlay artifacts_thesis

# remove ca
cd /home/ubuntu/Demo-135/setup1/thayson
rm -r -f ../thayson/crypto-config/
rm -r -f ../thayson/channel-artifacts/*
rm -r -f ../thayson/create-certificate-with-ca/fabric-ca/
rm -r -f ../cohuong/crypto-config/
rm -r -f ../cohuong/create-certificate-with-ca/fabric-ca/
rm -r -f ../orderer/crypto-config/
rm -r -f ../orderer/create-certificate-with-ca/fabric-ca/
rm -r -f /home/ubuntu/Demo-135/

chmod 777 -R *
git add *
git commit -m "D"
git push origin
git clone https://github.com/duyminh9595/Demo-135.git
duyminh95@gmail.com
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

# tạo ca
cd /home/ubuntu/Demo-135/setup1/thayson/create-certificate-with-ca/
docker-compose up -d
./create-certificate-with-ca.sh 
cd ../../cohuong/create-certificate-with-ca/
docker-compose up -d
./create-certificate-with-ca.sh 
cd ../../orderer/create-certificate-with-ca/
docker-compose up -d
./create-certificate-with-ca.sh 
cd ../../../artifacts/channel/
./create-artifacts.sh 

cd /home/ubuntu/Demo-135/setup1/thayson
docker-compose up -d
cd /home/ubuntu/Demo-135/setup1/orderer
docker-compose up -d
cd /home/ubuntu/Demo-135/setup1/cohuong
docker-compose up -d
cd /home/ubuntu/Demo-135/setup1/thayson/create-certificate-with-ca/
docker-compose up -d

# api
docker stop artifacts_api_1

docker rm artifacts_api_1
docker exec -it artifacts_api_1 sh
docker logs artifacts_api_1 -f

http://35.224.10.90:4000/api/addusertransactiontotarget
http://35.224.10.90:4000/api/adduserspending
http://35.224.10.90:4000/api/adduserincome


# add extra hosts
extra_hosts:
      - "orderer.thesis.com:34.71.102.58"
      - "orderer2.thesis.com:34.71.102.58"
      - "orderer3.thesis.com:34.71.102.58"
      - "peer0.thayson.thesis.com:34.71.102.58"
      - "peer1.thayson.thesis.com:34.71.102.58"
      - "peer0.cohuong.thesis.com:34.71.102.58"
      - "peer1.cohuong.thesis.com:34.71.102.58"


# code in cli
docker exec -it cli bash



export CORE_PEER_LOCALMSPID="thaysonMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/users/Admin@thayson.thesis.com/msp
export CORE_PEER_ADDRESS=peer0.thayson.thesis.com:7051
export CHANNEL_NAME="mychannel"
export CC_NAME="thesis"
export ORDERER_CA=/etc/hyperledger/channel/crypto-config/ordererOrganizations/thesis.com/orderers/orderer.thesis.com/msp/tlscacerts/tlsca.thesis.com-cert.pem
export VERSION="1"

peer lifecycle chaincode commit -o orderer.thesis.com:7050 --ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
--channelID $CHANNEL_NAME --name ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
--peerAddresses peer0.cohuong.thesis.com:9051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/cohuong.thesis.com/peers/peer0.cohuong.thesis.com/tls/ca.crt \
--version ${VERSION} --sequence ${VERSION} --init-required


peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
--peerAddresses peer0.cohuong.thesis.com:9051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/cohuong.thesis.com/peers/peer0.cohuong.thesis.com/tls/ca.crt \
--isInit -c '{"Args":["registerUser","@gmail.com","123456","le quang duy minh","07/06/1995"]}' --isInit


peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
--peerAddresses peer0.cohuong.thesis.com:9051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/cohuong.thesis.com/peers/peer0.cohuong.thesis.com/tls/ca.crt \
-c '{"Args":["registerUser","duyminh95@gmail.com","123456","le quang duy minh","07/06/1995"]}'

peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls \
--cafile /etc/hyperledger/channel/crypto-config/ordererOrganizations/thesis.com/orderers/orderer.thesis.com/msp/tlscacerts/tlsca.thesis.com-cert.pem \
-C mychannel -n thesis \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
--peerAddresses peer0.cohuong.thesis.com:9051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/cohuong.thesis.com/peers/peer0.cohuong.thesis.com/tls/ca.crt \
-c '{"function": "createCar","Args":["666666", "Audi", "R8", "Red", "Sandip"]}'


peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
--peerAddresses peer0.cohuong.thesis.com:9051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/cohuong.thesis.com/peers/peer0.cohuong.thesis.com/tls/ca.crt \
-c '{"Args":["addIncomeUser","duyminh95@gmail.com","OK1","45000","VND","1","1","12/2/312"]}' 

peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "seeAllUserIncome","Args":["dongok3@gmail.com"]}' | jq .

peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
--peerAddresses peer0.cohuong.thesis.com:9051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/cohuong.thesis.com/peers/peer0.cohuong.thesis.com/tls/ca.crt \
-c '{"function": "changePassword","Args":["666666", "Audi", "R8", "Red", "Sandip"]}'
-c  "function": "createCar"'{"Args":["changePassword","kok@gmail.com","cuoi quyen"]}' 

docker exec -it artifacts_api_1 sh