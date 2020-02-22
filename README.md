# ![GS](https://guptasiddhant.com/favicon/favicon-32x32.png) GS LifeLine

---

To modify the data in the web-app, pay attention to 2 sub-directories `db` and `articles`.

Directory `db` contains 2 files >

- `info.js` : Contains basic information like **app-title**, navigational tags (name, color, icon) and some social links
- `lineline.js` : Contains a list of all articles to be displayed in the app. The order in array is maintained in the app. Each article contains following properties (keys): - Primary keys [title, tags] are important to create the article card and hence and mandatory. The tags is a list of string and first string in the list determines the category/nav for the article. - Secondary keys [subtitle, icon, date, summary, role, tech, attachments, actions] are additional information that can be provided as per requirement. - Viewer keys [url, file, filetype] are only required if there is a FullView Article or Viewer attached or linked.

```
[  //Array of articles
  {  //Object representing single article
    title: "Title",  //String - Required
    subtitle: "SubTitle",  //String
    date: "15 Aug. 2019",  //String
    tags: ["blog", "about"],  //Array of Strings  - Required at least 1
    summary: "Description",  //String
    role: "Your Role",  //String
    tech: ["Sketch", "MS-Word], //Array of Strings
    attachments: [. //Array of image objects
      {  //Image Object
        name: "Image name",  //String
        image: "Image URL"  //String
      },
    ],
    actions: [  //Array of Link Objects
      {  //Link Object
        name: "Read More",  //String
        link: "#blog/art01",  //String - URL
        target: "_self"  //String
      }
    ],
    url: "art01",  //String - Viewer's URL
    file: "articles/01.md",  //String - MD File location
    filetype: "md"  //String - File extenstion
  },
]
```

In `articles` directory add Markdown files as mentioned in `file` (MD file location).
