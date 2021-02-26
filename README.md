# Zendesk Service BE

BE for Zendesk Node.js Service for Automation 
## Resources 

| Name                   | Url                                                          |
| ---------------------- | ------------------------------------------------------------ |
| Github FE              | https://github.com/paulinaludwig/Zendesk-Service-FE          |
| Github BE              | https://github.com/paulinaludwig/Zendesk-Service-BE          |

Zendesk Support API: https://developer.zendesk.com/rest_api/docs/support/introduction 
Zendesk Help Center API: https://developer.zendesk.com/rest_api/docs/help_center/introduction

## Scripts

1. Run project in dev mode
 ```bash
   npm run dev
   ```

2. Install dependencies 
 ```bash
   npm install
   ```

## Getting Started

Contact paulina.ludwig@ui.com for complete list of env credentials 

Run scripts to install dependencies and start the project locally. Aquire necessary credentials to make requests to the correct Zendesk instance. 

# Making requests

View Zendesk API Documentation for more information on API methods and parameters. 
Authenticating via API token.  

Current setup makes manual and automatic requests to the Zendesk Support API and the Zendesk Help Center API, which require the same authentication. 

## Automation 

Automatic updates are configured in the server, and serve as private routes (not accessible via the frontend, however displaying the frequency and task name may be added in the future). 

Current automated tasks: 

Task: Fetch all tickets
Frequency: Every 5 mins

Due to the scaleability in mind with this application, all that would be required to add more routes is to simply add their configuration to the existing list. 

## Manual 

Manual updates are made via the frontend user interface. The agent/user is able to update single items such as a ticket, user or article by providing the appropriate parameters. 

