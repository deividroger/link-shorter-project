---
agent: ask
---

Perform a security audit of the codebase to detect any potential vulnerabilities in this project.

Ouput your findings as a mardown formatted table with the following columns (Id should be 1 and increment for each issue, Filepath should  be  an actual link to the file): "ID", "Issue", "Severity", "File Path", "Line Number(s)", and recommendations for fixing the issue.

Next, ask the user which issues they want to fix by either replying "all", or a comma separeted list of IDs. After their reply, run separate sub agent (#runSubagent) to fix each issue that the user specified. Each sub agent should report back with a simple `runSubagent: true | false`.