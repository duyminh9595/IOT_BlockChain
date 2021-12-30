'use strict';

// SDK Library to asset with writing the logic 
const { Contract } = require('fabric-contract-api');

class Cs01Contract extends Contract {

  constructor() {
    super('Cs01Contract');
    this.TxId = ''
  }

  async beforeTransaction(ctx) {
    // default implementation is do nothing
    this.TxId = ctx.stub.getTxID();
    console.log(`we can do some logging for ${this.TxId}  and many more !!`)
  }


  //register user
  async registerUser(ctx, email, password, username, ngaysinh) {
    const user = {
      email,
      password,
      username,
      ngaysinh,
      balance: 0
    };
    await ctx.stub.putState(email, Buffer.from(JSON.stringify(user)));
    console.info('============= END : Create User ===========');
  }
  //login user
  async queryUser(ctx, email) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    console.log(userAsBytes.toString());
    return userAsBytes.toString();
  }
  //doi mat khau
  async changePassword(ctx, email, password) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    const userInfo = JSON.parse(userAsBytes.toString());
    userInfo.password = password;
    await ctx.stub.putState(email, Buffer.from(JSON.stringify(userInfo)));
    console.info('============= END : change Password User ===========');
  }
  //doi thong tin user
  async changeUserInfo(ctx, email, ngaysinh, username) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    const userInfo = JSON.parse(userAsBytes.toString());
    userInfo.username = username
    userInfo.ngaysinh = ngaysinh
    await ctx.stub.putState(email, Buffer.from(JSON.stringify(userInfo)));
    console.info('============= END : change User Info ===========');
  }
  //change balance of user
  async changeBalanceUser(ctx, email, amount) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    const userBalance = JSON.parse(userAsBytes.toString());
    userBalance.balance = amount;
    await ctx.stub.putState(email, Buffer.from(JSON.stringify(userBalance)));
    console.info('============= END : change Balance User ===========');
  }
  //add income
  async addIncomeUser(ctx, email, income_name, amount, currency, rate_currency, id_income, date_created) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    const userIncome = {
      email,
      date_created,
      income_name,
      amount,
      currency,
      rate_currency,
      docType: 'incomeuser',
      id_income,
      type: 'add'
    };
    try {

      await ctx.stub.putState(this.TxId, Buffer.from(JSON.stringify(userIncome)));

      const userBalance = JSON.parse(userAsBytes.toString());
      userBalance.balance = parseInt(userBalance.balance, 10) + parseInt(amount, 10) * parseInt(rate_currency, 10);
      await ctx.stub.putState(email, Buffer.from(JSON.stringify(userBalance)));
      console.info('============= END : change Balance User ===========');

      // compose the return values
      return {
        key: this.TxId
      };
    }
    catch (e) {
      throw new Error(`The tx ${this.TxId} can not be stored: ${e}`);
    }
  }
  //add spending
  async addSpendingUser(ctx, email, spend_name, amount, currency, rate_currency, id_spending, date_created) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    const userSpending = {
      email,
      date_created,
      spend_name,
      amount,
      currency,
      rate_currency,
      docType: 'spendinguser',
      id_spending,
      type: 'add'
    };
    try {
      await ctx.stub.putState(this.TxId, Buffer.from(JSON.stringify(userSpending)));
      const userBalance = JSON.parse(userAsBytes.toString());
      userBalance.balance = parseInt(userBalance.balance, 10) - parseInt(amount, 10) * parseInt(rate_currency, 10);
      await ctx.stub.putState(email, Buffer.from(JSON.stringify(userBalance)));
      // compose the return values
      return {
        key: this.TxId
      };
    }
    catch (e) {
      throw new Error(`The tx ${this.TxId} can not be stored: ${e}`);
    }
  }
  //add target de danh
  async addTarget(ctx, email, name_target, start_date, end_date, amount, currency, rate_currency, id) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    let _keyHelper = new Date();
    const userTarget = {
      email,
      name_target,
      start_date,
      end_date,
      amount: amount * rate_currency,
      current_balance: 0,
      currency,
      rate_currency,
      docType: 'target',
      id
    };
    try {
      await ctx.stub.putState(this.TxId, Buffer.from(JSON.stringify(userTarget)));

      // compose the return values
      return {
        key: this.TxId
      };
    }
    catch (e) {
      throw new Error(`The tx ${this.TxId} can not be stored: ${e}`);
    }
  }
  //update amount target
  async updateAmountTarget(ctx, id, amount) {
    const targetUserAsBytes = await ctx.stub.getState(id);
    if (!targetUserAsBytes || targetUserAsBytes.length === 0) {
      throw new Error(`${targetUserAsBytes} does not exist`);
    }
    const targetUser = JSON.parse(targetUserAsBytes.toString());
    targetUser.amount = amount;
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(targetUser)));
    console.info('============= END : change target User ===========');
  }
  //see all target of an email
  async seeAllTargetEmail(ctx, email) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = 'target';
    queryString.selector.email = email;
    let queryResults = await this.getQueryResultForQueryString(ctx.stub, JSON.stringify(queryString));
    return queryResults; //shim.success(queryResults);
  }
  //add transaction to target
  async addTransactionTarget(ctx, email, id_target, amount, currency, rate_currency, date_created) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    const userAddAmountTarget = {
      email,
      date_created,
      amount,
      currency,
      rate_currency,
      id_target
    };
    try {

      const targetUserAsBytes = await ctx.stub.getState(id_target);
      if (!targetUserAsBytes || targetUserAsBytes.length === 0) {
        throw new Error(`${targetUserAsBytes} does not exist`);
      }

      await ctx.stub.putState(this.TxId, Buffer.from(JSON.stringify(userAddAmountTarget)));

      const targetUser = JSON.parse(targetUserAsBytes.toString());
      targetUser.current_balance = parseInt(targetUser.current_balance, 10) + parseInt(amount, 10) * parseInt(rate_currency, 10);
      await ctx.stub.putState(id_target, Buffer.from(JSON.stringify(targetUser)));
      // compose the return values
      return {
        key: this.TxId
      };
    }
    catch (e) {
      throw new Error(`The tx ${this.TxId} can not be stored: ${e}`);
    }
  }
  //see transaction to target
  async seeTransactionHasAddedTarget(ctx, email, id_target) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    let queryString = {};
    queryString.selector = {};
    queryString.selector.email = email;
    queryString.selector.id_target = id_target;
    let queryResults = await this.getQueryResultForQueryString(ctx.stub, JSON.stringify(queryString));
    return queryResults; //shim.success(queryResults);
  }
  //see all user income
  async seeAllUserIncome(ctx, email) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = 'incomeuser';
    queryString.selector.email = email;
    let queryResults = await this.getQueryResultForQueryString(ctx.stub, JSON.stringify(queryString));
    return queryResults; //shim.success(queryResults);
  }
  //see all user spending base on income id
  async seeAllUserSpendingBaseIncomeId(ctx, email, id_income) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = 'incomeuser';
    queryString.selector.email = email;
    queryString.selector.id_income = id_income;
    let queryResults = await this.getQueryResultForQueryString(ctx.stub, JSON.stringify(queryString));
    return queryResults; //shim.success(queryResults);
  }
  //see all user spending
  async seeAllUserSpending(ctx, email) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = 'spendinguser';
    queryString.selector.email = email;
    let queryResults = await this.getQueryResultForQueryString(ctx.stub, JSON.stringify(queryString));
    return queryResults; //shim.success(queryResults);
  }
  //see all user spending base on spending id
  async seeAllUserSpendingBaseSpendingId(ctx, email, id_spending) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = 'spendinguser';
    queryString.selector.email = email;
    queryString.selector.id_spending = id_spending;
    let queryResults = await this.getQueryResultForQueryString(ctx.stub, JSON.stringify(queryString));
    return queryResults; //shim.success(queryResults);
  }
  //see all include spending and income
  async seeAllUserTransaction(ctx, email) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    let queryString = {};
    queryString.selector = {};
    queryString.selector.email = email;
    queryString.selector.type = 'add'
    let queryResults = await this.getQueryResultForQueryString(ctx.stub, JSON.stringify(queryString));
    return queryResults; //shim.success(queryResults);
  }
  //see infor target id
  async seeInforTarget(ctx, email, targetid) {
    const userAsBytes = await ctx.stub.getState(email);
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userAsBytes} does not exist`);
    }
    const targetAsbytes = await ctx.stub.getState(targetid);
    if (!targetAsbytes || targetAsbytes.length === 0) {
      throw new Error(`${targetAsbytes} does not exist`);
    }
    console.log(targetAsbytes.toString());
    return targetAsbytes.toString();
  }
  async getQueryResultForQueryString(stub, queryString) {

    console.info('- getQueryResultForQueryString queryString:\n' + queryString)
    let resultsIterator = await stub.getQueryResult(queryString);

    let results = await this.getAllResults(resultsIterator, false);

    //return Buffer.from(JSON.stringify(results));
    return results;
  }
  async getAllResults(iterator, isHistory) {
    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return allResults;
      }
    }
  }
}

module.exports = Cs01Contract