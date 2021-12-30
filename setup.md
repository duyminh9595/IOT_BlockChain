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
--version ${VERSION} --sequence ${VERSION} --init-required

//tao nong trai
peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["registerNongTrai","Cô Hường","Nông trại Cô Hường là nông trại cung cấp các loại rau củ, nấm rơm chất lượng","10 Huỳnh Văn Nghệ, Bửu Long, Thành phố Biên Hòa, Đồng Nai, Việt Nam","0123456789","vinhphuc@email.com","www.google.com","facebook.com/vinhphuc","https://google.com/imghp","https://www.google.com/maps/@10.9539723,106.7997188,18.92z"]}' --isInit

//xem nong trai by id
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "querryNongTrai","Args":["413f4deccc0b2db7b951ad0d45695edd3a61fbbe86f352a98b12a20da1dd600b"]}' | jq .

//xem tat ca nong trai
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "xemTatCaNongTrai","Args":[]}' | jq .

//key 1: 5af0948e541c00afcafc2731b9bf5bc7c220cd3bc5c9e93179569b68215993b6
//key 2: 9d9283b28364ff4f8ed1037b7ed3eecbcbd44c8ae9e1422f910933328496a924
//key 3: 21d883ac7a112571099a228a95246a9f25df4b33bf911627b05b4fbde0d84455
//them sản phẩm vào nông trại
peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["themsanphamnongtrai","5af0948e541c00afcafc2731b9bf5bc7c220cd3bc5c9e93179569b68215993b6","Nấm rơm","Nấm rơm hay nấm mũ rơm là một loài nấm trong họ nấm lớn sinh trưởng và phát triển từ các loại rơm rạ."]}'

peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["themsanphamnongtrai","5af0948e541c00afcafc2731b9bf5bc7c220cd3bc5c9e93179569b68215993b6","Đồ ngốk","OK Ngốk"]}'

# Xem nông sản của nông trại 1
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "xemTatCaSanPhamCua1NongTrai","Args":["5af0948e541c00afcafc2731b9bf5bc7c220cd3bc5c9e93179569b68215993b6"]}' | jq .

peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "xemTatCaSanPhamCua1NongTrai","Args":["9d9283b28364ff4f8ed1037b7ed3eecbcbd44c8ae9e1422f910933328496a924"]}' | jq .

# xem tat ca nông sản
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "xemTatCaSanPham","Args":[]}' | jq .

# key 1: 9d9283b28364ff4f8ed1037b7ed3eecbcbd44c8ae9e1422f910933328496a924
# key 2: 9d9283b28364ff4f8ed1037b7ed3eecbcbd44c8ae9e1422f910933328496a924
# key 3: 21d883ac7a112571099a228a95246a9f25df4b33bf911627b05b4fbde0d84455

# them khu vuc cho nong trai
peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["addAreaToAFarm","Nhà 1","Nhà trồng nấm rơm","5af0948e541c00afcafc2731b9bf5bc7c220cd3bc5c9e93179569b68215993b6"]}'

peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["addAreaToAFarm","Nhà 1","Nhà đồ ngốk","5af0948e541c00afcafc2731b9bf5bc7c220cd3bc5c9e93179569b68215993b6"]}'

peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["addAreaToAFarm","Nhà 2","Nhà trồng nấm mối","5af0948e541c00afcafc2731b9bf5bc7c220cd3bc5c9e93179569b68215993b6"]}'

# Xem khu vuc  của nông trại 1
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "xemTatCaKhuVucCua1NongTrai","Args":["5af0948e541c00afcafc2731b9bf5bc7c220cd3bc5c9e93179569b68215993b6"]}' | jq .

# Xem tất cả khu vuc 
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "xemTatCaArea","Args":[]}' | jq .

# dang ky nguoi dung
peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["registerUser","Lê Quang Duy Minh","avatar","duyminh", "phone", "address", "facebook", "role", "portfolio", "password"]}'
# xem tat ca nguoi dung cua 1 to chuc
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "xemTatCaUserCuaToChuc","Args":[]}' | jq .
# query user
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "queryUser","Args":["duyminh"]}' | jq .
# doi mat khau
peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["changePassword","duyminh", "123456"]}'


# tao vụ mùa mới
peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["createplantingseason","Gieo trồng bất hiếu","0c20fd3e0f1e4b9e1229ae3ed0080fbd13942668fca8d8a4da96d997219f9515","duyminh"]}'

# query vu mua
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "getCsByYearMonthDate","Args":["2021~11~30~thaysonMSP~4566f95839248acbddaaf9e444cfdf2f9fd794fef08c22323f920dfd0d31d0ee"]}' | jq .
# query tat ca vu mua cua organization
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "getAllPlantingSeasonByMsp","Args":[]}' | jq .

# tạo đợt gieo trồng mới
peer chaincode invoke -o orderer.thesis.com:7050 \
--ordererTLSHostnameOverride orderer.thesis.com \
--tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n ${CC_NAME} \
--peerAddresses peer0.thayson.thesis.com:7051 --tlsRootCertFiles /etc/hyperledger/channel/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt \
-c '{"Args":["createPlanting","2021~11~30~thaysonMSP~7a611737eef7ca9c4b2185ffcfc373127df2435520ce11b5898be832a7358713","duyminh","Nhập giống từ nhà cung cấp B","Nhập giống từ nhà cung cấp B"]}'

# get all dot gieo trong the organization
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "getPlantingbymsp","Args":[]}' | jq .

# get all dot gieo trong theo organization va vu mua
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "getPlantingbymspandplantingseason","Args":["2021~11~30~thaysonMSP~7a611737eef7ca9c4b2185ffcfc373127df2435520ce11b5898be832a7358713"]}' | jq .



docker exec -it artifacts_api_1 sh