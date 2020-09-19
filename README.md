# GS LifeLine

Lifeline is a javascript application build to showcase someone's life journey through a scrollable list of cards.

The app features routing, tagging, search, dark-mode, keyboard-shortcuts, blogging (markdown).

Everything is build natively and doesn't use any external library except - _[Showdown](http://showdownjs.com)_ (used for converting markdown files to HTMl for bloggin purposes).

![Lifeline](/db/Lifeline.jpg)

---

## Deployment

Since this is JS app, it doesn't need to compile before working but it does need a server to render to files. That means, although the files are ready to be published from get-go but just opening index.html in a browser won't do the trick (locally).

If you're using any web-deployment service like GitHub-pages, Netlify, Render, etc., just upload the contents of the folder and the app should work online.

For local testing: you need a local server running. Some IDE like IntelliJ will do that out-of-the-box but else you need a little help. **[Serve](https://www.npmjs.com/package/serve)** is a package that can create a local server in any directory. So, after installing Serve, just open this folder in terminal and run `npm serve`. The webpack will be available at `http://localhost:5000` (by default).

## Developement

3 steps to develop your lifeline:

1. Fork this repository and open it.
2. Add content like images and documents to folder `db`. You can create subfolders for better management.
3. Edit the content of file `database.json` inside the folder `db`.

That's it. You lifeline is ready.

### database.json

File `database.json` is the file that binds the app together. It containes everything that this app would need to function.

It contains multiple parts:

- `title`: Name of website. Visible in browser title and sidebar.
- `description`: Not visible on webpage but used for meta-tags.
- `image`: Link to image which is shown for SEO.
- `tags`: List of navigational options.
- `social`: List of links which are visible in side bar.
- `articles`: List of all events in your LifeLine.

#### Tags

Tags sections contains an array of **tag** object.

```
  {
    "name": "about",
    "color": "#A550A7",
    "icon": "fas fa-info",
    "code": "Digit1"
  }
```

Each object contains 4 key-value pairs

- name : Name of your tag (all lowercase)
- color : Hashcode of color
- icon : Use fontawesome class naming. [Read more](https://fontawesome.com/v4.7.0/examples/#basic)
- code : Keyboard shortcut key through which the tag is accessed. [Code list](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values)

If you name the tag "other", it will be not be visible in the app.

#### Social

Similar to tags, Social section takes a list/array of **social** objects

```
  {
    "name": "LinkedIn",
    "icon": "fab fa-linkedin",
    "link": "https://www.linkedin.com/in/#/",
    "color": "#0077B5"
  }
```

Each object contains 4 key-value pairs

- name : Name of social object.
- icon : Use fontawesome class naming. [Read more](https://fontawesome.com/v4.7.0/examples/#basic)
- link : URL link.
- color : Hashcode of icon color

#### Articles

The most important part of this JSON file as this what your visitors are there to see.

The **articles** object inturn contains multiple array of _article_ objects corresponding to the tags created before.
Eg. if there are 4 tags are about, projects, work and love, then the **articles** object would look like:

```
articles: {
  about: [],
  projects: [],
  work: [],
  life: []
}
```

As you may notice, each sub-section of **articles** contains an array. These are array of `article` object. Read below to understand how an article is made.

##### Article

Each article contains following properties (keys):

- Primary keys [title, tags, timestamp] are important to create the article card and hence and mandatory. The tags is a list of string and first string in the list determines the category/nav for the article.
- Secondary keys [subtitle, logo, date, summary, role, tech, attachments, actions] are additional information that can be provided as per requirement.
- Viewer keys [url, file, filetype] are only required if there is a FullView Article (blog, detailPage, etc.) or Viewer attached or linked.

**IMPORTANT**: The order of articles is determined by timestamp. The cards are placed in decending order. The current format is YYYYMMDD in numerical form. So card with timestamp: 20200101 will appear above card with timestamp: 20191231.

A sample article:

```
{
  "title": "Sample Project",
  "timestamp": 20190430,
  "tags": [
    "projects",
    "sample",
    "favourite"
  ],
  "subtitle": "@ Company",
  "logo": "db/sampleProject/logo.png",
  "date": "April 2019",
  "summary": "Business Espoo supports the vitality of businesses by offering the best, continuously developing services in one place.",
  "role": "Sole designer",
  "tech": [
    "Sketch",
    "InDesign"
  ],
  "attachments": [
    {
      "name": "BE Logo",
      "image": "db/sampleProject/image1.jpg"
    }
  ],
  "actions": [
    {
      "name": "Business Espoo",
      "link": "#"
    }
  ]
}
```

An article with Viewer is special as it links to itself.
Sample article with Viewer attached:

```
{
  "title": "Blog title",
  "timestamp": 20170508,
  "tags": [
    "blog",
    "favourite"
  ],
  "subtitle": "Blog subtitle",
  "date": "8 May 2017",
  "summary": "Blog short description.",
  "tech": [
    "Sketch"
  ],
  "attachments": [
    {
      "name": "Passport Concept",
      "image": "db/sampleBlog/image.jpg"
    }
  ],
  "actions": [
    {
      "name": "Read Post",
      "link": "#blog/sample",
      "target": "_self"
    }
  ],
  "url": "#blog/sample",
  "file": "db/sampleBlog/sample.md",
  "filetype": "md"
}
```

- Notice that `url` key and `link` key in actions should match.
- File provided will be used to render the Viewer/DetailsView.
- `fileType` can either be `md` or `html`. `html` means the file will be placed as an iframe. `md` file will be converted to HTML using ShowdownJS library.
