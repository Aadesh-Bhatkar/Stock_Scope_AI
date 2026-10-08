# StockScope AI — AI Stock Research Dashboard

> **"Understand the market. Explore the numbers."**

StockScope AI is an interactive, beginner-friendly web application designed for students and novice investors to explore historical stock prices, understand key financial metrics (P/E ratio, market cap, profit margins, balance sheet health), compare companies side-by-side, and receive plain-English financial explanations powered by Google Gemini AI.

> ⚠️ **Educational Disclaimer:** StockScope AI is an educational stock research tool for students and beginners. It is **NOT** a trading platform, does not execute transactions, and does not provide personalized investment advice or guaranteed price targets.

---

## Features

- **Stock Search & Explorer:** Search US and Indian exchanges (NASDAQ, NYSE, NSE) by company name or ticker symbol (e.g., Apple, Microsoft, NVIDIA, Amazon, Alphabet, Tesla, Reliance Industries, TCS).
- **Stock Overview Cards:** Latest available price, daily price and percentage changes with green/red directional indicators, market capitalization, 52-week high/low, trading volume, and P/E ratio.
- **Interactive Stock Price Chart:** Recharts-powered interactive line/area chart with hover tooltips, date labels, price axis, range selectors (**1M, 3M, 6M, 1Y, 5Y**), and a toggleable volume bar chart.
- **Financial Snapshot:** Clear accounting metrics including Total Revenue, Net Income, Net Profit Margin, Earnings Per Share (EPS), P/E Ratio, Debt-to-Equity Ratio, and Return on Equity (ROE), with plain-English explanations and reporting periods.
- **Company Comparison:** Side-by-side comparative analysis of two companies with a detailed comparison table and an interactive Recharts Bar Chart allowing users to switch between Revenue, Net Income, Market Cap, P/E Ratio, and Profit Margin.
- **Ask StockScope AI:** Chat interface providing educational financial explanations powered by Google Gemini (`gemini-3.8-flash`), grounded strictly in official data without inventing news.
- **AI Research Summary Report:** One-click structured research brief generating Company Overview, Price Performance, Financial Health, Potential Strengths, Potential Risks, Questions for Further Research, and Data Sources, with a one-click copy function.
- **Watchlist:** Browser `localStorage`-backed watchlist for saving and tracking multiple companies across sessions.
- **Learn Stock Market Basics:** Educational module explaining what stocks are, Market Cap, P/E ratio, Revenue vs. Profit, Dividends, Volatility, and Historical vs. Future returns, complete with an interactive student quiz.

---

## Step-by-Step Setup and Deployment Guide

### 1. How to Install Node.js

1. Visit the official Node.js website: [https://nodejs.org/](https://nodejs.org/).
2. Download the **LTS (Long Term Support)** version for your operating system (Windows, macOS, or Linux).
3. Run the installer and follow the on-screen prompts.
4. Verify the installation by opening your terminal or command prompt and running:
   ```bash
   node -v
   npm -v
   ```
   *Node.js v18 or higher is recommended.*

### 2. How to Open the Project in VS Code

1. Download and install [Visual Studio Code](https://code.visualstudio.com/) if you haven't already.
2. Open VS Code.
3. Click on **File > Open Folder...** (or press `Cmd+O` on macOS / `Ctrl+O` on Windows).
4. Navigate to the project folder and click **Select Folder**.
5. Open the integrated terminal inside VS Code by pressing ``Ctrl+` `` or navigating to **Terminal > New Terminal**.

### 3. How to Run `npm install`

In the terminal inside your project directory, install all required dependencies:

```bash
npm install
```

This installs React, Vite, Tailwind CSS, Recharts, Lucide React, Express, `@google/genai`, and all TypeScript development types.

### 4. How to Start the Application with `npm run dev`

To run the full-stack development server:

```bash
npm run dev
```

The application will start on:
```
http://localhost:3000
```
Open this URL in your web browser to view StockScope AI.

### 5. How to Configure Stock Data API Credentials

StockScope AI comes with a verified educational baseline dataset for benchmark stocks (Apple, Microsoft, NVIDIA, Amazon, Alphabet, Tesla, Meta, AMD, Reliance Industries, and TCS).

If you want to pull live quotes for any global US ticker:
1. Sign up for a free API key at [Finnhub Stock API](https://finnhub.io/).
2. Copy your free API token.
3. Create a `.env` file in the root directory (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Add your API key:
   ```env
   FINNHUB_API_KEY="your_finnhub_api_key_here"
   ```
5. If no API key is set, the application automatically runs in Educational Baseline mode with transparent disclosures.

### 6. How to Configure Gemini API Credentials

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. In your `.env` file, add:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```
3. In Google AI Studio Build, the key is automatically injected via the **Settings > Secrets** panel.
4. If no Gemini key is provided, the application remains fully functional and provides structured baseline educational breakdowns.

### 7. How to Deploy on Vercel

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of StockScope AI"
   git remote add origin https://github.com/your-username/stockscope-ai.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
3. Click **Add New... > Project**.
4. Import your `stockscope-ai` repository.
5. In **Framework Preset**, select **Vite**.
6. The Build Command will default to `npm run build` and Output Directory to `dist`.
7. Click **Deploy**.

### 8. How to Add Environment Variables in Vercel

1. In your Vercel project dashboard, navigate to **Settings > Environment Variables**.
2. Add the following variables:
   - Key: `GEMINI_API_KEY`, Value: `your_gemini_api_key`
   - Key: `FINNHUB_API_KEY`, Value: `your_finnhub_api_key` (optional)
3. Select all environments (**Production**, **Preview**, **Development**).
4. Click **Save**.

### 9. How to Redeploy After Changing Environment Variables

In Vercel, newly added environment variables take effect on the **next build**:
1. Go to the **Deployments** tab in your Vercel dashboard.
2. Find your latest deployment, click the **...** (three dots) menu on the right.
3. Select **Redeploy**.
4. Alternatively, push a new commit to your `main` branch to trigger an automatic redeployment.

---

## Security Stance

- API keys (`GEMINI_API_KEY`, `FINNHUB_API_KEY`) are accessed strictly on the server-side via Node.js/Vercel functions.
- Never commit `.env` containing secret keys to version control. `.gitignore` is configured to exclude all `.env*` files with secrets.

---

## License

Apache-2.0
