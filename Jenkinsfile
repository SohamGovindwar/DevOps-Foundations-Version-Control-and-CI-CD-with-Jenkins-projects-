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
        timestamps()                   // Add timestamps in console logs
        ansiColor('xterm')             // Colorful logs
        timeout(time: 30, unit: 'MINUTES') // Pipeline timeout
        buildDiscarder(logRotator(numToKeepStr: '10')) // Keep last 10 builds
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out repository..."
                checkout scm
                script {
                    if (params.GIT_COMMIT?.trim()) {
                        echo "Checking out specified commit/branch: ${params.GIT_COMMIT}"
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
                    // Detect WAR file
                    WAR = sh(script: "ls target/*.war | head -n1", returnStdout: true).trim()
                    if (!WAR) {
                        error("WAR file not found in target directory!")
                    }
                    echo "Deploying WAR: ${WAR} to Tomcat"

                    // Deploy WAR to Tomcat Manager
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
                    echo "Verifying deployed application..."
                    retry(3) { // Retry 3 times if server is slow to respond
                        response = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://${env.TOMCAT_HOST}:8080${env.APP_CONTEXT}/hello", returnStdout: true).trim()
                        if (response != '200') {
                            error("Deployment verification failed! HTTP status: ${response}")
                        } else {
                            echo "Deployment verified successfully! HTTP 200 OK"
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded ✅'
        }
        failure {
            echo 'Pipeline failed ❌ Check the logs for details.'
        }
        always {
            echo 'Pipeline finished.'
        }
    }
}
