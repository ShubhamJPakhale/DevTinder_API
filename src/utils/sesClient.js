const { SESClient } = require("@aws-sdk/client-ses");

const REGION = "ap-south-1";

const sesClient = new SESClient({ region: REGION });

module.exports = { sesClient };