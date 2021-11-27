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
   * @deprecated message
   *
   * @param gitDir after empty line
   * @example report all these kind of logs before being able to report them
   * **Note**: Lint.transformReport - Note that some logs need to be converted to ng format
   * @param String test simple list
   * Display list:
   * - item 1
   * - item 2
   * @param String test ordered list
   * Display list:
   * 1. item 1
   * 2. item 2
   * @param String test list multiple level
   * Display list:
   * - item 1
   *   - item 1.1
   * - item 2
   *   - item 2.1
   *   - item 2.2
   */
  String examples(String test, String gitDir = '') {
    return this.jenkinsExecutor.dir(gitDir) {
      return this.jenkinsExecutor.sh(returnStdout: true, script: 'git config --get remote.origin.url').trim()
    }
  }

}
