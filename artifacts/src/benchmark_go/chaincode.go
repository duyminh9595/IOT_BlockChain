package main

import (
	"encoding/json"
	"bytes"
	"fmt"
	"strconv"
	"time"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)
type SmartContract struct {
	contractapi.Contract
}
//data import
type DataTest struct {
	ID      string `json:"id"`
	Data    string `json:"data"`
}

func (s *SmartContract) CreateData(ctx contractapi.TransactionContextInterface, id string,dataInput string) error {

	dataTemplate:=DataTest{
		ID:id,
		Data:dataInput,
	}
	dataTemplateJSON, err :=json.Marshal(dataTemplate)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(id,dataTemplateJSON)
}

func (s *SmartContract) ReadData(ctx contractapi.TransactionContextInterface, id string) (*DataTest,error) {

	dataInJSON, err := ctx.GetStub().GetState(id)
	if err != nil{
		return nil,err
	}
	var data DataTest
	json.Unmarshal(dataInJSON, &data)
	
	return &data , nil
}


func (s *SmartContract) UpdateData(ctx contractapi.TransactionContextInterface, id string,dataInput string) error {

	dataTemplate:=DataTest{
		ID:id,
		Data:dataInput,
	}
	dataTemplateJSON,err :=json.Marshal(dataTemplate)
	if err != nil{
		return err
	}
	return ctx.GetStub().PutState(id,dataTemplateJSON)
}


func (s *SmartContract) DeleteData(ctx contractapi.TransactionContextInterface, id string) error {

	return ctx.GetStub().DelState(id)
}
func (s *SmartContract) GetHistoryData(ctx contractapi.TransactionContextInterface, id string) (string, error) {

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(id)
	if err != nil {
		return "", fmt.Errorf(err.Error())
	}
	defer resultsIterator.Close()

	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return "", fmt.Errorf(err.Error())
		}
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return string(buffer.Bytes()), nil
}



func main() {
	smartContract := new(SmartContract)

	cc, err := contractapi.NewChaincode(smartContract)

	if err != nil {
		panic(err.Error())
	}

	if err := cc.Start(); err != nil {
		panic(err.Error())
	}
}