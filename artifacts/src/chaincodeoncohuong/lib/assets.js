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
    console.info('============= END : Create Nong Trai Thanh Cong ===========');
  }
  async updatedate(ctx, id, dataupdate) {
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
  async gethistorytimecreateandtransaction(ctx, id) {
    let historyresult = await ctx.stub.getHistoryForKey(id);

    // prepare the result
    const allResults = [];
    while (true) {
      const res = await historyresult.next();

      if (res.value) {
        allResults.push(res.value.toString('utf8'));

      }
      if (res.done) {
        await historyresult.close();
        return allResults
      }
    }
  }
}

module.exports = IOTContract