from playwright.sync_api import sync_playwright
import pandas as pd
import time
from urllib.parse import quote_plus

BASE_URL = "https://demos.telerik.com"

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # 1. Navigate to login page and perform navigation
    page.goto(f"{BASE_URL}/aspnet-core/eshop/Account/Login?ReturnUrl=%2Faspnet-core%2Feshop")
    page.get_by_role("button", name="Login").click()
    page.get_by_role("menuitem", name="Categories").locator("svg").click()
    page.get_by_role("menuitem", name="Bikes").get_by_role("link").click()
    page.get_by_role("link", name="Road Bikes").click()
    page.get_by_text("Discounted items only").click()
    page.get_by_role("checkbox", name="62").check()

    # 2. Wait for product list to load
    page.wait_for_selector("div.k-card-body")

    all_offers = []

    # 3. Loop through all pages to scrape base product info + details
    while True:
        print("Scraping product cards on current page...")

        product_cards = page.query_selector_all("div.k-card-body")

        for card in product_cards:
            title_el = card.query_selector("div.card-title")
            price_el = card.query_selector("div.card-price")
            rate_el = card.query_selector("span.rating-text")
            link_el = card.query_selector("div.k-card-header a")  # Detail page link

            title = title_el.inner_text().strip() if title_el else None
            price = price_el.inner_text().strip() if price_el else None
            rate = rate_el.inner_text().strip() if rate_el else None

            href = None
            if link_el:
                href = link_el.get_attribute("href")
                if href and not href.startswith("http"):
                    href = BASE_URL + href

            extra_data = {}

            # 4. Scrape additional details from product detail page if available
            if href:
                detail_page = context.new_page()
                detail_page.route("**/*.{png,jpg,jpeg}", lambda route: route.abort())
                print(f"Opening product detail page: {href}")
                detail_page.goto(href)
                detail_page.wait_for_selector("div.model-data-left-container")

                container = detail_page.query_selector("div.model-data-left-container")

                def get_value_by_title(title_text):
                    row = container.query_selector(f"div.model-data-row:has(span.title:text-is('{title_text}'))")
                    if row:
                        val_el = row.query_selector("span.value")
                        if val_el:
                            return val_el.inner_text().strip()
                    return ""

                product_name = get_value_by_title("Product Name")
                product_no = get_value_by_title("Product No")
                size = get_value_by_title("Size")
                weight = get_value_by_title("Weight")
                description = get_value_by_title("Description")

                color = ""
                color_ul = container.query_selector("ul#colorPicker")
                if color_ul:
                    label = color_ul.query_selector("label.k-radio-label")
                    if label:
                        color = label.inner_text().strip()

                extra_data = {
                    "Product Name": product_name,
                    "Product No": product_no,
                    "Size": size,
                    "Weight": weight,
                    "Color": color,
                    "Description": description,
                }

                detail_page.close()

            offer = {
                "Title": title,
                "Price": price,
                "Rate": rate,
                "Detail URL": href,
            }
            offer.update(extra_data)

            all_offers.append(offer)

        # 5. Pagination: check if Next page exists and enabled, else break
        next_btn = page.query_selector("a[aria-label='Next']")
        if not next_btn or "k-state-disabled" in next_btn.get_attribute("class"):
            print("No next page found or button disabled. Scraping complete.")
            break
        else:
            print("Clicking next page...")
            next_btn.click()
            page.wait_for_load_state("networkidle")
            time.sleep(2)

    # 6. Save initial scraped data
    df = pd.DataFrame(all_offers)
    df.to_csv("output-eshop-detailed.csv", index=False)
    print(f"✅ Saved {len(df)} products to output-eshop-detailed.csv")

    # 7. Now, search each product title from CSV by direct URL and scrape matching data
    search_and_scrape_matches(page, "output-eshop-detailed.csv")

    # 8. Close everything cleanly
    context.close()
    browser.close()


def search_and_scrape_matches(page, csv_path):
    df = pd.read_csv(csv_path)
    results = []

    for _, row in df.iterrows():
        product_name = row["Title"]

        # 1. Navigate directly to search URL with encoded product name
        search_term = product_name.split(",")[0].strip()  # Keeps only part before comma, trimmed
        search_url = f"{BASE_URL}/aspnet-core/eshop/Products/Summary?searchParam={quote_plus(search_term)}"
        page.goto(search_url)
        print(f"Searching for: {product_name}")

        page.wait_for_selector("div.k-listview-content")

        # 2. Loop through paginated search results
        while True:
            product_cards = page.query_selector_all("div.k-card-body")

            for card in product_cards:
                title_el = card.query_selector("div.card-title")
                price_el = card.query_selector("div.card-price")
                rate_el = card.query_selector("span.rating-text")

                title = title_el.inner_text().strip() if title_el else ""
                price = price_el.inner_text().strip() if price_el else ""
                rate = rate_el.inner_text().strip() if rate_el else ""

                if product_name.lower() in title.lower():
                    results.append({
                        "Searched Title": product_name,
                        "Found Title": title,
                        "Price": price,
                        "Rate": rate
                    })

            next_button = page.query_selector("a.k-link[title='Go to the next page']")
            if next_button and "k-state-disabled" not in next_button.get_attribute("class"):
                next_button.click()
                page.wait_for_selector("div.k-listview-content")
                time.sleep(1)
            else:
                break

    # 3. Save matched search results
    matches_df = pd.DataFrame(results)
    matches_df.to_csv("matched_results.csv", index=False)
    print(f"✅ Saved {len(matches_df)} matched results to matched_results.csv")


if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
