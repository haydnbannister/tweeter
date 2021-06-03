## Multi-user Tweeting app with extremely original branding
### Architecture:
* Frontend: React

Everything else is configured via/managed by AWS Amplify:
* User signup and authentication: Amazon Cognito
* Backend: Managed GraphQL using AWS AppSync
* Database: DynamoDB

###Install and run

Get amplify CLI:

`npm install -g @aws-amplify/cli`

Install dependancies:

`npm install `

Set up project:

`amplify configure`

`amplify push`

Run locally (default: http://localhost:3000/): 

`amplify serve`

Deploy:

`amplify add hosting`

`amplify publish`