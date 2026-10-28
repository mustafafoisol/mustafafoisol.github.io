# Updating Fall 2026 courses

The Teaching page links to four course URLs. `course.html` and `schedule.html`
share templates, while each course has independent content in `courses.js`.

## Channel links

Find the course in `courses.js` and replace its empty `slackUrl` and/or
`discordUrl` with the full invitation or channel URL. Empty values show
“Link coming soon” without creating a broken link.

## Dates and materials

Replace a course's `schedule: []` with session entries in display order:

```js
schedule: [
  {
    date: "", // Fill in the actual date as YYYY-MM-DD; blank shows To be announced.
    topic: "Introduction",
    lectureMaterials: [
      { title: "Lecture slides", url: "" }
    ],
    practiceMaterials: [
      { title: "Practice sheet", url: "" },
      { title: "Starter code", url: "" }
    ]
  }
]
```

Add as many sessions and material links as needed. An empty materials array or
empty URL displays “Coming soon.” Dates and topics are intentionally unfilled
until the teaching schedule is confirmed.

Upload files into a folder in this repository, for example
`materials/fall-2026/software-engineering/`, then set the corresponding URL to
`materials/fall-2026/software-engineering/lecture-01.pdf`. Paths are relative
to the site root; use forward slashes and match filename capitalization.
Full HTTPS links to hosted documents or repositories also work.

Commit and publish the updated data and uploaded files through the site's
usual deployment process. There is no upload form or separate backend.

Preview by serving this folder with a static web server, then open
`teaching.html` and follow each course's Schedule & materials link.
