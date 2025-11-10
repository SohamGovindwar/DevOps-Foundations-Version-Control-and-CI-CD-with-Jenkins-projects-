# SlackUp Jenkins Project

Integrates Jenkins with Slack to send CI/CD build notifications and allow remote build triggers via Slack slash commands.

### Components
- **Jenkinsfile** – CI/CD pipeline with Slack notifications
- **middleware/** – Node.js app to receive Slack slash commands and trigger Jenkins remotely
- **setup/** – Installation and configuration scripts for Jenkins and Slack plugin
- **docs/** – Write-up and output examples

### Quick Start
```bash
# 1. Install Jenkins on Linux
bash setup/install_jenkins.sh

# 2. Configure Slack plugin inside Jenkins using credentials in setup/env_example

# 3. Run middleware service
cd middleware
cp .env.example .env
npm install
node index.js



