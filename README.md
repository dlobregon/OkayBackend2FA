# OkayBackend2FA

#### Requirements
Before to start make sure that you already installed the following tools:
~~~~
npm
node
curl or postman to test the endpoints
~~~~


#### Install dependecies.
To install the dependencies run the following command:
~~~~
npm install
~~~~

## 1. Setup the Okay account
#### 1.1 Create an Account in the Okay Website
To use of the Okay API we are required to create an account in the Okay's [website](https://okaythis.com/signup).

#### 1.2 Register your server as a Tenant.
Once you are logged in [Okay](https://demostand.okaythis.com/pss-admin/dashboard), go to "Tenants"  in the top toolbar, then click on "Tenants" from the drop down menu.

##### 1.2.1 What is a Tenant?
In our case, a Tenant is a registry of an endpoint that connects in a secure way to the Okay server in order to link users and manage their Authentication/Authorization procedures.

Each Tenant registry has:
~~~~
id - This is assigned by Okay 
name - a name to indetify the Tenant
callback URL - An accessible endpoint
status - A Tenant status
trialExpires - The date when your trial expires
~~~~

*Note:* the Callback URL is an endpoint where Okay will send callbacks to notify the 

#### Configuration file.

After installing dependencies is necessary create a configuration file called "config.json" . This file contains information about the Tenant (Including its token/secret). Also the file defines if the server accepts requests over HTTPS (mode: 1 for accepting requests without HTTP  and 2 for accepting connections over HTTPS ). Finally the file contains the location of all the "pem" files that we need to accept connections over HTTPS.

~~~~JSON
{
"tenant":"tenantNumber",
"token":"secret",
"mode":"1",
"keyPem":"cert/key.pem",
"certPem":"cert/cert.pem",
"caPem":"/cert/chain.pem"
}
~~~~






