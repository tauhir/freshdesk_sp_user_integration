const CryptoJS = require('crypto-js');

exports = {
  onTicketCreateHandler: function(args) {
    console.log('Hello ' + args['data']['requester']['name']);
  },
   fetchCustomerInfo: async function(args) {
    const { email } = args.context;
    const apiKey = args.iparams.apiKey;
    const requestBody = JSON.stringify({ customer: { email: email } });
    const signature = generateHmacSha1(requestBody, apiKey);
    try {
      const response = await $request.invokeTemplate("GetFreshdeskInfo", {
        context: {
          signature: signature
        },
        body: requestBody
      });

      console.log(`Response status: ${response.status}`);
      renderData(null, { response: response.response });
    } catch (error) {
      console.error(`Error during request: ${error.message}`);
      const errObj = { status: error.status || 500, message: error.message };
      renderData(errObj);
    }
  }
};

function generateHmacSha1(data, secretKey) {
  const hmacDigest = CryptoJS.HmacSHA1(data, secretKey).toString(CryptoJS.enc.Base64);
  return hmacDigest;
}


// curl  -X POST \
//   'https://payroll.simplepay.cloud/freshdesk_info' \
//   --header 'Accept: */*' \
//   --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
//   --header 'X-Freshdesk-Signature: boo' \
//   --header 'Content-Type: application/json' \
//   --data-raw '{"customer":{"email":"hello@b.co.za"}}'