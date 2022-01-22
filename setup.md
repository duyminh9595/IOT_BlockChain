# first setup
docker swarm leave --force
docker rm -vf $(docker ps -aq) && docker volume prune -f
docker network prune
rm -r -f /home/ubuntu/IOT_BlockChain
# docker swarm
cohuong: 34.132.154.152
thayson orderer: dm org 34.121.207.85
docker swarm init --advertise-addr 34.121.207.85
docker swarm join --token SWMTKN-1-3ogumfkl4ep24jh33zj0arbn4osj3emky3h61alp2m0shvto83-35pdxzkefl69so0p2uh1xz6xc 34.121.207.85:2377 --advertise-addr 34.132.154.152
docker network create --attachable --driver overlay artifacts_thesis

# remove ca
cd /home/duyminh95/IOT_BlockChain/setup1/thayson
rm -r -f ../thayson/crypto-config/
rm -r -f ../thayson/channel-artifacts/*
rm -r -f ../thayson/create-certificate-with-ca/fabric-ca/
rm -r -f ../cohuong/crypto-config/
rm -r -f ../cohuong/create-certificate-with-ca/fabric-ca/
rm -r -f ../orderer/crypto-config/
rm -r -f ../orderer/create-certificate-with-ca/fabric-ca/
rm -r -f ../cohuong/channel-artifacts/*

chmod 777 -R *
git add *
git commit -m "D"
git push origin
git clone https://github.com/duyminh9595/IOT_BlockChain.git
duyminh95@gmail.com
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

# tạo ca
cd /home/duyminh95/IOT_BlockChain/setup1/thayson/create-certificate-with-ca/
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

cd /home/ubuntu/IOT_BlockChain/setup1/thayson
docker-compose up -d
cd /home/ubuntu/IOT_BlockChain/setup1/orderer
docker-compose up -d
cd /home/ubuntu/IOT_BlockChain/setup1/cohuong
docker-compose up -d
cd /home/ubuntu/IOT_BlockChain/setup1/thayson/create-certificate-with-ca/
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
      - "orderer.thesis.com:34.121.207.85"
      - "orderer2.thesis.com:34.121.207.85"
      - "orderer3.thesis.com:34.121.207.85"
      - "peer0.thayson.thesis.com:34.121.207.85"
      - "peer1.thayson.thesis.com:34.121.207.85"
      - "peer0.cohuong.thesis.com:34.132.154.152"
      - "peer1.cohuong.thesis.com:34.132.154.152"


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


export CORE_PEER_LOCALMSPID="thaysonMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/users/Admin@thayson.thesis.com/msp
export CORE_PEER_ADDRESS=peer0.thayson.thesis.com:7051
export CHANNEL_NAME="channelthayson"
export CC_NAME="thesisonthayson"
export ORDERER_CA=/etc/hyperledger/channel/crypto-config/ordererOrganizations/thesis.com/orderers/orderer.thesis.com/msp/tlscacerts/tlsca.thesis.com-cert.pem
export VERSION="1"

export CORE_PEER_LOCALMSPID="thaysonMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/users/Admin@thayson.thesis.com/msp
export CORE_PEER_ADDRESS=peer0.thayson.thesis.com:7051
export CHANNEL_NAME="channelthayson"
export CC_NAME="goonthayson"
export ORDERER_CA=/etc/hyperledger/channel/crypto-config/ordererOrganizations/thesis.com/orderers/orderer.thesis.com/msp/tlscacerts/tlsca.thesis.com-cert.pem
export VERSION="1"

export CORE_PEER_LOCALMSPID="thaysonMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/users/Admin@thayson.thesis.com/msp
export CORE_PEER_ADDRESS=peer0.thayson.thesis.com:7051
export CHANNEL_NAME="channelcohuong"
export CC_NAME="thesiscohuong"
export ORDERER_CA=/etc/hyperledger/channel/crypto-config/ordererOrganizations/thesis.com/orderers/orderer.thesis.com/msp/tlscacerts/tlsca.thesis.com-cert.pem
export VERSION="1"

peer lifecycle chaincode commit -o orderer.thesis.com:7050 --ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
--channelID $CHANNEL_NAME --name ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
--peerAddresses peer0.cohuong.thesis.com:9051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/cohuong.thesis.com/peers/peer0.cohuong.thesis.com/tls/ca.crt \
--signature-policy "OR('thaysonMSP.member', 'cohuongMSP.member')" \
--version ${VERSION} --sequence ${VERSION} --init-required

peer lifecycle chaincode commit -o orderer.thesis.com:7050 --ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
--channelID $CHANNEL_NAME --name ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
--version ${VERSION} --sequence ${VERSION} --init-required


peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["registerNongTrai","Thầy Sơn 2","Nông trại Thầy Sơn là nông trại cung cấp các loại rau củ, nấm rơm chất lượng","10 Huỳnh Văn Nghệ, Bửu Long, Thành phố Biên Hòa, Đồng Nai, Việt Nam","0123456789","vinhphuc@email.com","www.google.com","facebook.com/vinhphuc","https://google.com/imghp","https://www.google.com/maps/@10.9539723,106.7997188,18.92z"]}' --isInit


peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["adddata","1","this is first data"]}' --isInit

peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["adddata","1","this is second data"]}'

peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["deldata","1"]}'

peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "getSanPhamOutputbymspandharvesting","Args":["624115009beb37818d762e336344275aa5134472c8bb6bbada42f3b4f46423d3"]}' | jq .

peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["UpdateData","1","this is first data"]}' --isInit

peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["UpdateData","1","this is third data"]}' 

peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["DeleteData","1"]}' 

peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "GetHistoryData","Args":["1"]}' | jq .


peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["DeleteData","1"]}' 

peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["CreateData","1","this is first data"]}' 

peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["updatedate","1","this is second data"]}'

peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["deldata","1"]}'

peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "gethistory","Args":["1"]}' | jq .

peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "gethistorytimecreateandtransaction","Args":["1"]}' | jq .



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

wget https://raw.githubusercontent.com/hyperledger/blockchain-explorer/main/examples/net1/config.json
wget https://raw.githubusercontent.com/hyperledger/blockchain-explorer/main/examples/net1/connection-profile/test-network.json -P connection-profile
wget https://raw.githubusercontent.com/hyperledger/blockchain-explorer/main/docker-compose.yaml