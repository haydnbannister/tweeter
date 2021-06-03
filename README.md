## Multi-user Tweeting app with extremely original branding

Currently deployed at: https://d32oq1zhzd7v3b.cloudfront.net/

You can log in with username:password user1:userone -> user5:userfive"

You can also create a new account. Make sure to use a valid email address, as you will be sent a confirmation email.

### Architecture:
* Frontend: React

Everything else is configured via/managed by AWS Amplify:
* User signup and authentication: Amazon Cognito
* Backend: Managed GraphQL using AWS AppSync
* Database: DynamoDB

### Install and run

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
