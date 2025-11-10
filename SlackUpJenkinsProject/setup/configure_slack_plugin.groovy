import jenkins.model.*
import jenkins.plugins.slack.*

def instance = Jenkins.getInstance()
def slack = instance.getDescriptorByType(SlackNotifier.DescriptorImpl)

slack.teamDomain = "jenkins_build"
slack.tokenCredentialId = "slack-token"
slack.room = "#jenkins-builds"
instance.save()

println("✅ Slack plugin configured successfully for workspace: jenkins_build")
