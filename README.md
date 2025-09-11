# Insured Assurance - CI/CD  (GitHub Actions -> Jenkins -> Tomcat)

This package contains a minimal Java **WAR** web application and CI/CD configuration that demonstrates:
1. A tiny Java Servlet webapp (Maven -> WAR).
2. A `Jenkinsfile` (Pipeline) that builds and deploys the WAR to Tomcat using the Tomcat manager API.
3. A GitHub Actions workflow (`.github/workflows/maven.yml`) that builds the project and triggers the Jenkins pipeline.
4. A `docker-compose.yml` that can run Jenkins and Tomcat for local testing (recommended for beginners).
5. A sample `tomcat-users.xml` with a deployer user used by Jenkins to deploy to Tomcat.

---
## Quick start (recommended path using Docker Compose)

1. Install Docker and Docker Compose on your machine.
   - Ubuntu: https://docs.docker.com/engine/install/ubuntu/
   - Windows / Mac: install Docker Desktop.
   - Verify `docker` and `docker-compose` are available.

2. Unzip this project and from the project root run:
   ```bash
   docker-compose up -d
   ```
   This will start Jenkins (host port 8080) and Tomcat (host port 8081).

3. Get initial Jenkins admin password:
   ```bash
   docker-compose exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
   Open `http://localhost:8080` and finish the Jenkins setup (install suggested plugins).

4. In Jenkins, create credentials:
   - **Kind:** Username with password  
     **Username:** `deployer`  
     **Password:** `DeployerPass123!`  
     **ID:** `tomcat-creds-id`

5. In Jenkins create a Pipeline job named `insured-assurance-cd` and set the Pipeline to fetch the `Jenkinsfile` from this repository (use the Git repo URL).

6. Create a GitHub repo and push all files from this project root.

7. (Optional) To allow GitHub Actions (cloud) to reach your local Jenkins, use a tunneling tool (e.g. ngrok).
   Start ngrok for port 8080 and copy the public URL into GitHub Secrets (`JENKINS_URL`).
   Note: free ngrok URLs are ephemeral and will change on restart.

8. In the GitHub repository settings → Secrets → Actions, create:
   - `JENKINS_URL` (example: https://abcd-1234.ngrok.io)
   - `JENKINS_USER` (Jenkins username that has permission to trigger the pipeline)
   - `JENKINS_API_TOKEN` (API token from that Jenkins user)
   - `JENKINS_JOB` (the Jenkins job name you created, e.g. `insured-assurance-cd`)

9. Push to `main`. The GitHub Actions workflow will build the project and trigger the Jenkins job which will deploy to Tomcat.

---
## Files included
- `pom.xml` — Maven configuration (WAR package).
- `src/main/java/com/insured/assurance/HelloServlet.java` — Simple servlet.
- `src/main/webapp/index.jsp` — Basic index page.
- `src/main/webapp/WEB-INF/web.xml` — minimal web.xml.
- `Jenkinsfile` — Jenkins Pipeline that builds and deploys via Tomcat manager.
- `.github/workflows/maven.yml` — GitHub Actions workflow that builds then triggers Jenkins.
- `docker-compose.yml` — Compose file launching Jenkins and Tomcat (for local testing).
- `tomcat-users.xml` — tomcat manager user file used by the Tomcat container.
- `build_and_deploy_local.sh` — helper script to build and deploy to a local Tomcat manager (via curl).

---
## Important notes / security
- Change all example passwords before using on a public network.
- Prefer using HTTPS and restricted network access for Jenkins and Tomcat in production.
- When using ngrok, your Jenkins will be exposed publicly — protect it with strong credentials and consider paid ngrok for a stable URL.

If you want, I can now walk you through *running* these steps on your machine (Docker install, starting the stack, configuring Jenkins) — or provide a ZIP with these files so you can download and run them immediately.
