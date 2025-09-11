pipeline {
  agent any
  parameters {
    string(name: 'GIT_COMMIT', defaultValue: '', description: 'Commit SHA or branch to build')
  }
  stages {
    stage('Checkout') {
      steps {
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
        sh 'mvn -B -DskipTests=false clean package'
      }
    }
    stage('Deploy') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'tomcat-creds-id', usernameVariable: 'TOMCAT_USER', passwordVariable: 'TOMCAT_PASS')]) {
          sh '''
            WAR=$(ls target/*.war | head -n1)
            if [ -z "$WAR" ]; then echo "WAR not found"; exit 1; fi
            # Deploy to the Tomcat manager (container name or host reachable from Jenkins)
            curl --fail -u "$TOMCAT_USER:$TOMCAT_PASS" "http://tomcat:8080/manager/text/deploy?path=/insured-assurance&update=true" --upload-file "$WAR"
          '''
        }
      }
    }
  }
  post {
    success { echo 'Pipeline succeeded.' }
    failure { echo 'Pipeline failed.' }
  }
}
