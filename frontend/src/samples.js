export const SAMPLE_SNIPPETS = [
  {
    id: "py_sql_injection",
    language: "python",
    label: "Python: SQL Injection Risk",
    code: `import sqlite3

def get_user(conn, username):
    # DANGEROUS: direct f-string in SQL query
    query = f"SELECT * FROM users WHERE username = '{username}'"
    cursor = conn.cursor()
    cursor.execute(query)
    return cursor.fetchone()
`
  },
  {
    id: "py_off_by_one",
    language: "python",
    label: "Python: Off-by-One Loop Bug",
    code: `def sum_list(nums):
    total = 0
    # Bug: range(len(nums)+1) causes IndexError
    for i in range(len(nums) + 1):
        total += nums[i]
    return total
`
  },
  {
    id: "py_resource_leak",
    language: "python",
    label: "Python: Unclosed File Handle",
    code: `def read_config_file(filepath):
    # Bug: Missing context manager (with statement) causes file descriptor leak
    f = open(filepath, "r")
    data = f.read()
    return data
`
  },
  {
    id: "js_xss_risk",
    language: "javascript",
    label: "JavaScript: DOM XSS Vulnerability",
    code: `function renderUserComment(commentText) {
  // CRITICAL: innerHTML with unescaped user input opens XSS exploit
  const container = document.getElementById("comments-feed");
  container.innerHTML += "<div class='comment'>" + commentText + "</div>";
}
`
  },
  {
    id: "js_inefficient_unique",
    language: "javascript",
    label: "JavaScript: O(N^2) Performance Bottleneck",
    code: `function findUniqueElements(arr) {
  // Inefficient quadratic scan instead of Set
  const unique = [];
  for (let i = 0; i < arr.length; i++) {
    if (unique.indexOf(arr[i]) === -1) {
      unique.push(arr[i]);
    }
  }
  return unique;
}
`
  },
  {
    id: "ts_memory_leak",
    language: "typescript",
    label: "TypeScript: Event Listener Memory Leak",
    code: `import { useEffect } from 'react';

export function WindowWatcher({ onResize }: { onResize: () => void }) {
  useEffect(() => {
    // Bug: Missing cleanup return function causes memory leak on unmount
    window.addEventListener('resize', onResize);
  }, [onResize]);

  return <div>Watching window resize events</div>;
}
`
  }
];
