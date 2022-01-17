export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/../orderer/crypto-config/ordererOrganizations/thesis.com/orderers/orderer.thesis.com/msp/tlscacerts/tlsca.thesis.com-cert.pem
export PEER0_thayson_CA=${PWD}/crypto-config/peerOrganizations/thayson.thesis.com/peers/peer0.thayson.thesis.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/../../artifacts/channel/config/

export CHANNEL_NAME=channelthayson

setGlobalsForPeer0thayson(){
    export CORE_PEER_LOCALMSPID="thaysonMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_thayson_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/thayson.thesis.com/users/Admin@thayson.thesis.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}
setGlobalsForPeer1thayson(){
    export CORE_PEER_LOCALMSPID="thaysonMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_thayson_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/thayson.thesis.com/users/Admin@thayson.thesis.com/msp
    export CORE_PEER_ADDRESS=localhost:8051
}
createChannel(){
    setGlobalsForPeer0thayson
 
    # Replace localhost with your orderer's vm IP address
    peer channel create -o localhost:7050 -c $CHANNEL_NAME \
    --ordererTLSHostnameOverride orderer.thesis.com \
    -f ./../../artifacts/channel/${CHANNEL_NAME}.tx --outputBlock ./channel-artifacts/${CHANNEL_NAME}.block \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
}
joinChannel(){
    setGlobalsForPeer0thayson
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
    setGlobalsForPeer1thayson
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
}
updateAnchorPeers(){
    setGlobalsForPeer0thayson
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.thesis.com -c $CHANNEL_NAME -f \
        ./../../artifacts/channel/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
}
checkjoin()
{
    setGlobalsForPeer0thayson
    peer channel list
    setGlobalsForPeer1thayson
    peer channel list
}
# updateAnchorPeers

# removeOldCrypto

createChannel
joinChannel
updateAnchorPeers
checkjoin
