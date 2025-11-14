

# **Anonymous Feedback**

A simple and privacy-focused feedback system built with Next.js, TypeScript, MongoDB, and Tailwind CSS.
Users can submit feedback anonymously, and admins can view/manage submissions through a protected dashboard.

---

## **Features**

* Anonymous feedback submission
* Custom signup + NextAuth authentication
* MongoDB database integration
* Clean and minimal UI (Tailwind CSS)
* Email delivery powered by Resend
* OpenAI integration (if you plan to use it later)

---

## **Tech Stack**

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Database:** MongoDB
* **Auth:** NextAuth + custom signup
* **Styling:** Tailwind CSS
* **Email:** Resend
* **Other:** OpenAI API

---

## **Getting Started**

### **Prerequisites**

Make sure you have the following installed:

* Node.js 18+
* MongoDB connection string
* npm / pnpm / yarn

---

## **Installation**

```bash
git clone https://github.com/Vaskar-Bhattacharjee/Annonymous-feedback.git
cd Annonymous-feedback
npm install
```

---

## **Environment Variables**

Create a file named `.env.local` in the project root and add:

```
MONGODB_URI=""
RESEND_API_KEY=""
NEXTAUTH_SECRET=""
OPENAI_API_KEY=""
```

Make sure each variable has a valid value before running the project.

---

## **Run the Project**

### **Development**

```bash
npm run dev
```

Now open:
**[http://localhost:3000](http://localhost:3000)**

### **Production Build**

```bash
npm run build
npm run start
```

---

## **Project Structure (Simplified)**

```
app/
  api/
  (routes, pages, components)
components/
lib/
styles/
public/
```

---

## **Deployment**

The project runs smoothly on platforms like:

* **Vercel** (recommended)
* Railway / Render
* Any Node.js hosting

Make sure to add your environment variables to your hosting provider.

---

## **License**

This project doesn’t include a license yet.
If you want to make your repository open-source, I recommend choosing **MIT License** — I can generate it for you anytime.

---

## **Author**

Developed by **Vaskar Bhattacharjee**

If you want, I can also add:

* CONTRIBUTING.md
* LICENSE file
* Badges (build, version, tech stack)
* A cleaner repo structure layout

Just tell me!
