# Email My Bitcoin

This project is an AWS CDK application that sets up an automated system to fetch the current Bitcoin price every n days/hours/minutes and send it via email using Amazon SES. The email address is securely stored and retrieved from Amazon Secrets Manager. The project deployment is automated using GitHub Actions.

## Features

- **EventBridge Rule**: Triggers a Lambda function every n days/hours/minutes.
- **Lambda Function**: Calls an external API (api.coincap.io) to get the current Bitcoin price.
- **Amazon SES**: Sends the Bitcoin price via email.
- **Secrets Manager**: Stores the recipient email address securely.
- **GitHub Actions**: Automates the deployment process.

## Prerequisites

- AWS CLI installed and configured
- Node.js installed
- AWS CDK installed
- GitHub account
- AWS account with permissions for EventBridge, Lambda, SES, and Secrets Manager

## Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/bitcoin-price-notification.git
    cd bitcoin-price-notification
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Set Up AWS CDK**
    ```bash
    cdk bootstrap
    ```

4. **Create Secrets in AWS Secrets Manager**
    ```bash
    aws secretsmanager create-secret --name "Email" --secret-string "{\"email\":\"your-email@example.com\"}"
    ```

5. **Deploy the Stack**
    ```bash
    cdk deploy
    ```

6. **Set Up GitHub Actions**
    - Create a new GitHub repository and push your code.
    - Add the following secrets to your GitHub repository:
        - `AWS_DEFAULT_REGION`
        - `AWS_DEPLOY_ACCOUNT`
        - `AWS_GITHUB_OIDC_ROLE`

The GitHub Actions workflow file under `.github/workflows/deploy.yaml` will handle automatic deployment to AWS on pushes to the main branch.