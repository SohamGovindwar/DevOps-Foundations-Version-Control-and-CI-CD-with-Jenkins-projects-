#!/usr/bin/env bash
set -e
echo "Building WAR..."
mvn -B -DskipTests=false clean package
WAR=$(ls target/*.war | head -n1)
if [ -z "$WAR" ]; then
  echo "WAR not found"
  exit 1
fi
echo "Deploying $WAR to local Tomcat manager at http://localhost:8081/manager/text"
read -p "Tomcat manager user: " TOMCAT_USER
read -s -p "Tomcat manager password: " TOMCAT_PASS
echo
curl --fail -u "$TOMCAT_USER:$TOMCAT_PASS" "http://localhost:8081/manager/text/deploy?path=/insured-assurance&update=true" --upload-file "$WAR"
echo
echo "Done."
