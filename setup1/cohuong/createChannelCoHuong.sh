export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/../orderer/crypto-config/ordererOrganizations/thesis.com/orderers/orderer.thesis.com/msp/tlscacerts/tlsca.thesis.com-cert.pem
export PEER0_cohuong_CA=${PWD}/crypto-config/peerOrganizations/cohuong.thesis.com/peers/peer0.cohuong.thesis.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/../../artifacts/channel/config/

export CHANNEL_NAME=channelcohuong

setGlobalsForPeer0cohuong() {
    export CORE_PEER_LOCALMSPID="cohuongMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_cohuong_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/cohuong.thesis.com/users/Admin@cohuong.thesis.com/msp
    export CORE_PEER_ADDRESS=localhost:9051

}
setGlobalsForPeer1cohuong() {
    export CORE_PEER_LOCALMSPID="cohuongMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_cohuong_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/cohuong.thesis.com/users/Admin@cohuong.thesis.com/msp
    export CORE_PEER_ADDRESS=localhost:10051

}
createChannel(){
    setGlobalsForPeer0cohuong
 
    # Replace localhost with your orderer's vm IP address
    peer channel create -o localhost:7050 -c $CHANNEL_NAME \
    --ordererTLSHostnameOverride orderer.thesis.com \
    -f ./../../artifacts/channel/${CHANNEL_NAME}.tx --outputBlock ./channel-artifacts/${CHANNEL_NAME}.block \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
}
joinChannel(){
    setGlobalsForPeer0cohuong
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
    setGlobalsForPeer1cohuong
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
}
updateAnchorPeers(){
    setGlobalsForPeer0cohuong
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.thesis.com -c $CHANNEL_NAME -f \
        ./../../artifacts/channel/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
}
checkjoin()
{
    setGlobalsForPeer0cohuong
    peer channel list
    setGlobalsForPeer1cohuong
    peer channel list
}
# updateAnchorPeers

# removeOldCrypto

createChannel
joinChannel
updateAnchorPeers
checkjoin