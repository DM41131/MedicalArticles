# Markdown & HTML Embedding Guide

This guide shows you how to create rich content with Markdown and HTML embedding in your articles.

## 📝 Basic Markdown Syntax

### Headers
```markdown
# H1 - Main Title
## H2 - Section Title
### H3 - Subsection
#### H4 - Sub-subsection
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
`Inline code`
```

### Lists

**Unordered Lists:**
```markdown
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3
```

**Ordered Lists:**
```markdown
1. First item
2. Second item
3. Third item
```

### Links and Images
```markdown
[Link text](https://example.com)
![Image alt text](https://example.com/image.jpg)
```

### Blockquotes
```markdown
> This is a blockquote
> It can span multiple lines
```

### Code Blocks
````markdown
```javascript
function hello() {
  console.log("Hello World!");
}
```
````

### Tables
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

---

## 🎬 HTML Embedding (Video & Media)

### YouTube Videos

**Method 1: Simple Embed**
```html
<iframe 
  src="https://www.youtube.com/embed/VIDEO_ID" 
  width="560" 
  height="315"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

**Method 2: Responsive 16:9 Embed**
```html
<div class="video-container">
  <iframe 
    src="https://www.youtube.com/embed/VIDEO_ID"
    frameborder="0"
    allowfullscreen>
  </iframe>
</div>
```

**How to get YouTube VIDEO_ID:**
- From URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- VIDEO_ID is: `dQw4w9WgXcQ`
- Embed URL: `https://www.youtube.com/embed/dQw4w9WgXcQ`

### Vimeo Videos
```html
<div class="video-container">
  <iframe 
    src="https://player.vimeo.com/video/VIDEO_ID"
    frameborder="0"
    allow="autoplay; fullscreen; picture-in-picture"
    allowfullscreen>
  </iframe>
</div>
```

### HTML5 Video (Self-hosted)
```html
<video controls width="100%">
  <source src="/uploads/video.mp4" type="video/mp4">
  <source src="/uploads/video.webm" type="video/webm">
  Your browser doesn't support video playback.
</video>
```

**With poster image:**
```html
<video controls width="100%" poster="/uploads/poster.jpg">
  <source src="/uploads/video.mp4" type="video/mp4">
</video>
```

### Audio Files
```html
<audio controls>
  <source src="/uploads/audio.mp3" type="audio/mpeg">
  <source src="/uploads/audio.ogg" type="audio/ogg">
  Your browser doesn't support audio playback.
</audio>
```

### Google Maps
```html
<iframe 
  src="https://www.google.com/maps/embed?pb=YOUR_MAP_EMBED_CODE"
  width="100%"
  height="450"
  style="border:0;"
  allowfullscreen=""
  loading="lazy">
</iframe>
```

### Twitter Embed
```html
<blockquote class="twitter-tweet">
  <p lang="en">Tweet text here...</p>
  <a href="https://twitter.com/user/status/TWEET_ID"></a>
</blockquote>
```

### CodePen Embed
```html
<iframe 
  height="400" 
  style="width: 100%;" 
  scrolling="no" 
  src="https://codepen.io/username/embed/PEN_ID?default-tab=html,result"
  frameborder="no"
  allowtransparency="true"
  allowfullscreen="true">
</iframe>
```

---

## 🎨 Styling HTML Elements

### Custom Styled Divs
```html
<div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px;">
  This is a custom styled box
</div>
```

### Centered Content
```html
<div style="text-align: center;">
  <img src="image.jpg" alt="Centered image">
  <p>Centered text below image</p>
</div>
```

### Side-by-Side Images
```html
<div style="display: flex; gap: 10px;">
  <img src="image1.jpg" style="width: 50%;">
  <img src="image2.jpg" style="width: 50%;">
</div>
```

---

## 💡 Best Practices

### For Videos
1. **Use responsive container** for better mobile experience
2. **Add titles** to iframes for accessibility
3. **Include fallback text** for unsupported browsers
4. **Use poster images** for HTML5 videos to improve loading
5. **Consider autoplay carefully** - most browsers block it without user interaction

### For Images
1. **Always add alt text** for accessibility
2. **Optimize image sizes** before uploading
3. **Use appropriate formats**: JPG for photos, PNG for graphics, WebP for modern browsers
4. **Consider lazy loading** for multiple images

### For Embeds
1. **Test responsiveness** - check on mobile devices
2. **Avoid too many embeds** on one page - impacts performance
3. **Use HTTPS** for all external resources
4. **Check embed permissions** - ensure you have rights to embed content

---

## 📋 Complete Example Article

```markdown
# My Amazing Article

This article demonstrates all features!

## Introduction

Here's some **bold** text and *italic* text. You can also use `inline code`.

## Video Tutorial

Watch this tutorial:

<div class="video-container">
  <iframe 
    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    title="Tutorial Video"
    frameborder="0"
    allowfullscreen>
  </iframe>
</div>

## Code Example

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

## Image Gallery

![Beautiful landscape](https://example.com/image1.jpg)

## Audio Sample

<audio controls>
  <source src="/uploads/sample.mp3" type="audio/mpeg">
</audio>

## Conclusion

That's all! Check out [more tutorials](https://example.com).
```

---

## 🔒 Security Notes

- HTML embedding is **sanitized** for security
- Only safe HTML elements and attributes are allowed
- Scripts and dangerous attributes are automatically removed
- If you need additional HTML elements, contact the administrator

---

## 🆘 Troubleshooting

**Video not showing?**
- Check the embed URL is correct
- Ensure the video is publicly accessible
- Try the responsive container method

**Iframe blocked?**
- Some sites block embedding (X-Frame-Options)
- Use official embed codes when available
- Check browser console for errors

**Styling not working?**
- Only inline styles are supported for security
- External CSS won't load
- Use MUI theme colors when possible

---

## 📚 Additional Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [YouTube Embed Parameters](https://developers.google.com/youtube/player_parameters)
- [HTML5 Video](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [Responsive Embeds](https://css-tricks.com/responsive-iframes/)

Happy writing! ✨

