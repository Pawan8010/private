import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const activityPath = path.join(__dirname, "activity.txt");
const git = simpleGit();

const words = ["update", "fix", "add", "improve", "refactor", "feat", "docs", "style", "test", "chore", "build", "ci", "perf"];
const topics = ["activity log", "daily progress", "note", "task complete", "idea", "random entry", "contribution filler", "script run", "green graph"];

const makeCommits = (n) => {
  if (n === 0) {
    console.log("\\n✅ All 2000 commits completed! Check your GitHub graph.");
    return;
  }

  // Random backdated date (last year grid)
  const x = random.int(0, 52);
  const y = random.int(0, 6);
  const commitDate = moment()
    .subtract(1, "year")
    .add(1, "day")
    .add(x, "week")
    .add(y, "day")
    .format("YYYY-MM-DD HH:mm:ss Z");

  // Random line
  const word = words[random.int(0, words.length - 1)];
  const topic = topics[random.int(0, topics.length - 1)];
  const num = random.int(1, 9999);
  const line = `Entry #${num}: ${word} - ${topic} (${moment().format("YYYY-MM-DD HH:mm")})`;

  // Append
  fs.appendFileSync(activityPath, line + "\\n", "utf8");

  // Random msg
  const msg = `${word.charAt(0).toUpperCase() + word.slice(1)} ${topic} #${num}`;

  console.log(`[${2001 - n}/${2000}] ${commitDate} | ${msg}`);

  // Commit & push
  git.add(activityPath)
     .commit(msg, {"--date": commitDate})
     .push("origin", "main", {"--force": true})
.then(() => setTimeout(() => makeCommits(n - 1), 10000))
     .catch((err) => {
       console.error("GitHub rate limit or error:", err.message);
       console.log("Pause and rerun for remaining commits.");
       process.exit(1);
     });
};

// Run
console.log("🚀 Starting 2000 commits to fill GitHub graph...");
makeCommits(300);
