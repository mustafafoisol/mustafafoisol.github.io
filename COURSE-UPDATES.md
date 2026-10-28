# Updating Fall 2026 courses

The Teaching page links to four course URLs. Each course page shows its title,
one channel link, and a schedule table with Date, Lecture material, and Actions.
Edit each course independently in `courses.js`. Existing `schedule.html` links
still display the same course content.

## Channel links

Find the course in `courses.js` and set its single `channel`:

```js
channel: { platform: "Discord", url: "https://discord.gg/YOUR-INVITE" }
```

Use either `"Slack"` or `"Discord"` as the platform and the full channel or
invitation URL. Leave the URL empty until ready; it shows one non-clickable
placeholder below the course title. The two platforms are never shown together.

## Dates and materials

Replace a course's `schedule: []` with session entries in display order:

```js
schedule: [
  {
    date: "", // Fill in the actual date as YYYY-MM-DD; blank shows To be announced.
    lectureMaterials: [
      { title: "Introduction — lecture slides", url: "" },
      { title: "Practice sheet", url: "" }
    ],
    actions: [
      "Read the assigned chapter before the next class.",
      { text: "Lab report due: add the actual date and time here", url: "" }
    ]
  }
]
```

Add as many sessions and material links as needed. An empty materials array or
empty URL displays “Coming soon.” Add slides, lab instructions, practice sheets,
or starter code to `lectureMaterials`. Put deadline reminders and preparation
instructions in `actions`, as plain text or an object with `text` and an optional
`url` for a submission page. Include the due date, time, and timezone in reminder
text when relevant. Empty actions show “No reminders yet.” The examples above
are illustrative; no dates or deadlines have been published yet.

Upload files into a folder in this repository, for example
`materials/fall-2026/software-engineering/`, then set the corresponding URL to
`materials/fall-2026/software-engineering/lecture-01.pdf`. Paths are relative
to the site root; use forward slashes and match filename capitalization.
Full HTTPS links to hosted documents or repositories also work.

Commit and publish the updated data and uploaded files through the site's
usual deployment process. There is no upload form or separate backend.

Preview by serving this folder with a static web server, then open
`teaching.html` and select a course to see its schedule directly.
