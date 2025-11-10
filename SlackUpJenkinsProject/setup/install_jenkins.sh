
---

## 🧩 **setup/install_jenkins.sh**
```bash
#!/bin/bash
# Script to install Jenkins LTS on Ubuntu/Debian

sudo apt update
sudo apt install -y openjdk-11-jdk wget gnupg
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | \
  sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install -y jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins
echo "Jenkins installed. Visit http://localhost:8080"
