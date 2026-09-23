# TAISELY — Final Frontend Project

Static, responsive TAISELY website foundation for GitHub/Vercel.

## Pages
- Home
- Blog
- Article
- Products
- Product detail
- Global Search
- Cart
- Account
- About
- Contact
- Newsletter

## Included interactions
- Responsive desktop/tablet/mobile navigation
- Article category/type filters and sorting
- Global search across articles and products
- Product filtering
- Cart stored in localStorage
- Save / like / share interactions for articles
- Newsletter subscription saved locally in demo
- Theme toggle on pages where enabled
- Related articles/products and data-driven Most Read section

## Logo
The project expects the logo at:

`assets/logo.png`

Replace that file with the current TAISELY logo. The site will also show a text fallback if the image is unavailable.

## Run locally
Open `index.html` directly in a browser, or serve the folder with any static server.

## Deploy
Upload the folder contents to GitHub and import the repository into Vercel. No build command is required.

## Production backend integration points
The UI is structured so these can be connected later without redesigning the front end:
- Authentication / profiles
- Article comments, likes and saved articles
- Product inventory
- Orders and shipping
- Payment gateway
- Reviews
- Newsletter provider / CRM
- Analytics-backed Most Read data
- CMS-backed articles and products
