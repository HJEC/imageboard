<p align="center"><img  width="100"src="/public/stuff/dog_logo.png"/></p>

<h1 align="center"> Imageboard</h1>
<br>

<h4>you can visit the live version of this project, hosted with Heroku at the link next to the repo description, or <a style="text-decoration: underline"https://hotdogs-imageboard.herokuapp.com/>here</a>.🐶🦴</h4>
<p align="center"><img src="/public/stuff/gifs/overview.gif"/></p>

> “If there are no dogs in Heaven, then when I die I want to go where they went.” ― Will Rogers

#### Author: [Henry Crookes](http:/github.com/hjec) :cowboy_hat_face:

##### contents:

1. [Description](#Description)
2. [Insights](#Insights)
3. [Technologies](#Technologies)
4. [Design Packages](#Design)
5. [Features](#Features)
   <br>[- File upload](#1)
   <br>[- Image deletion](#2)
   <br>[- Comments](#3)
   <br>[- Filters](#4)
   <br>[- Dark mode](#5)
   <br>[- Designing for mobile](#6)
   <br>[- Touchevents & swiping](#7)

### Description:

This imageboard is a simple page to upload your favourite photos of dogs (preferably wearing hats)! You can upload, delete and view anyone's images that has been added to the site.

---

### Insights:

This project was my first experience using a popular Javascript framework. I learned a tonne of valuable lessons from Vue, and really enjoyed having the access to the freedom and potential it offered. Vue is a fantastic lightweight framework and I appreciate most of all how easy it is to integrate into any project.

### Technologies

-   HTML
-   CSS
-   mySQL
-   Axios
-   Vue.js
-   Express
-   Multer
-   Amazon Web Services (S3)
-   Media Queries
-   Heroku

### Design Packages <a name="Design"></a>

-   Audacity digital audio editor

# Features:

#### 1. File upload: <a name="1"></a>

<br>

<p align="center"><img src="/public/stuff/gifs/upload.gif" width="80%"/></p>

Utilising Amazon Web services for file hosting, users can upload images with a maximum file size of 2.5mb's to the s3 bucket linked to this project, and then the site views are automatically updated to display the new image. All images are ordered from newest to oldest.

#### 2. Image deletion <a name="2"></a>

<br>
<p align="center"><img src="/public/stuff/gifs/deleted.gif" width="80%"/></p>

Users can delete an image from the database, along with it's comments. The modal window will then display the next most recent image, or oldest if there are no newer images.

#### 3. Comments <a name="3"></a>

<br>

<p align="center"><img src="/public/stuff/gifs/comment.gif" width="80%"/></p>

After selecting an image, a modal window will appear where users can leave a comment. If a user does not specify a username, the entry will be uploaded under "Anon".

#### 4. Filters <a name="4"></a>

<br>

<p align="center"><img src="/public/stuff/gifs/filters.gif" style="border-radius: 2px; box-shadow: 0px 0px 15px 11px rgba(0,0,0,0.12);" width="80%"/></p>

A fun option for users to change color filters based on the most popular Instagram&trade; filters. Utilising the power of Vue's data flow and the Vue object methods, I targeted the image elements and affected their class based on the selected option. Selecting the "DISCO-MODE" option also enables a short mp3 clip of my personal remixed version of Room 5's "Make Luv" I created using the free audio editing software "Audacity". Truly a party anthem ;)

#### 5. Dark mode <a name="5"></a>

<br>

<p align="center"><img src="/public/stuff/gifs/darkmode.gif" style="border-radius: 2px; box-shadow: 0px 0px 15px 11px rgba(0,0,0,0.12);" width="80%"/></p>

With the power of CSS variables, I designed two complimentary styles for the website. Toggling the switch triggers an event listener set during the Vue component mount, which then targets the document element setting the appropriate "theme". Users can choose between a light and a dark mode, which both contain different header text.

---

Triggering the dark mode switch also sets a value into local storage, allowing the site to remember the theme that the user chose while they were visiting the site. This was achieved quite simply inside the same method:

```
const currentTheme = localStorage.getItem("theme")
    ? localStorage.getItem("theme")
    : null;
if (currentTheme) {
    document.documentElement.setAttribute(
        "data-theme",
        currentTheme
    );
}
```

#### 6. Designing for mobile <a name="6"></a>

<br>

<p align="center"><img src="/public/stuff/gifs/mediaqueries.gif" width="80%"/></p>

One of the challenges I set for myself was designing for various breakpoints and especially mobile. Writing stylesheets with multiple media-queries can quickly build in complexity and get quite messy, but it was a fun exercise in organisation and really building a deeper understanding of css grids and flex layouts. Everything on this site was built with vanilla css. No libraries or pre-processors were involved.

#### 7. Touchevents & swiping <a name="7"></a>

<br>

<p align="center"><img src="/public/stuff/gifs/swipe.gif" height="35%"/></p>

Another simple but important feature I was excited to implement was mobile touch events and detecting screen-swiping. Playing with coordinates and event handling was definitely challenging at first, but I am quite happy with the outcome for my first attempt.

---

I really wanted the experience to feel intuitive. For this to work I had to keep in mind that if a user was dragging the cursor/finger in one direction, they should expect to see the next screen coming from the other direction. In other words, sliding to the right dictates that an image should appear from the left. I also had to prevent the user from being able to infinitely drag the modal window if there are no newer/older images.
