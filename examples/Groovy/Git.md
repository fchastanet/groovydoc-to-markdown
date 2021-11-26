# Documentation

## `class Git implements Serializable`

provides methods to apply to the git repository

### `String getRepoURL(String gitDir = '')`

 * **Returns:** String url of the current dir or provided repository

### `String getCommitSha(String gitDir = '')`

 * **Parameters:** `String` — gitDir source directory containing .git directory
 * **Returns:** String current commit sha

### `String getShortCommitSha(String gitDir = '')`

 * **Parameters:** `String` — gitDir source directory containing .git directory
 * **Returns:** String current short commit sha

### `String getLastPusherEmail(String gitDir = '')`

 * **Parameters:** `String` — gitDir source directory containing .git directory
 * **Returns:** String the email of the last commit user

### `void lightCheckout(String gitDir, String credentialsId, String remoteUrl, String branch = 'master', short depth = 1)`

do a shallow clone of given depth for given repository

 * **Parameters:**
   * `String` — gitDir source directory containing .git directory
   * `String` — credentialsId
   * `String` — remoteUrl
   * `String` — branch
   * `short` — depth

### `void branchCheckout(String gitDir, String credentialsId, String remoteUrl, String branch = 'master')`

do a clone for given repository and given branch

 * **Parameters:**
   * `String` — gitDir source directory containing .git directory
   * `String` — credentialsId
   * `String` — remoteUrl
   * `String` — branch
   * `short` — depth

### `void updateGithubCommitStatus(String status, String gitDir = '')`

Step updating git commit status

 * **Deprecated:** please use updateConditionalGithubCommitStatus instead

### `void updateConditionalGithubCommitStatus(String gitDir = '')`

Step updating git commit status depending on build result

this method allows to only put this instruction at the end of the pipeline post { always{ ckGit.updateConditionalGithubCommitStatus() } }

 * **Parameters:** `String` — gitDir
