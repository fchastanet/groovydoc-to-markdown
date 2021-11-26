#!/usr/bin/env groovy
package sc

import  java.util.regex.Pattern

/**
 * class with examples
 */
class Example implements Serializable {

  /**
   * @return String url of the current dir or provided repository
   * @example test
   * ```json
   * [
   *   categoriesThreshold: [
   *     default: [ thresholdWarning: 0.7, thresholdHigh: 0.5 ],
   *     // owerride default values
   *     performance: [ thresholdWarning: 0.9, thresholdHigh: 0.7 ],
   *   ]
   * ]
   * ```
   * end of the test
   */
  String examples(String gitDir = '') {
    return this.jenkinsExecutor.dir(gitDir) {
      return this.jenkinsExecutor.sh(returnStdout: true, script: 'git config --get remote.origin.url').trim()
    }
  }

}
