pipeline {
    agent any
    parameters {
        string(name: 'GIT_COMMIT', defaultValue: '', description: 'Commit SHA or branch to build')
    }
    environment {
        TOMCAT_USER = 'admin'
        TOMCAT_PASS = 'Root123$'
        TOMCAT_HOST = '13.203.41.244'
        APP_CONTEXT = '/insured-assurance'
        MAVEN_OPTS = '-B -DskipTests=false'
    }
    options {
        timestamps()                      // Keep timestamps
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    stages {
        stage('Checkout') {
            steps {
                echo "Checking out repository..."
                checkout scm
                script {
                    if (params.GIT_COMMIT?.trim()) {
                        sh 'git fetch --all --tags || true'
                        sh "git checkout ${params.GIT_COMMIT}"
                    }
                }
            }
        }
        stage('Build') {
            steps {
                echo "Building project using Maven..."
                sh "mvn ${env.MAVEN_OPTS} clean package"
            }
        }
        stage('Deploy') {
            steps {
                script {
                    WAR = sh(script: "ls target/*.war | head -n1", returnStdout: true).trim()
                    if (!WAR) {
                        error("WAR file not found!")
                    }
                    echo "Deploying WAR: ${WAR}"
                    sh """
                        curl --fail -u ${env.TOMCAT_USER}:${env.TOMCAT_PASS} \\
                        "http://${env.TOMCAT_HOST}:8080/manager/text/deploy?path=${env.APP_CONTEXT}&update=true" \\
                        --upload-file "${WAR}"
                    """
                }
            }
        }
        stage('Post-Deploy Verification') {
            steps {
                script {
                    echo "Verifying deployment..."
                    retry(3) {
                        response = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://${env.TOMCAT_HOST}:${env.APP_CONTEXT}/hello", returnStdout: true).trim()
                        if (response != '200') {
                            error("App not responding! HTTP ${response}")
                        } else {
                            echo "App deployed successfully! HTTP 200 OK"
                        }
                    }
                }
            }
        }
    }
    post {
        success { echo 'Pipeline succeeded ✅' }
        failure { echo 'Pipeline failed ❌ Check console output.' }
        always { echo 'Pipeline finished.' }
    }
}
