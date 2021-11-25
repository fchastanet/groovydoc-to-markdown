#!/usr/bin/env groovy
package sc

import  java.util.regex.Pattern

/**
 * provides methods to apply to the git repository
 */
class Git implements Serializable {

  private static final long serialVersionUID = 1L

  private static GIT_TOOL = 'Default'
  private static SCM_CLASS = 'GitSCM'

  private final jenkinsExecutor

  Git(jenkinsExecutor) {
    this.jenkinsExecutor = jenkinsExecutor
  }

  /**
   * @return String url of the current dir or provided repository
   */
  String getRepoURL(String gitDir = '') {
    return this.jenkinsExecutor.dir(gitDir) {
      return this.jenkinsExecutor.sh(returnStdout: true, script: 'git config --get remote.origin.url').trim()
    }
  }

  /**
   * @param String gitDir source directory containing .git directory
   * @return String current commit sha
   */
  String getCommitSha(String gitDir = '') {
    return this.jenkinsExecutor.dir(gitDir) {
      return this.jenkinsExecutor.sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
    }
  }

  /**
   * @param String gitDir source directory containing .git directory
   * @return String current short commit sha
   */
  String getShortCommitSha(String gitDir = '') {
    return this.jenkinsExecutor.dir(gitDir) {
      return this.jenkinsExecutor.sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
    }
  }

  /**
   * @param String gitDir source directory containing .git directory
   * @return String the email of the last commit user
   */
  String getLastPusherEmail(String gitDir = '') {
    return this.jenkinsExecutor.dir(gitDir) {
      return this.jenkinsExecutor.sh(returnStdout: true, script: 'git log -n1 --pretty=format:"%ae"').trim()
    }
  }

  /**
   * do a shallow clone of given depth for given repository
   * @param String gitDir source directory containing .git directory
   * @param String credentialsId
   * @param String remoteUrl
   * @param String branch
   * @param short depth
  */
  void lightCheckout(String gitDir, String credentialsId, String remoteUrl, String branch = 'master', short depth = 1) {
    this.jenkinsExecutor.dir(gitDir) {
      this.jenkinsExecutor.checkout(
        changelog: false,
        poll: false,
        scm: [
            $class: Git.SCM_CLASS,
            branches: [[name: branch]],
            doGenerateSubmoduleConfigurations: false,
            extensions: [[$class: 'CloneOption', depth: depth, noTags: true, reference: '', shallow: true]],
            gitTool: Git.GIT_TOOL,
            submoduleCfg: [],
            userRemoteConfigs: [[credentialsId: credentialsId, url: remoteUrl]]
        ]
      )
    }
  }

  /**
   * do a clone for given repository and given branch
   * @param String gitDir source directory containing .git directory
   * @param String credentialsId
   * @param String remoteUrl
   * @param String branch
   * @param short depth
  */
  void branchCheckout(String gitDir, String credentialsId, String remoteUrl, String branch = 'master') {
    this.jenkinsExecutor.dir(gitDir) {
      this.jenkinsExecutor.checkout(
        changelog: false,
        poll: false,
        scm: [
            $class: Git.SCM_CLASS,
            branches: [[name: branch]],
            doGenerateSubmoduleConfigurations: false,
            gitTool: Git.GIT_TOOL,
            submoduleCfg: [],
            userRemoteConfigs: [[credentialsId: credentialsId, url: remoteUrl]]
        ]
      )
    }
  }

  /**
   * Step updating git commit status
   * @deprecated please use updateConditionalGithubCommitStatus instead
   */
  void updateGithubCommitStatus(String status, String gitDir = '') {
    // workaround https://issues.jenkins-ci.org/browse/JENKINS-38674
    String repoUrl = this.getRepoURL(gitDir)
    String commitSha = this.getCommitSha(gitDir)

    this.jenkinsExecutor.step([
      $class: 'GitHubCommitStatusSetter',
      reposSource: [$class: 'ManuallyEnteredRepositorySource', url: repoUrl],
      commitShaSource: [$class: 'ManuallyEnteredShaSource', sha: commitSha],
      errorHandlers: [[$class: 'ShallowAnyErrorHandler']],
      statusResultSource: [
        $class: 'ConditionalStatusResultSource',
        results: [
          [
            $class: 'AnyBuildResult',
            state: status
          ]
        ]
      ]
    ])
  }

  /**
   * Step updating git commit status depending on build result
   *
   * this method allows to only put this instruction at the end of the pipeline
   * post {
   *   always{
   *     ckGit.updateConditionalGithubCommitStatus()
   *   }
   * }
   * @param String gitDir
   */
  void updateConditionalGithubCommitStatus(String gitDir = '') {
    // workaround https://issues.jenkins-ci.org/browse/JENKINS-38674
    String repoUrl = this.getRepoURL(gitDir)
    String commitSha = this.getCommitSha(gitDir)

    this.jenkinsExecutor.step([
      $class: 'GitHubCommitStatusSetter',
      reposSource: [$class: 'ManuallyEnteredRepositorySource', url: repoUrl],
      commitShaSource: [$class: 'ManuallyEnteredShaSource', sha: commitSha],
      errorHandlers: [[$class: 'ShallowAnyErrorHandler']],
      statusResultSource: [
        $class: 'ConditionalStatusResultSource',
        results: [
          [
            $class: 'BetterThanOrEqualBuildResult',
            result: 'SUCCESS',
            state: 'SUCCESS',
            message: this.jenkinsExecutor.currentBuild.description
          ],
          [
            $class: 'BetterThanOrEqualBuildResult',
            result: 'FAILURE',
            state: 'FAILURE',
            message: this.jenkinsExecutor.currentBuild.description
          ],
          [
            $class: 'AnyBuildResult',
            state: 'FAILURE',
            message: 'Loophole'
          ]
        ]
      ]
    ])
  }

}
