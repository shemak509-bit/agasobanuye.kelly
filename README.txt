# KELLY FILMS — Website starter

## Run it on your computer
1. Download and unzip `kelly_films_website.zip`.
2. Open the `kelly_films` folder.
3. Double-click `index.html` to open the website in a browser.
4. Click **Admin ↗** or **＋ Add a film** to test adding a film.
5. Enter a title, choose a genre, add a poster image (under 1 MB recommended), and optionally add an official trailer / authorized video URL.
6. Save. The new film appears in the collection. Search and genre filters work too.

You can also open the folder in Visual Studio Code and use the **Live Server** extension for a local preview.

## Important: what this demo saves
This starter version uses browser `localStorage`. Films you add are saved only in that browser on that device. It is a working front-end demo, not a secure multi-user online content management system. It does not upload video files to a server; the video field is a URL.

## Put the demo online (static version)
A simple route is GitHub Pages:
1. Create/sign in to a GitHub account and create a repository named `kelly-films`.
2. Upload `index.html`, `style.css`, and `script.js` from this folder to the repository root.
3. Open repository **Settings → Pages**.
4. Choose deployment from the `main` branch and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site. Use the exact URL shown in Pages settings.
6. Add the published URL to Google Search Console and request indexing. Indexing is not instant or guaranteed. A custom domain is optional.

The static site can be searched and visited publicly, but any films added through the Admin button are still stored separately in each visitor's browser. They will NOT automatically appear for other visitors.

## To support real uploads from an admin dashboard
For a public site where you can log in and add a film once for every visitor to see, connect a backend such as Firebase or Supabase:
- Admin authentication (never rely on a hidden button or a password embedded in front-end JavaScript).
- A database for title, genre, year, description, poster URL, and video URL.
- Storage for poster images and, if licensed and technically appropriate, video files.
- Database and storage access rules so only authorized admins can add/edit/delete films.
- Use official trailers or videos you have permission to distribute. Do not upload copyrighted films without permission.

This starter intentionally does not pretend to have cloud uploads or a production admin login configured, because those require your own backend project and secure credentials.
