[ **Intro** ] -- [ [Application Features](Application_features.md) ]
-----
# RTL - Ride The Lightning

RTL is a web UI for Lightning Network Daemon.

Lightning Network Daemon is an implementation of Lightning Network BOLT protocol by Lightning Labs (https://lightning.engineering/).

Visit their Github repo (https://github.com/lightningnetwork/lnd/blob/master/README.md) for details on Lightning Network and LND implementation.

For setting up your Lightning Network node, you can follow the below guide:
https://github.com/Stadicus/guides/blob/master/raspibolt/README.md

## Prerequisites
Please ensure that you have completed the installation of lightning node.

It can be either on testnet or mainnet

Recommended Browsers: Chrome, Chromium (rpi), MS Edge.

## Installation

Fetch sources from the RTL git repository:

`git clone https://github.com/ShahanaFarooqui/RTL.git`

Move into the newly created directory:

`cd RTL`

Fetch the dependencies and build the application by running:

`npm install`

## Execution
Make sure you are in the RTL directory, where the application was built.

Locate the complete path of the readable macroon file (admin.macroon) on your node.

If you followed the guide above, it should be `/home/admin/.lnd`.

This path needs to be provided as a command line argument to start the server

## Start the Webserver
Run the following command:

`node rtl --lndir <macaroon-path>` 

For example:
`node rtl --lndir /home/admin/.lnd`

If the server started successfully, you should get the below output on the console:

`Server is up and running, please open the UI at http://localhost:3000`

## Accessing the Application

You can access the application in two ways:
### Same computer as the webserver
Open your browser at the following address: http://localhost:3000 to access the RTL application.

### Remotely from another computer on the same local network as the node
To access the application remotely from a computer, ensure that the firewall running on your node allows access on port 3000.
You would need the IP address of your application to access the application.

E.g. if the IP address of your node is 192.168.0.15 then open your browser at the following address: http://192.168.0.15:3000 to access RTL.