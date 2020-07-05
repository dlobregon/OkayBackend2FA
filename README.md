# OkayBackend2FA


#### Install dependecies

~~~~

npm install

~~~~


#### Configuration file
After installing dependencies is necessary create a configuration file called "config.json". This file contains information about the Tenant (Including its token/secret). Also the file defines if the server accepts requests over HTTPS (mode: 1 for accepting requests without HTTP  and 2 for accepting connections over HTTPS ). Finally the file contains the location of all the "pem" files that we need to accept connections over HTTPS.
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