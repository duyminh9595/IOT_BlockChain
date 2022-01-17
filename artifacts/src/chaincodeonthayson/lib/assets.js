'use strict';

// SDK Library to asset with writing the logic 
const { Contract } = require('fabric-contract-api');

class IOTContract extends Contract {

  constructor() {
    super('IOTContract');
    this.TxId = ''
  }

  async beforeTransaction(ctx) {
    // default implementation is do nothing
    this.TxId = ctx.stub.getTxID();
    console.log(`we can do some logging for ${this.TxId}  and many more !!`)
  }

  async adddata(ctx, id, data) {
    const dataadd = {
      data
    };
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(dataadd)));
  }
  async updatedata(ctx, id, dataupdate) {
    const dataHasAdded = await ctx.stub.getState(id);
    if (!dataHasAdded || dataHasAdded.length === 0) {
      throw new Error(`${dataHasAdded} does not exist`);
    }
    const data = JSON.parse(dataHasAdded.toString());
    data.data = dataupdate;
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(data)));
    console.log("Update success")
  }
  async deldata(ctx, id) {
    const dataHasAdded = await ctx.stub.getState(id);
    if (!dataHasAdded || dataHasAdded.length === 0) {
      throw new Error(`${dataHasAdded} does not exist`);
    }
    await ctx.stub.deleteState(id);
    console.log(`${id} has been deleted)`)
  }
  async gethistory(ctx, id) {
    let historyresult = await ctx.stub.getHistoryForKey(id);

    // prepare the result
    const allResults = [];
    while (true) {
      const res = await historyresult.next();

      if (res.value) {
        const datahistory = {
          transaciton: res.value.txId,
          data: res.value.value.toString('utf8'),
          thoigian: new Date(res.value.timestamp.seconds.low * 1000).toString(),
          isDelete: res.value.isDelete
        };
        console.log(res.value.timestamp.Seconds)
        allResults.push(datahistory);

      }


      if (res.done) {
        await historyresult.close();
        return allResults;
      }
    }
  }
}

module.exports = IOTContract